// Cron endpoint for processing scheduled notifications
// This should be called periodically (e.g., every hour) by an external scheduler
// or Cloudflare Cron Trigger

interface Env {
  COUNTDOWNS: KVNamespace;
  BOT_TOKEN: string;
}

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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // Simple auth check - you might want to use a secret token
  const url = new URL(context.request.url);
  const cronSecret = url.searchParams.get('secret');
  
  // In production, validate the secret
  // if (cronSecret !== context.env.CRON_SECRET) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  if (!context.env.BOT_TOKEN) {
    return new Response(JSON.stringify({ error: 'BOT_TOKEN not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const results: { userId: number; holidayId: string; success: boolean; error?: string }[] = [];
  
  try {
    // List all countdown keys
    const list = await context.env.COUNTDOWNS.list({ prefix: 'countdown:' });
    
    for (const key of list.keys) {
      try {
        const data = await context.env.COUNTDOWNS.get(key.name);
        if (!data) continue;
        
        const countdown: CountdownData = JSON.parse(data);
        const daysUntil = getDaysUntil(countdown.date);
        
        // Skip if countdown is in the past (more than a day ago)
        if (daysUntil < 0) {
          // Optionally delete old countdowns
          // await context.env.COUNTDOWNS.delete(key.name);
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
        const success = await sendTelegramMessage(context.env.BOT_TOKEN, countdown.userId, message);
        
        if (success) {
          // Update lastNotified
          countdown.lastNotified = notifyKey;
          await context.env.COUNTDOWNS.put(key.name, JSON.stringify(countdown));
        }
        
        results.push({
          userId: countdown.userId,
          holidayId: countdown.holidayId,
          success,
        });
      } catch (error) {
        console.error(`Error processing countdown ${key.name}:`, error);
        results.push({
          userId: 0,
          holidayId: key.name,
          success: false,
          error: String(error),
        });
      }
    }
    
    return new Response(JSON.stringify({ 
      processed: results.length,
      results,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Cron error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
