import { response, request } from "express"
import { usersTable } from "../db/schema.js"
import bcrypt from 'bcrypt'
import {db} from '../db/database.js'
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { eq } from "drizzle-orm"

/**
 * 
 * @param {response} res 
 * @param {request} req 
 */
export const register = async (req, res) =>{
    try{
        const {email, first_name, last_name, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 12)
        const [result] = await db.insert(usersTable).values({
            email,
            first_name,
            last_name,
            "password": hashedPassword
        }).returning({
            id: usersTable.id,
            email: usersTable.email,
            username: usersTable.username
        })
        const token = jwt.sign({
            userId: result.id,
        },process.env.JWT_SECRET,
        { expiresIn: '24h'})
        res.status(201).json({
            message: "User Created",
            user: result,
            token: token
        })

    }catch(error){
        console.error(error)
        res.status(500).json({
            error:"Failed to register"
        })
    }
}

export const login = async(req, res)=>{
    try{
        const {email, password} = req.body
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if (!user){
            return res.status(401).json({error: "invalid email or password"})
        }
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword){
            return res.status(401).json({error: "invalid email or passwird"})
        }
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.status(200).json({
            message: 'User logged in successfully',
            userData:{ 
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            },
            token
        })
    }catch(error){
        console.error(error)
        res.status(500).json({error: "Login failed"})
    }
}