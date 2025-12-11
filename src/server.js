import express from 'express'
import logger from './middleware/logger.js'
import collectionRoutes from './router/collectionRouter.js'

const PORT = process.env.PORT || 3000

const app = express()
app.use(logger)

app.use('/collections', collectionRoutes)

app.listen(PORT, ()=>{
    console.log(`server running on http://localhst:${PORT}`)
})