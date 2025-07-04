"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Edit3,
  Trash2,
  RotateCcw,
  Reply,
  Send,
  User as UserIcon,
  Clock,
  Check,
  X,
  ArrowUp,
} from "lucide-react";
import { User, Comment } from "@/types/common";

interface CommentItemProps {
  comment: Comment;
  depth?: number;
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

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  depth = 0,
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
  const [editContent, setEditContent] = useState(comment.content);
  const isExpanded = expandedComments.has(comment.id);
  const [newReplyContent, setNewReplyContent] = useState("");


  return (
    <div
      className={`transition-all duration-200 ${
        depth > 0 ? "ml-8 mt-4" : "mb-6"
      }`}
    >
      <div className="group relative">
        {/* Connection line for nested comments */}
        {depth > 0 && (
          <div className="absolute -left-6 top-0 w-px h-full bg-[#469BF7]"></div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200/50 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 transition-opacity duration-300"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-[#469BF7] rounded-full flex items-center justify-center shadow-sm">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {comment.username}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatTimeAgo(comment.created_at || "")}
                    </span>
                  </div>
                  {comment.edited_at && (
                    <span className="text-xs text-gray-400 flex items-center mt-1">
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edited
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {comment.userId === user?.id && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {canEdit(comment) && !comment.is_deleted && (
                    <button
                      onClick={() => setEditingComment(comment.id)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200 hover:cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {!comment.is_deleted && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 hover:cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {canRestore(comment) && (
                    <button
                      onClick={() => restoreComment(comment.id)}
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors duration-200 hover:cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Content */}
            {comment.is_deleted ? (
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-gray-300">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Trash2 className="w-4 h-4" />
                  <span className="italic">This comment has been deleted</span>
                </div>
                {canRestore(comment) && (
                  <div className="mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Can be restored within 15 minutes
                  </div>
                )}
              </div>
            ) : editingComment === comment.id ? (
              <div className="space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white/50 backdrop-blur-sm"
                  rows={4}
                  placeholder="Edit your comment..."
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditComment(comment.id, editContent)}
                    className="px-4 py-2 bg-[#469BF7] text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2 hover:cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditingComment(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors duration-20 hover:cursor-pointer"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>

                {/* Engagement bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 px-3 py-1.5 rounded-full hover:bg-blue-50 transition-all duration-200 hover:cursor-pointer"
                    >
                      <Reply className="w-4 h-4" />
                      <span className="text-sm font-medium">Reply</span>
                    </button>

                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(comment.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-all duration-200 hover:cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {comment.replies.length}{" "}
                          {comment.replies.length === 1 ? "reply" : "replies"}
                        </span>
                        <ArrowUp
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {canEdit(comment) && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400 hover:cursor-pointer">
                      <Clock className="w-3 h-3" />
                      <span>Editable for 15 min</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-6 p-4 rounded-xl border border-blue-100/80">
                <div className="space-y-3">
                  <textarea
                    value={newReplyContent}
                    onChange={(e) => setNewReplyContent(e.target.value)}
                    placeholder="Write a thoughtful reply..."
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white/70 backdrop-blur-sm"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() =>
                        handleAddReply(comment.id, newReplyContent)
                      }
                      className="px-4 py-2 bg-[#469BF7] text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2 hover:cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setNewReplyContent("");
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl transition-colors duration-200 hover:cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
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
    </div>
  );
};

export default CommentItem;
