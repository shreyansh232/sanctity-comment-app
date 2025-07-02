export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  editedAt?: Date;
  parentId?: number;
  is_deleted: boolean;
  userId: number;
  deleted_at?: Date;
}
