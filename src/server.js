import express from 'express'
import logger from './middleware/logger.js'
import authRouter from './router/authRouter.js'
import userRouter from './router/userRouter.js'


const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json());
app.use(logger)

app.use('/auth', authRouter);
app.use('/user', userRouter)

app.listen(PORT, ()=>{
    console.log(`server running on http://localhst:${PORT}`)
})