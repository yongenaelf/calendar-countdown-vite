// Notification service for Telegram Mini App

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api/notifications`;

interface RegisterNotificationParams {
  userId: number;
  holidayId: string;
  name: string;
  date: Date;
  icon: string;
  reminderOption: string;
  initData: string;
}

export async function registerCountdownNotification(params: RegisterNotificationParams): Promise<boolean> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: params.userId,
        holidayId: params.holidayId,
        name: params.name,
        date: params.date.toISOString(),
        icon: params.icon,
        reminderOption: params.reminderOption,
        initData: params.initData,
      }),
    });

    if (!response.ok) {
      console.error('Failed to register notification:', await response.text());
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error registering notification:', error);
    return false;
  }
}

export async function removeCountdownNotification(userId: number, holidayId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}?userId=${userId}&holidayId=${holidayId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Failed to remove notification:', await response.text());
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error removing notification:', error);
    return false;
  }
}

export async function clearAllCountdownNotifications(userId: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}?userId=${userId}&clearAll=true`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Failed to clear all notifications:', await response.text());
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error clearing all notifications:', error);
    return false;
  }
}
