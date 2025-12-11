import { Router } from "express";
import { createCollection } from "../controller/collectionController.js";
import { validateBody } from "../middleware/validateBody.js";
import { createCollectionSchema } from "../model/collection.js";

const router = Router();

// Sample route for collections

router.post("/", validateBody(createCollectionSchema), createCollection);

export default router;