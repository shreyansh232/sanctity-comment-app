export interface User {
  id: number;
  username: string;
  password?: string;
  createdAt: Date;
  comments: Comment[];
  notifications: Notification[];
}
