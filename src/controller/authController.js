import { response, request } from "express";
import { usersTable } from "../db/schema.js";
import bcrypt from "bcrypt";
import { db } from "../db/database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { eq } from "drizzle-orm";

/**
 *
 * @param {request} req
 * @param {response} res
 */
export const register = async (req, res) => {
  try {
    const { email, first_name, last_name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }
    const [result] = await db
      .insert(usersTable)
      .values({
        email,
        first_name,
        last_name,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        first_name: usersTable.first_name,
        last_name: usersTable.last_name,
      });
    const token = jwt.sign(
      {
        userId: result.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(201).json({
      message: "User Created",
      user: 
      {
        email: result.email,
        first_name: result.first_name,
        last_name: result.last_name,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to register",
      errorMessage: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!user) {
      return res.status(401).json({ error: "invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "invalid email or password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.status(200).json({
      message: "User logged in successfully",
      userData: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
};

export const recover = async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (error) {
    console.error(`Error on recovering user data : ${error}`);
    return res.status(500).json({ user: "Failed to recover infos" });
  }
};
