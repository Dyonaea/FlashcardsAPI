import express from 'express'
import logger from './middleware/logger.js'


const PORT = process.env.PORT || 3000

const app = express()
app.use(logger)

app.use('/auth', authRouter);

app.listen(PORT, ()=>{
    console.log(`server running on http://localhst:${PORT}`)
})