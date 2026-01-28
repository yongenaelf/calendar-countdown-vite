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
  lastNotified?: string;
}

// Get Redis instance from app.locals
function getRedis(req: Request): Redis {
  return req.app.locals.redis;
}

// Send message via Telegram Bot API
async function sendTelegramMessage(botToken: string, chatId: number, text: string) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to send Telegram message:', error);
    return false;
  }
  
  return true;
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

// Calculate days until date
function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Check if we should send notification based on reminder option
function shouldNotify(reminderOption: string, daysUntil: number): boolean {
  switch (reminderOption) {
    case 'on_day':
      return daysUntil === 0;
    case '1_day':
      return daysUntil === 1 || daysUntil === 0;
    case '3_days':
      return daysUntil === 3 || daysUntil === 1 || daysUntil === 0;
    case '1_week':
      return daysUntil === 7 || daysUntil === 3 || daysUntil === 1 || daysUntil === 0;
    case '2_weeks':
      return daysUntil === 14 || daysUntil === 7 || daysUntil === 3 || daysUntil === 1 || daysUntil === 0;
    default:
      return false;
  }
}

// Format notification message
function formatNotificationMessage(name: string, daysUntil: number, icon: string): string {
  const emoji = getEmojiFromIcon(icon);
  
  if (daysUntil === 0) {
    return `🎉 <b>It's time!</b>\n\n${emoji} <b>${name}</b> is TODAY!\n\nHave an amazing celebration! 🥳`;
  } else if (daysUntil === 1) {
    return `⏰ <b>Tomorrow!</b>\n\n${emoji} <b>${name}</b> is just 1 day away!\n\nGet ready to celebrate! 🎊`;
  } else if (daysUntil === 3) {
    return `📅 <b>3 Days to Go!</b>\n\n${emoji} <b>${name}</b> is in 3 days!\n\nThe excitement is building... ✨`;
  } else if (daysUntil === 7) {
    return `📆 <b>1 Week Away!</b>\n\n${emoji} <b>${name}</b> is in 1 week!\n\nTime to start preparing! 🎯`;
  } else if (daysUntil === 14) {
    return `🗓️ <b>2 Weeks Notice!</b>\n\n${emoji} <b>${name}</b> is in 2 weeks!\n\nPlenty of time to plan something special! 💫`;
  } else {
    return `📅 <b>Reminder</b>\n\n${emoji} <b>${name}</b> is in ${daysUntil} days!\n\nThe countdown continues... ⏳`;
  }
}

// GET - Process scheduled notifications (cron job)
router.get('/', async (req: Request, res: Response) => {
  // Simple auth check - you might want to use a secret token
  // const cronSecret = req.query.secret;
  // if (cronSecret !== process.env.CRON_SECRET) {
  //   res.status(401).json({ error: 'Unauthorized' });
  //   return;
  // }

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    res.status(500).json({ error: 'BOT_TOKEN not configured' });
    return;
  }

  const redis = getRedis(req);
  const results: { userId: number; holidayId: string; success: boolean; error?: string }[] = [];
  
  try {
    // List all countdown keys using SCAN (better than KEYS for production)
    const keys: string[] = [];
    let cursor = '0';
    do {
      const [nextCursor, foundKeys] = await redis.scan(cursor, 'MATCH', 'countdown:*', 'COUNT', 100);
      cursor = nextCursor;
      keys.push(...foundKeys);
    } while (cursor !== '0');
    
    for (const key of keys) {
      try {
        const data = await redis.get(key);
        if (!data) continue;
        
        const countdown: CountdownData = JSON.parse(data);
        const daysUntil = getDaysUntil(countdown.date);
        
        // Skip if countdown is in the past (more than a day ago)
        if (daysUntil < 0) {
          // Optionally delete old countdowns
          // await redis.del(key);
          continue;
        }
        
        // Check if we should send notification
        if (!shouldNotify(countdown.reminderOption, daysUntil)) {
          continue;
        }
        
        // Check if we already notified today
        const today = new Date().toISOString().split('T')[0];
        const notifyKey = `${daysUntil}:${today}`;
        if (countdown.lastNotified === notifyKey) {
          continue;
        }
        
        // Send notification
        const message = formatNotificationMessage(countdown.name, daysUntil, countdown.icon);
        const success = await sendTelegramMessage(botToken, countdown.userId, message);
        
        if (success) {
          // Update lastNotified
          countdown.lastNotified = notifyKey;
          await redis.set(key, JSON.stringify(countdown));
        }
        
        results.push({
          userId: countdown.userId,
          holidayId: countdown.holidayId,
          success,
        });
      } catch (error) {
        console.error(`Error processing countdown ${key}:`, error);
        results.push({
          userId: 0,
          holidayId: key,
          success: false,
          error: String(error),
        });
      }
    }
    
    res.json({ 
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error('Cron error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
