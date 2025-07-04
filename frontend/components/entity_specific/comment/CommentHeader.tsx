"use client";

import React from "react";
import { MessageCircle, Bell, User as UserIcon } from "lucide-react";
import { User, Notification } from "@/types/common";

interface CommentHeaderProps {
  user: User | null;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  logout: () => void;
  markNotificationAsRead: (id: number) => Promise<boolean>;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({
  user,
  notifications,
  showNotifications,
  setShowNotifications,
  logout,
  markNotificationAsRead,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100/50 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#469BF7] rounded-xl flex items-center justify-center shadow-sm">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Discussion</h1>
              <p className="text-sm text-gray-500">
                Share your thoughts with the community
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200 hover:cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-20">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500 text-center">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 ${
                            !notification.isRead ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            if (!notification.isRead) {
                              markNotificationAsRead(notification.id);
                            }
                          }}
                        >
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.createdAt.toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#469BF7] rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 font-medium">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CommentHeader;
