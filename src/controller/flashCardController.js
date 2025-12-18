import { eq } from "drizzle-orm";
import { db } from "../db/database.js";
import { cardTable, collectionsTable, usersTable } from "../db/schema.js";

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

export const editFlashCard = async (req, res) => {
    try{
        const { id } = req.params;
        const { front, back, front_URL, back_URL } = req.body;
        const [card] = await db
            .select()
            .from(cardTable)
            .where(eq(cardTable.id, id));
        const [collection] = await db.select().from(collectionsTable).where(eq(collectionsTable.id,card.collection_id))
        
        if (collection.owner_id != req.userId.userId){
            return res.status(403).json({error: "you do not have access to the flashCard"})
        }
        const updateData = {}
        if (front !== undefined) updateData.front = front
        if (back !== undefined) updateData.back = back
        if (front_URL !== undefined) updateData.front_URL = front_URL
        if (back_URL !== undefined) updateData.back_URL = back_URL
        const [updated] = await db.update(cardTable).set(updateData).where(eq(cardTable.id, id)).returning()
        return res.status(200).json({message:"card updated successfully", newCard:updated})
    }catch(error){
        console.error(error)
        return res.status(500).json({error: "internal server error while updating flashcard"})
    }

};
export const deleteFlashCard = async (req, res) => {
    try{
        const { id } = req.params;
        const [card] = await db
            .select()
            .from(cardTable)
            .where(eq(cardTable.id, id));
        const [collection] = await db.select().from(collectionsTable).where(eq(collectionsTable.id,card.collection_id))
        
        if (collection.owner_id != req.userId.userId){
            return res.status(403).json({error: "you do not have access to the flashCard"})
        }
        await db.delete(cardTable).where(eq(cardTable.id, id))
        return res.status(200).json({message:`flashCard ${id} deleted successfully`})
    }catch(error){
        console.error(error)
        return res.status(500).json({error: "internal server error while deleting flashCard"})
    }
};
