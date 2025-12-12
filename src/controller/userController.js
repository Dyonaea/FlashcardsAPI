import { desc, eq } from "drizzle-orm";
import { db } from "../db/database.js";
import { usersTable } from "../db/schema.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        first_name: usersTable.first_name,
        last_name: usersTable.last_name,
        email: usersTable.email,
        role: usersTable.role,
        creation_date: usersTable.creation_date,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.creation_date));
    return res.status(200).json({ users: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [user] = await db
      .select({
        id: usersTable.id,
        first_name: usersTable.first_name,
        last_name: usersTable.last_name,
        email: usersTable.email,
        role: usersTable.role,
        creation_date: usersTable.creation_date,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user) {
      return res.status(404).json({ error: `no user with id ${id}` });
    }
    return res.status(200).json({ user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve user" });
  }
};

//todo supr utilisateur a faire et documenter ce que l'on fait de ses collections
