export interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string | null;
}

export interface Comment {
  id: number;
  userId: number;
  username?: string;
  content: string;
  parentId: number | null;
  parent_id?: number;
  createdAt?: string;
  created_at?: string;
  edited_at?: string;
  deletedAt?: string;
  deleted_at?: string;
  is_deleted?: boolean;
  replies: Comment[];
}

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  commentId: number;
}
