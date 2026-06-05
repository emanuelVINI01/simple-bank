import { deleteSecureItem, getSecureJson, setSecureJson } from "@/lib/storage";

export type NotificationCursor = {
  initialized: boolean;
  lastSeenCreatedAt: string | null;
  lastSeenTransactionId: string | null;
  userId: string;
};

const CURSOR_PREFIX = "simple-bank.credit-notification-cursor";

export function getNotificationCursor(userId: string) {
  return getSecureJson<NotificationCursor>(getCursorKey(userId));
}

export function setNotificationCursor(cursor: NotificationCursor) {
  return setSecureJson(getCursorKey(cursor.userId), cursor);
}

export function clearNotificationCursor(userId: string) {
  return deleteSecureItem(getCursorKey(userId));
}

function getCursorKey(userId: string) {
  return `${CURSOR_PREFIX}.${userId}`;
}

