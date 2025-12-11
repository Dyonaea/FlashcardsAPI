import {request, response} from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { db } from '../db/database.js'
import { usersTable } from '../db/schema.js'
import { eq } from 'drizzle-orm'
/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {Function} next 
 */

export const adminAuthenticateToken = async (req, res, next) =>{
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token){
        return res.status(403).json({error: 'Access token required'})
    }
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId))
        if (user.role != 'ADMIN'){
            return res.status(403).json({error: 'Access denied'})
        }
        req.userId = {userId}
        //TODO retirer les userId.userId et mettre juste req.userId = userId
        next()
    }catch(error){
        console.error(error)
        res.status(401).json({error: 'Invalid or expired token'})
    }
}

export const authenticateToken = (req, res, next) =>{
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token){
        return res.status(403).json({error: 'Access token required'})
    }
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decodedToken.userId
        req.userId = {userId}
        next()
    }catch(error){
        console.error(error)
        res.status(401).json({error: 'Invalid or expired token'})
    }
}