import { Request, Response } from "express";
import db from "../config/db";
import { Comment } from "../types/comment";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

//Create a comment
export const createComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { content, parentId } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  try {
    const resultQuery =
      'INSERT INTO comments (content, parent_id, "userId") VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(resultQuery, [content, parentId, userId]);
    res.status(201).json({ success: true, data: result.rows[0] as Comment });
  } catch (error) {
    console.error("Error inserting comment", error);
    res.status(500).send("Server error");
  }
};

//Fetch all comments
export const getComments = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c."userId" = u.id ORDER BY c.created_at DESC'
    );
    res.json(result.rows as Comment[]);
  } catch (error) {
    console.error("Error fetching comments", error);
    res.status(500).send("Server error");
  }
};

//Fetch a comment
export const getCommentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM comments WHERE id = $1", [id]);
    const comment = result.rows[0] as Comment;
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (err) {
    console.error("Error fetching comment by ID:", err);
    res.status(500).send("Error fetching comment");
  }
};

//Update a comment
export const updateComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  try {
    const resultQuery = "SELECT * FROM comments WHERE id = $1";
    const result = await db.query(resultQuery, [id]);
    const comment = result.rows[0] as Comment;

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.userId !== userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to edit the comment" });
      return;
    }
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (comment.createdAt < fifteenMinutesAgo) {
      res.status(403).json({
        message: "Comments can only be edited within 15 minutes of posting",
      });
      return;
    }
    const updateQuery =
      "UPDATE comments SET content = $1, edited_at = NOW() WHERE id = $2 RETURNING *";
    const updatedResult = await db.query(updateQuery, [content, id]);
    res.json(updatedResult.rows[0] as Comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).send("Error updating comment");
  }
};

//Delete a comment
export const deleteComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  try {
    const result = await db.query("SELECT * FROM comments WHERE id = $1", [id]);
    const comment = result.rows[0] as Comment;
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.userId !== userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
      return;
    }
    const updatedResult = await db.query(
      "UPDATE comments SET is_deleted = TRUE, deleted_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(updatedResult.rows[0] as Comment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send("Error deleting comment");
  }
};

//Restore a comment within 15 minutes
export const restoreComment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const result = await db.query("SELECT * FROM comments WHERE id = $1", [id]);
    const comment = result.rows[0] as Comment;

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.userId !== userId) {
      res
        .status(403)
        .json({ message: "You are not authorized to restore this comment" });
      return;
    }

    if (!comment.is_deleted || !comment.deleted_at) {
      res.status(400).json({
        message:
          "Comment is not currently deleted or missing deletion timestamp",
      });
      return;
    }
    const timeCheckQuery = `
      SELECT 
        deleted_at,
        NOW() as current_time,
        (NOW() - INTERVAL '5.5 hours') as adjusted_time,
        EXTRACT(EPOCH FROM ((NOW() - INTERVAL '5.5 hours') - deleted_at)) as seconds_since_deletion,
        CASE 
          WHEN EXTRACT(EPOCH FROM ((NOW() - INTERVAL '5.5 hours') - deleted_at)) <= 900 THEN true 
          ELSE false 
        END as can_restore
      FROM comments 
      WHERE id = $1
    `;

    const timeCheckResult = await db.query(timeCheckQuery, [id]);
    const timeData = timeCheckResult.rows[0];

    if (!timeData.can_restore) {
      const minutesPassed = Math.floor(timeData.seconds_since_deletion / 60);
      res.status(403).json({
        message: `Comments can only be restored within 15 minutes of deletion. ${minutesPassed} minutes have passed.`,
      });
      return;
    }

    // Restore the comment
    const updatedResult = await db.query(
      "UPDATE comments SET is_deleted = FALSE, deleted_at = NULL WHERE id = $1 RETURNING *",
      [id]
    );

    res.json(updatedResult.rows[0] as Comment);
  } catch (error) {
    console.error("Error restoring comment:", error);
    res.status(500).send("Error restoring comment");
  }
};
