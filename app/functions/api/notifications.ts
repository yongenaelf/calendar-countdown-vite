// Cloudflare Pages Function for handling countdown notifications

interface Env {
  COUNTDOWNS: KVNamespace;
  BOT_TOKEN: string;
}

interface CountdownData {
  userId: number;
  holidayId: string;
  name: string;
  date: string; // ISO date string
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

// Handle POST - Register a new countdown notification
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const payload: NotificationPayload = await context.request.json();
    const { userId, holidayId, name, date, icon, reminderOption, initData } = payload;
    
    if (!userId || !holidayId || !name || !date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Store countdown in KV
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
    await context.env.COUNTDOWNS.put(key, JSON.stringify(countdownData));
    
    // Also add to a list for the user
    const userListKey = `user:${userId}:countdowns`;
    const existingList = await context.env.COUNTDOWNS.get(userListKey);
    const countdownIds: string[] = existingList ? JSON.parse(existingList) : [];
    if (!countdownIds.includes(holidayId)) {
      countdownIds.push(holidayId);
      await context.env.COUNTDOWNS.put(userListKey, JSON.stringify(countdownIds));
    }
    
    // Send preview notification
    if (context.env.BOT_TOKEN) {
      const daysUntil = getDaysUntil(date);
      const message = formatNotificationMessage(name, daysUntil, icon, true);
      await sendTelegramMessage(context.env.BOT_TOKEN, userId, message);
    }
    
    return new Response(JSON.stringify({ success: true, message: 'Countdown registered' }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error registering countdown:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Handle DELETE - Remove a countdown notification (or all for a user)
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');
    const holidayId = url.searchParams.get('holidayId');
    const clearAll = url.searchParams.get('clearAll') === 'true';
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Clear all countdowns for user
    if (clearAll) {
      const userListKey = `user:${userId}:countdowns`;
      const existingList = await context.env.COUNTDOWNS.get(userListKey);
      
      if (existingList) {
        const countdownIds: string[] = JSON.parse(existingList);
        
        // Delete all countdown entries
        for (const id of countdownIds) {
          const key = `countdown:${userId}:${id}`;
          await context.env.COUNTDOWNS.delete(key);
        }
        
        // Clear the user's list
        await context.env.COUNTDOWNS.delete(userListKey);
      }
      
      // Send notification that all countdowns are cleared
      if (context.env.BOT_TOKEN) {
        const message = `🗑️ <b>All Cleared!</b>\n\nAll your countdown reminders have been removed.\n\nAdd new holidays anytime to start counting down again! 🎉`;
        await sendTelegramMessage(context.env.BOT_TOKEN, parseInt(userId), message);
      }
      
      return new Response(JSON.stringify({ success: true, message: 'All countdowns cleared' }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // Delete single countdown
    if (!holidayId) {
      return new Response(JSON.stringify({ error: 'Missing holidayId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const key = `countdown:${userId}:${holidayId}`;
    
    // Get countdown data before deleting (to get the name for notification)
    const countdownDataStr = await context.env.COUNTDOWNS.get(key);
    let countdownName = 'your event';
    if (countdownDataStr) {
      try {
        const countdownData: CountdownData = JSON.parse(countdownDataStr);
        countdownName = countdownData.name;
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    await context.env.COUNTDOWNS.delete(key);
    
    // Remove from user's list
    const userListKey = `user:${userId}:countdowns`;
    const existingList = await context.env.COUNTDOWNS.get(userListKey);
    if (existingList) {
      const countdownIds: string[] = JSON.parse(existingList);
      const updated = countdownIds.filter(id => id !== holidayId);
      await context.env.COUNTDOWNS.put(userListKey, JSON.stringify(updated));
    }
    
    // Send notification that countdown was removed
    if (context.env.BOT_TOKEN) {
      const message = `🗑️ <b>Countdown Removed</b>\n\nThe reminder for <b>${countdownName}</b> has been removed.\n\nYou won't receive notifications for this event anymore.`;
      await sendTelegramMessage(context.env.BOT_TOKEN, parseInt(userId), message);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error deleting countdown:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Handle OPTIONS for CORS
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
