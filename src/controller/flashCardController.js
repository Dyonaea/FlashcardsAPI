import { eq } from "drizzle-orm";
import { db } from "../db/database.js";
import { cardTable, collectionsTable, usersTable } from "../db/schema.js";

export const createFlashCard = async (req, res)=>{
    try{
    const { front, back, front_URL, back_URL, collection_ID } = req.body;
    const [result] = await db.select().from(collectionsTable).where(eq(collectionsTable.collection_ID, collection_ID))
    if (req.userId.userId != result.owner_id)
        return res.status(403).json({error: `Collection ${collection_ID} is not yours` })
    await db.insert(cardTable).values({front, back, front_URL, back_URL, collection_ID})
    return res.status(200).json({message: "FlashCard added successfully"})
    }catch(error){
        console.error(error)
        return res.status(500).json({error: "internal server error while creating the flashCard"})
    }
}
export const getFlashCard = async (req, res)=>{
    try{
        const {id} = req.params
        const [card] = await db.select().from(cardTable).where(eq(cardTable.id, id))
        const [collection] = await db.select().from(collectionsTable).where(collectionsTable.id = card.collection_id)
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId.userId))
        if (collection.owner_id == req.userId.userId || collection.visibility == 'PUBLIC' || user.role == 'ADMIN')
            return res.status(200).json({flashCard: card})
        return res.status(403).json({error: `you do not have access to the flashCard ${card.id}`})

    }catch(error){
        console.error(error)
        return res.status(500).json({error: "internal server error while retrieving the flashCard"})
    }
    
}

export const editFlashCard = (req, res)=>{

}
export const deleteFlashCard = (req, res)=>{
    
}