import { db } from "../db/database.js";
import { collectionsTable, usersTable } from "../db/schema.js";
import { eq, like, and } from "drizzle-orm";

export const createCollection = async (req, res) => {
  const { title, visibility, description } = req.body;
  if (!req.userId.userId) {
    return res.status(401).send({
      error: "You need to be logged in in order to create a collection",
    });
  }
  const userId = req.userId.userId;
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    if (user.length === 0) {
      return res.status(401).send({ error: "Error : User not found" });
    }
    const result = await db
      .insert(collectionsTable)
      .values({
        title: title,
        visibility: visibility,
        description: description,
        owner_id: userId,
      })
      .returning();
    return res.status(201).send({
      response: "Collection created with id " + result[0].id,
    });
  } catch (error) {
    console.error("Error inserting collection : ", error);
    return res.status(500).send({
      error: "Failed to insert collection",
      errorMessage: error,
    });
  }
};

export const getCollectionById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId.userId) {
      return res.status(401).send({
        error: "You need to be logged in in order to create a collection",
      });
    }
    const userId = req.userId.userId;
    const collection = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, id))
      .limit(1);
    if (collection.length === 0) {
      return res.status(404).send({ error: "Collection not found" });
    }
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    if (user.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    if (collection[0].visibility === "PRIVATE") {
      if (userId !== collection[0].owner_id && user[0].role !== "ADMIN") {
        return res
          .status(403)
          .send({ error: "You do not have access to this collection" });
      }
    }
    return res.status(200).send({ collection: collection[0] });
  } catch (error) {
    console.error("Error retrieving collection: ", error);
    return res.status(500).send({
      error: "Failed to retrieve collection: " + error,
    });
  }
};

export const getAllCollections = async (req, res) => {
  try {
    if (!req.userId || !req.userId.userId) {
      return res.status(401).send({
        error: "You need to be logged in to view your collections",
      });
    }
    const userId = req.userId.userId;
    const collections = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.owner_id, userId));
    return res.status(200).send({ collections: collections });
  } catch (error) {
    console.error("Error retrieving collections: ", error);
    return res.status(500).send({
      error: "Failed to retrieve collections",
      errorMessage: error,
    });
  }
};

export const updateCollection = async (req, res) => {
  const { id } = req.params;
  const { title, visibility, description } = req.body;

  if (!req.userId || !req.userId.userId) {
    return res.status(401).send({ error: "You need to be logged in" });
  }

  try {
    const existing = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).send({ error: "Collection not found" });
    }

    if (existing[0].owner_id !== req.userId.userId) {
      return res.status(403).send({ error: "You do not own this collection" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (visibility !== undefined) updateData.visibility = visibility;
    if (description !== undefined) updateData.description = description;

    const updated = await db
      .update(collectionsTable)
      .set(updateData)
      .where(eq(collectionsTable.id, id))
      .returning();

    return res.status(200).send({ collection: updated[0] });
  } catch (error) {
    console.error("Error updating collection : ", error);
    return res.status(500).send({
      error: "Failed to update collection",
      errorMessage: error,
    });
  }
};

export const searchCollections = async (req, res) => {
  const { query } = req.params;
  try {
    const collections = await db
      .select()
      .from(collectionsTable)
      .where(
        and(
          eq(collectionsTable.visibility, "PUBLIC"),
          like(collectionsTable.title, `%${query}%`)
        )
      );
    return res.status(200).send({ collections: collections });
  } catch (error) {
    console.error("Error searching collections: ", error);
    return res.status(500).send({
      error: "Failed to search collections",
      errorMessage: error,
    });
  }
};

export const deleteCollection = async (req, res) => {
  const { id } = req.params;

  if (!req.userId || !req.userId.userId) {
    return res.status(401).send({ error: "You need to be logged in" });
  }

  try {
    const existing = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, id))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).send({ error: "Collection not found" });
    }

    if (existing[0].owner_id !== req.userId.userId) {
      return res.status(403).send({ error: "You do not own this collection" });
    }

    const [result] = await db
      .delete(collectionsTable)
      .where(eq(collectionsTable.id, id))
      .returning();
    if (!result) {
      return res.status(404).send({
        response: "No collection with this id was found",
      });
    }
    return res.status(200).send({
      response: "Collection " + id + " deleted",
    });
  } catch (error) {
    console.error("Error deleting collection: ", error);
    return res.status(500).send({
      error: "Failed to delete collection" + error,
    });
  }

  return res.status(200).send({ message: "Collection deleted successfully" });
};
