"use client";

import React, { useState, useEffect, useRef } from "react";

import { isLoggedIn, decodeJwtToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import CommentHeader from "@/components/entity_specific/comment/CommentHeader";
import NewCommentForm from "@/components/entity_specific/comment/NewCommentForm";
import CommentList from "@/components/entity_specific/comment/CommentList";
import {
  User,
  Comment,
  Notification,
  NotificationFromApi,
} from "@/types/common";

const CommentSystem = () => {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

  const router = useRouter();

  // API Base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE + "/comments";
  const NOTIFICATION_API_BASE =
    process.env.NEXT_PUBLIC_API_BASE + "/notifications"; // New notification API base

  const logout = () => {
    setUser(null);
    setComments([]);
    setNotifications([]);
    // In a real app, clear token from localStorage and redirect to signin
    localStorage.removeItem("token");
    router.push("/signin");
  };

  // API calls
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      setError("Failed to fetch comments");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    try {
      const response = await fetch(NOTIFICATION_API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const parsedNotifications = data.map((n: NotificationFromApi) => ({
          ...n,
          isRead: n.is_read,
          createdAt: new Date(n.created_at),
        }));
        setNotifications(parsedNotifications);
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };
  // Check login status and redirect
  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/signin");
    } else {
      const token = localStorage.getItem("token"); // Assuming your token is stored as 'token'
      if (token) {
        const decodedUser = decodeJwtToken(token);
        if (decodedUser) {
          setUser({
            id: decodedUser.id,
            username: decodedUser.username,
            avatar: null,
          });
          console.log("Logged-in user ID:", decodedUser.id);
          fetchComments();
          fetchNotifications(); // Fetch notifications on login
        } else {
          // Handle case where token is invalid or decoding fails
          console.error("Failed to decode user information from token.");
          router.push("/signin"); // Redirect if user data can't be obtained
        }
      } else {
        router.push("/signin"); // Redirect if no token found (should be covered by isLoggedIn too)
      }
    }
  }, [router, fetchComments, fetchNotifications]);

  const createComment = async (
    content: string,
    parentId: number | null = null
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/createComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, parentId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchComments();
          await fetchNotifications(); // Refresh notifications after creating a comment (in case of reply)
          return true;
        }
      }
      return false;
    } catch (err) {
      setError("Failed to create comment");
      console.error("Error:", err);
      return false;
    }
  };

  const updateComment = async (id: number, content: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/updateComment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        await fetchComments();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update comment");
      console.error("Error:", err);
      return false;
    }
  };

  const deleteComment = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/deleteComment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchComments();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete comment");
      console.error("Error:", err);
      return false;
    }
  };

  const restoreComment = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/restoreComment/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchComments();
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to restore comment");
      console.error("Error:", err);
      return false;
    }
  };

  const markNotificationAsRead = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return false;
    }

    try {
      const response = await fetch(`${NOTIFICATION_API_BASE}/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchNotifications(); // Refresh notifications after marking as read
        return true;
      }
      console.error("Failed to mark notification as read");
      return false;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  };

  // Comment handlers
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const success = await createComment(newComment);
    if (success) {
      setNewComment("");
    }
  };

  const handleAddReply = async (parentId: number, content: string) => {
    if (!content.trim()) return false;
    console.log(newReply);

    const success = await createComment(content, parentId);
    if (success) {
      setReplyingTo(null);
      setNewReply("");
    }
    return success;
  };

  const handleEditComment = async (id: number, content: string) => {
    const success = await updateComment(id, content);
    if (success) {
      setEditingComment(null);
    }
    return success;
  };

  // Utility function to parse dates consistently
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    try {
      let parsedDate;

      if (dateString.includes("T") && dateString.includes("Z")) {
        // Already in ISO format
        parsedDate = new Date(dateString);
      } else if (dateString.includes(" ")) {
        // Format: "2025-07-03 07:44:52.892"
        const isoString = dateString.replace(" ", "T") + "Z";
        parsedDate = new Date(isoString);
      } else {
        parsedDate = new Date(dateString);
      }

      if (isNaN(parsedDate.getTime())) {
        return null;
      }

      return parsedDate;
    } catch (error) {
      console.error("Date parsing error:", error);
      return null;
    }
  };

  // Utility function to convert UTC to IST
  const convertToIST = (utcDate: Date): Date => {
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    return new Date(utcDate.getTime() + istOffset);
  };

  // Updated canEdit function
  const canEdit = (comment: Comment) => {
    if (!user || comment.userId !== user.id) return false;

    const createdAtField = comment.createdAt || comment.created_at;
    if (!createdAtField) return false;

    const createdDate = parseDate(createdAtField);
    if (!createdDate) return false;

    // Convert to IST for comparison
    const createdDateIST = convertToIST(createdDate);
    const now = new Date();

    // Check if creation was within last 15 minutes
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const timeSinceCreation = now.getTime() - createdDateIST.getTime();

    return timeSinceCreation <= fifteenMinutesInMs;
  };

  // Updated canRestore function
  const canRestore = (comment: Comment) => {
    console.log("=== CANRESTORE DEBUG START ===");
    console.log("Comment ID:", comment.id);
    console.log("User ID:", user?.id);
    console.log("Comment User ID:", comment.userId);
    console.log("Is deleted:", comment.is_deleted);
    console.log("Deleted at (camelCase):", comment.deletedAt);
    console.log("Deleted at (snake_case):", comment.deleted_at); // Check this field too

    // Check basic conditions
    if (!user) {
      console.log("❌ No user logged in");
      return false;
    }

    if (comment.userId !== user.id) {
      console.log("❌ Not comment owner");
      return false;
    }

    if (!comment.is_deleted) {
      console.log("❌ Comment not deleted");
      return false;
    }

    // Check both possible field names for deletedAt
    const deletedAtField = comment.deletedAt || comment.deleted_at;
    if (!deletedAtField) {
      console.log("❌ No deletedAt timestamp");
      return false;
    }

    const deletedDate = parseDate(deletedAtField);
    if (!deletedDate) {
      console.log("❌ Could not parse deleted date");
      return false;
    }

    // Convert to IST for comparison
    const deletedDateIST = convertToIST(deletedDate);
    const now = new Date();

    // Check if deletion was within last 15 minutes
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const timeSinceDeletion = now.getTime() - deletedDateIST.getTime();
    const minutesSinceDeletion = Math.floor(timeSinceDeletion / 60000);

    console.log("Deleted at (UTC):", deletedDate.toString());
    console.log("Deleted at (IST):", deletedDateIST.toString());
    console.log("Current time:", now.toString());
    console.log("Time since deletion (ms):", timeSinceDeletion);
    console.log("Minutes since deletion:", minutesSinceDeletion);
    console.log("Within 15 minutes?:", timeSinceDeletion <= fifteenMinutesInMs);

    const canRestore = timeSinceDeletion <= fifteenMinutesInMs;
    console.log("✅ Can restore:", canRestore);
    console.log("=== CANRESTORE DEBUG END ===");

    return canRestore;
  };

  const toggleExpanded = (commentId: number) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  // Build comment tree
  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const currentParentId = comment.parent_id || comment.parentId;

      if (typeof currentParentId === "number") {
        const parent = commentMap.get(currentParentId);
        if (parent) {
          const replyComment = commentMap.get(comment.id);
          if (replyComment) {
            parent.replies.push(replyComment);
          }
        }
      } else {
        const rootComment = commentMap.get(comment.id);
        if (rootComment) {
          rootComments.push(rootComment);
        }
      }
    });

    return rootComments;
  };

  const commentTree = buildCommentTree(comments);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [newComment]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <CommentHeader
        user={user}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        logout={logout}
        markNotificationAsRead={markNotificationAsRead}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <NewCommentForm
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          loading={loading}
          textareaRef={textareaRef}
        />

        <CommentList
          commentTree={commentTree}
          loading={loading}
          error={error}
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
          formatTimeAgo={(date: string) => {
            if (!date) return "N/A";

            try {
              let commentDate;

              // Try to parse the date in different formats
              if (date.includes("T") && date.includes("Z")) {
                // Already in ISO format
                commentDate = new Date(date);
              } else if (date.includes(" ")) {
                // Format: "2025-07-03 07:44:52.892"
                const isoString = date.replace(" ", "T") + "Z";
                commentDate = new Date(isoString);
              } else {
                commentDate = new Date(date);
              }

              if (isNaN(commentDate.getTime())) {
                return "Invalid Date";
              }

              // Add 5.5 hours (IST offset) to the comment time
              const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
              const commentDateIST = new Date(
                commentDate.getTime() + istOffset
              );

              // Current time
              const now = new Date();

              // Calculate difference
              const diffMs = now.getTime() - commentDateIST.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);

              if (diffMins < 1) return "Just now";
              if (diffMins < 60) return `${diffMins}m ago`;
              if (diffHours < 24) return `${diffHours}h ago`;
              return `${diffDays}d ago`;
            } catch (error) {
              console.error("Date parsing error:", error);
              return "Invalid Date";
            }
          }}
        />
      </main>
    </div>
  );
};

export default CommentSystem;
