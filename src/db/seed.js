import {db} from './database.js'
import {cards_users_table, cardTable, collectionsTable, usersTable} from './schema.js'
import bcrypt from 'bcrypt'

async function seed(){
    try{
        console.log('Seeding database...')
        await db.delete(cards_users_table)
        await db.delete(cardTable)
        await db.delete(collectionsTable)
        await db.delete(usersTable)



        const hashedPassword1 = await bcrypt.hash('password', 12)
        const hashedPassword2 = await bcrypt.hash('1234', 10)

        const seedUsers = [
            {
                email: 'je.suislemal@lol.com',
                first_name: 'veigar',
                last_name: 'lemage',
                password: hashedPassword1,
                role:'ADMIN'

            },
            {
                email: 'dr.mundo@lol.fr',
                first_name: 'Docteur',
                last_name: 'Mundo',
                password: hashedPassword2,
            }
        ]

        const insertedUsers = await db.insert(usersTable).values(seedUsers).returning()

        const seedCollection = [
            {
                title: 'collectiondeveigar',
                description:'c\'est la collection de veigar',
                owner_id: insertedUsers[0].id
            },
            {
                title: 'collectiondemundo',
                description:'c\'est la collection de mundo',
                owner_id: insertedUsers[1].id
            }
        ]
        const insertedCollections = await db.insert(collectionsTable).values(seedCollection).returning()

        const seedCard = [
            {
                front:'qui est le mal',
                back:'je suis le mal',
                collection_id: insertedCollections[0].id
            },
            {
                front:'Qu\'est-ce qui est noir et bleu et sert de définition au mot \'douleur\' ?',
                back:'c\'est moi',
                collection_id: insertedCollections[0].id
            },
            {
                front:'où va mundo',
                back:'mundo va où il veut',
                collection_id: insertedCollections[1].id
            },
                        {
                front:'que faire en midgame',
                back:'PUSH !! PUSH !! PUSH!!!',
                collection_id: insertedCollections[1].id
            }
        ]
        const insertedCards = await db.insert(cardTable).values(seedCard).returning()

        const seedCard_user = [
            {
                card_id: insertedCards[0].id,
                user_id: insertedUsers[0].id,
                level: 2
            }
        ]

        const insertedcard_user = await db.insert(cards_users_table).values(seedCard_user).returning()
        console.log('Database seeded successfully')
    }catch(error){
        console.log(error)
    }
}

seed()