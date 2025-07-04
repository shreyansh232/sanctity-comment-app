"use client";

import React from "react";
import CommentItem from "./CommentItem";
import { User, Comment } from "@/types/common";

interface CommentListProps {
  commentTree: Comment[];
  loading: boolean;
  error: string;
  user: User | null;
  editingComment: number | null;
  setEditingComment: (id: number | null) => void;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  toggleExpanded: (id: number) => void;
  expandedComments: Set<number>;
  handleAddReply: (parentId: number, content: string) => Promise<boolean>;
  handleEditComment: (id: number, content: string) => Promise<boolean>;
  deleteComment: (id: number) => Promise<boolean>;
  restoreComment: (id: number) => Promise<boolean>;
  canEdit: (comment: Comment) => boolean;
  canRestore: (comment: Comment) => boolean;
  formatTimeAgo: (date: string) => string;
}

const CommentList: React.FC<CommentListProps> = ({
  commentTree,
  loading,
  error,
  user,
  editingComment,
  setEditingComment,
  replyingTo,
  setReplyingTo,
  toggleExpanded,
  expandedComments,
  handleAddReply,
  handleEditComment,
  deleteComment,
  restoreComment,
  canEdit,
  canRestore,
  formatTimeAgo,
}) => {
  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <div className="text-center text-gray-500">Loading comments...</div>
      ) : commentTree.length === 0 ? (
        <div className="text-center text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {commentTree.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              toggleExpanded={toggleExpanded}
              expandedComments={expandedComments}
              handleAddReply={handleAddReply}
              handleEditComment={handleEditComment}
              deleteComment={deleteComment}
              restoreComment={restoreComment}
              canEdit={canEdit}
              canRestore={canRestore}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CommentList;
