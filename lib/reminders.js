import { storage } from './storage';

const REMINDER_DISMISSED_KEY = 'smartdiabetes:reminderDismissedDate';

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WEEKDAY_LABELS = {
  Sunday: 'الأحد',
  Monday: 'الإثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة',
  Saturday: 'السبت',
};

export function isReminderDue(settings, now = new Date()) {
  if (!settings?.reminderDay || !settings?.reminderTime) return false;
  if (WEEKDAYS[now.getDay()] !== settings.reminderDay) return false;

  const [hours, minutes] = settings.reminderTime.split(':').map(Number);
  const reminderMinutes = hours * 60 + minutes;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= reminderMinutes;
}

export function isReminderDismissedToday(now = new Date()) {
  return storage.get(REMINDER_DISMISSED_KEY) === now.toDateString();
}

export function dismissReminderForToday(now = new Date()) {
  storage.set(REMINDER_DISMISSED_KEY, now.toDateString());
}

export function shouldShowReminderBanner(settings, now = new Date()) {
  return isReminderDue(settings, now) && !isReminderDismissedToday(now);
}
