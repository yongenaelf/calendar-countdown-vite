import { Router, Request, Response } from 'express';
import type Redis from 'ioredis';

const router = Router();

interface CountdownData {
  userId: number;
  holidayId: string;
  name: string;
  date: string;
  icon: string;
  reminderOption: string;
  createdAt: string;
}

interface NotificationPayload {
  userId: number;
  holidayId: string;
  name: string;
  date: string;
  icon: string;
  reminderOption: string;
  initData: string;
}

// Get Redis instance from app.locals
function getRedis(req: Request): Redis {
  return req.app.locals.redis;
}

// Send message via Telegram Bot API
async function sendTelegramMessage(botToken: string, chatId: number, text: string, parseMode: string = 'HTML') {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to send Telegram message:', error);
    throw new Error(`Telegram API error: ${error}`);
  }
  
  return response.json();
}

// Calculate days until date
function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Map icon name to emoji
function getEmojiFromIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    celebration: '🎉',
    cake: '🎂',
    forest: '🎄',
    flight_takeoff: '✈️',
    diamond: '💍',
    school: '🎓',
    emoji_events: '🏆',
    favorite: '❤️',
    star: '🌟',
    redeem: '🎁',
  };
  return iconMap[icon] || '🎉';
}

// Format notification message
function formatNotificationMessage(name: string, daysUntil: number, icon: string, isPreview: boolean = false): string {
  const emoji = getEmojiFromIcon(icon);
  
  if (isPreview) {
    return `${emoji} <b>Countdown Set!</b>\n\n` +
      `You'll be notified when <b>${name}</b> arrives!\n\n` +
      `📅 <b>${daysUntil}</b> days to go\n\n` +
      `<i>This is how your notification will look when the day comes:</i>\n\n` +
      `━━━━━━━━━━━━━━━━━━\n\n` +
      `🎉 <b>It's time!</b>\n\n` +
      `${emoji} <b>${name}</b> is TODAY!\n\n` +
      `Have an amazing celebration! 🥳`;
  }
  
  if (daysUntil === 0) {
    return `🎉 <b>It's time!</b>\n\n${emoji} <b>${name}</b> is TODAY!\n\nHave an amazing celebration! 🥳`;
  } else if (daysUntil === 1) {
    return `⏰ <b>Tomorrow!</b>\n\n${emoji} <b>${name}</b> is just 1 day away!\n\nGet ready to celebrate! 🎊`;
  } else {
    return `📅 <b>Reminder</b>\n\n${emoji} <b>${name}</b> is in ${daysUntil} days!\n\nThe countdown continues... ⏳`;
  }
}

// POST - Register a new countdown notification
router.post('/', async (req: Request, res: Response) => {
  try {
    const redis = getRedis(req);
    const payload: NotificationPayload = req.body;
    const { userId, holidayId, name, date, icon, reminderOption } = payload;
    
    if (!userId || !holidayId || !name || !date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    // Store countdown in Redis
    const countdownData: CountdownData = {
      userId,
      holidayId,
      name,
      date,
      icon,
      reminderOption,
      createdAt: new Date().toISOString(),
    };
    
    const key = `countdown:${userId}:${holidayId}`;
    await redis.set(key, JSON.stringify(countdownData));
    
    // Also add to a list for the user
    const userListKey = `user:${userId}:countdowns`;
    const existingList = await redis.get(userListKey);
    const countdownIds: string[] = existingList ? JSON.parse(existingList) : [];
    if (!countdownIds.includes(holidayId)) {
      countdownIds.push(holidayId);
      await redis.set(userListKey, JSON.stringify(countdownIds));
    }
    
    // Send preview notification
    const botToken = process.env.BOT_TOKEN;
    if (botToken) {
      const daysUntil = getDaysUntil(date);
      const message = formatNotificationMessage(name, daysUntil, icon, true);
      await sendTelegramMessage(botToken, userId, message);
    }
    
    res.json({ success: true, message: 'Countdown registered' });
  } catch (error) {
    console.error('Error registering countdown:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Remove a countdown notification (or all for a user)
router.delete('/', async (req: Request, res: Response) => {
  try {
    const redis = getRedis(req);
    const userId = req.query.userId as string;
    const holidayId = req.query.holidayId as string;
    const clearAll = req.query.clearAll === 'true';
    
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    
    const botToken = process.env.BOT_TOKEN;
    
    // Clear all countdowns for user
    if (clearAll) {
      const userListKey = `user:${userId}:countdowns`;
      const existingList = await redis.get(userListKey);
      
      if (existingList) {
        const countdownIds: string[] = JSON.parse(existingList);
        
        // Delete all countdown entries
        for (const id of countdownIds) {
          const key = `countdown:${userId}:${id}`;
          await redis.del(key);
        }
        
        // Clear the user's list
        await redis.del(userListKey);
      }
      
      // Send notification that all countdowns are cleared
      if (botToken) {
        const message = `🗑️ <b>All Cleared!</b>\n\nAll your countdown reminders have been removed.\n\nAdd new holidays anytime to start counting down again! 🎉`;
        await sendTelegramMessage(botToken, parseInt(userId), message);
      }
      
      res.json({ success: true, message: 'All countdowns cleared' });
      return;
    }
    
    // Delete single countdown
    if (!holidayId) {
      res.status(400).json({ error: 'Missing holidayId' });
      return;
    }
    
    const key = `countdown:${userId}:${holidayId}`;
    
    // Get countdown data before deleting (to get the name for notification)
    const countdownDataStr = await redis.get(key);
    let countdownName = 'your event';
    if (countdownDataStr) {
      try {
        const countdownData: CountdownData = JSON.parse(countdownDataStr);
        countdownName = countdownData.name;
      } catch {
        // Ignore parse errors
      }
    }
    
    await redis.del(key);
    
    // Remove from user's list
    const userListKey = `user:${userId}:countdowns`;
    const existingList = await redis.get(userListKey);
    if (existingList) {
      const countdownIds: string[] = JSON.parse(existingList);
      const updated = countdownIds.filter(id => id !== holidayId);
      await redis.set(userListKey, JSON.stringify(updated));
    }
    
    // Send notification that countdown was removed
    if (botToken) {
      const message = `🗑️ <b>Countdown Removed</b>\n\nThe reminder for <b>${countdownName}</b> has been removed.\n\nYou won't receive notifications for this event anymore.`;
      await sendTelegramMessage(botToken, parseInt(userId), message);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting countdown:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OPTIONS - CORS preflight (handled by cors middleware, but keeping for compatibility)
router.options('/', (req: Request, res: Response) => {
  res.status(204).send();
});

export default router;
