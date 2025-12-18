import { eq } from "drizzle-orm";
import { db } from "../db/database.js";
import {
  cardTable,
  collectionsTable,
  usersTable,
  cardsUsersTable,
} from "../db/schema.js";

export const createFlashCard = async (req, res) => {
  try {
    const { front, back, front_URL, back_URL, collection_id } = req.body;
    const [result] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, collection_id));
    if (req.userId.userId != result.owner_id)
      return res
        .status(403)
        .json({ error: `Collection ${collection_id} is not yours` });
    const [card] = await db
      .insert(cardTable)
      .values({ front, back, front_URL, back_URL, collection_id })
      .returning();
    return res.status(200).json({
      message: `FlashCard ${card.id} added successfully to collection ${collection_id}`,
      id: card.id,
      collection_id: collection_id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "internal server error while creating the flashCard",
    });
  }
};
export const getFlashCard = async (req, res) => {
  try {
    const { id } = req.params;
    const [card] = await db
      .select()
      .from(cardTable)
      .where(eq(cardTable.id, id));

    if (!card) {
      return res
        .status(404)
        .json({ error: `FlashCard with id ${id} not found` });
    }
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, card.collection_id));
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId.userId));
    if (
      collection.owner_id == req.userId.userId ||
      collection.visibility == "PUBLIC" ||
      user.role == "ADMIN"
    )
      return res.status(200).json({ flashCard: card });
    return res.status(403).json({
      error: `you do not have access to the flashCard ${card.id}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "internal server error while retrieving the flashCard",
    });
  }
};

export const getFlashCardByCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, collectionId));
    if (!collection) {
      return res
        .status(404)
        .json({ error: `Collection with id ${collectionId} not found` });
    }
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId.userId));
    if (
      collection.owner_id != req.userId.userId &&
      collection.visibility != "PUBLIC" &&
      user.role != "ADMIN"
    ) {
      return res.status(403).json({
        error: `you do not have access to the collection ${collectionId}`,
      });
    }
    const cards = await db
      .select()
      .from(cardTable)
      .where(eq(cardTable.collection_id, collectionId));
    return res.status(200).json({ flashCards: cards });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "internal server error while retrieving flashCards by collection",
    });
  }
};

export const reviewFlashCard = async (req, res) => {
  try {
    const { id, level } = req.body;
    const [card] = await db
      .select()
      .from(cardTable)
      .where(eq(cardTable.id, id));

    if (!card) {
      return res
        .status(404)
        .json({ error: `FlashCard with id ${id} not found` });
    }
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, card.collection_id));
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.userId.userId));
    if (
      collection.owner_id != req.userId.userId &&
      collection.visibility != "PUBLIC" &&
      user.role != "ADMIN"
    )
      return res.status(403).json({
        error: `you do not have access to the flashCard ${card.id}`,
      });

    const falshcardUserLink = await db
      .select()
      .from(cardsUsersTable)
      .where(
        and(
          eq(cardsUsersTable.user_id, user.id),
          eq(cardsUsersTable.card_id, card.id)
        )
      );
    console.log("flashcarduserlink", falshcardUserLink);
    if (falshcardUserLink.size() == 0) {
      console.log("first time reviewing, creating new record of review");
      const [insertedValue] = await db
        .insert(cardsUsersTable)
        .values({ card_id: id, user_id: user.id })
        .returning();
      console.log("value inserted : ", insertedValue);
    }
    return res.status(200).json({ flashCard: card });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "internal server error while reviewing flashCard",
    });
  }
};

export const editFlashCard = (req, res) => {};
export const deleteFlashCard = (req, res) => {};
