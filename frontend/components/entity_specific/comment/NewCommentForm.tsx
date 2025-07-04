"use client";

import React from "react";
import { Send, Sparkles, User } from "lucide-react";

interface NewCommentFormProps {
  newComment: string;
  setNewComment: (content: string) => void;
  handleAddComment: () => void;
  loading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const NewCommentForm: React.FC<NewCommentFormProps> = ({
  newComment,
  setNewComment,
  handleAddComment,
  loading,
  textareaRef,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 p-6 mb-8 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-[gradient-to-br from-blue-50/30 via-transparent to-purple-50/20]"></div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#469BF7] rounded-full flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Share your thoughts
          </h2>
        </div>

        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What's on your mind? Share your perspective..."
          className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px] bg-white/70 backdrop-blur-sm"
        />

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Be respectful and constructive</span>
          </div>
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || loading}
            className="px-6 py-3 bg-[#469BF7] hover:bg-[#6da9e9] hover:cursor-pointer text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Post Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCommentForm;
