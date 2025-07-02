import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "6c2e1f312d365ac38f34292e96e0db131d5f359539a50368ca051b6418a0afb872a2db048bf5de5c81a9f85526a7ab332227e576223727bc3dc78d3f2500fd267798";

export const signup: RequestHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }
  try {
    const existingUserQuery = "SELECT * FROM users WHERE username = $1";
    const existingUser = await db.query(existingUserQuery, [username]);
    if (existingUser.rows.length > 0) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }

    //Hash passoword
    const hashedPassword = await bcrypt.hash(password, 10);

    const resultQuery =
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at";
    const result = await db.query(resultQuery, [username, hashedPassword]);
    res
      .status(201)
      .json({ success: true, message: "User signed up successfully" });
  } catch (error) {
    console.error("Error signing up", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }
  try {
    const resultQuery = "SELECT * FROM users WHERE username = $1";
    const result = await db.query(resultQuery, [username]);
    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    //JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ success: true, message: "Logged in", token });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ message: "Server error" });
  }
};
