export interface Notification {
  id: number;
  message: string;
  userId: number;
  commentId: number;
  isRead: boolean;
  createdAt: Date;
}
