import { eq, and } from "drizzle-orm";
import { db } from "../db/database.js";
import {
  cardTable,
  collectionsTable,
  usersTable,
  cardsUsersTable,
} from "../db/schema.js";

const getFlashCardData = async (cardId, userId) => {
  const [card] = await db
    .select()
    .from(cardTable)
    .where(eq(cardTable.id, cardId));

  if (!card) {
    return { error: "FlashCard not found", status: 404 };
  }

  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(eq(collectionsTable.id, card.collection_id));

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (
    collection.owner_id === userId ||
    collection.visibility === "PUBLIC" ||
    user?.role === "ADMIN"
  ) {
    return { card };
  }

  return { error: "You do not have access to this flashCard", status: 403 };
};

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
    const result = await getFlashCardData(id, req.userId.userId);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json({ flashCard: result.card });
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
    const { level } = req.body;
    const { id } = req.params;

    const result = await getFlashCardData(id, req.userId.userId);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    const card = result.card;

    const [flashcardUserLink] = await db
      .select()
      .from(cardsUsersTable)
      .where(
        and(
          eq(cardsUsersTable.user_id, req.userId.userId),
          eq(cardsUsersTable.card_id, card.id)
        )
      );
    if (!flashcardUserLink) {
      await db
        .insert(cardsUsersTable)
        .values({ card_id: id, user_id: req.userId.userId })
        .returning();
      return res.status(201).json({ flashCard: card });
    }
    const nextReviewDate = new Date();
    nextReviewDate.setTime(
      new Date(flashcardUserLink.last_revision_date).getTime() +
        2 ** (flashcardUserLink.level - 1) * 86400 * 1000
    );
    if (nextReviewDate > new Date()) {
      return res.status(400).json({
        error:
          "You cannot review this flashcard yet you must wait until " +
          nextReviewDate.toLocaleString(),
        nextReviewDate: nextReviewDate.toLocaleString(),
      });
    }
    await db
      .update(cardsUsersTable)
      .set({ level: level || flashcardUserLink.level })
      .where(eq(cardsUsersTable.id, flashcardUserLink.id));
    return res.status(200).json({ flashCard: card });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "internal server error while reviewing flashCard",
    });
  }
};

export const editFlashCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { front, back, front_URL, back_URL } = req.body;
    const [card] = await db
      .select()
      .from(cardTable)
      .where(eq(cardTable.id, id));
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, card.collection_id));

    if (collection.owner_id != req.userId.userId) {
      return res
        .status(403)
        .json({ error: "you do not have access to the flashCard" });
    }
    const updateData = {};
    if (front !== undefined) updateData.front = front;
    if (back !== undefined) updateData.back = back;
    if (front_URL !== undefined) updateData.front_URL = front_URL;
    if (back_URL !== undefined) updateData.back_URL = back_URL;
    const [updated] = await db
      .update(cardTable)
      .set(updateData)
      .where(eq(cardTable.id, id))
      .returning();
    return res
      .status(200)
      .json({ message: "card updated successfully", newCard: updated });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "internal server error while updating flashcard" });
  }
};

export const deleteFlashCard = async (req, res) => {
  try {
    const { id } = req.params;
    const [card] = await db
      .select()
      .from(cardTable)
      .where(eq(cardTable.id, id));
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, card.collection_id));

    if (collection.owner_id != req.userId.userId) {
      return res
        .status(403)
        .json({ error: "you do not have access to the flashCard" });
    }
    await db.delete(cardTable).where(eq(cardTable.id, id));
    return res
      .status(200)
      .json({ message: `flashCard ${id} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "internal server error while deleting flashCard" });
  }
};
