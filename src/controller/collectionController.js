import { db } from "../db/database.js";
import { collectionsTable, usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const createCollection = async (req, res) => {
    const { title, visibility, description } = req.body;
    console.log("Trying to create collection with body : ", req.body);
  if (!req.user || !req.user.id) {
    return res.status(401).send({ error: "You need to be logged in in order to create a collection" });
  }
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id))
      .limit(1);
    if (user.length === 0) {
      return res.status(401).send({ error: "Invalid user" });
    }
    const result = await db
      .insert(collectionsTable)
      .values({
        title: title,
        visibility: visibility,
        description: description,
        creator: req.user.id,
      })
      .returning();
    console.log("Collection inserted successfully : ", result);
    res.status(201).send({
      response: "collection created with id " + result[0].id,
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to insert collection" + error,
    });
  }
};

export const getCollectionById = async (req, res) => {
    const { id } = req.params;
    try {
        const collection = await db
            .select()
            .from(collectionsTable)
            .where(eq(collectionsTable.id, id))
            .limit(1);
        if (collection.length === 0) {
            return res.status(404).send({ error: "Collection not found" });
        }
        if (collection[0].visibility === 'PRIVATE') {
            if (!req.user || req.user.id !== collection[0].owner_id) {
                return res.status(403).send({ error: "You do not have access to this collection" });
            }
        }
        res.status(200).send({ collection: collection[0] });
    } catch (error) {
        res.status(500).send({
            error: "Failed to retrieve collection: " + error,
        });
    }
};