import express from "express";
import logger from "./middleware/logger.js";
import authRouter from "./router/authRouter.js";
import collectionRoutes from "./router/collectionRouter.js";
import userRouter from "./router/userRouter.js";
import flashCardRouter from "./router/flashCardRouter.js"

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(logger);

app.use("/auth", authRouter);
app.use("/collections", collectionRoutes);
app.use("/user", userRouter);
app.use("/flashcard", flashCardRouter)

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
