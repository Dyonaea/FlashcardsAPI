import { Router } from "express";
import { createCollection, getCollectionById } from "../controller/collectionController.js";
import { validateBody, validateParam } from "../middleware/validation.js";
import { createCollectionSchema, getCollectionSchema } from "../model/collection.js";

const router = Router();

// Sample route for collections

router.post("/", validateBody(createCollectionSchema), createCollection);

router.get("/:id", validateParam(getCollectionSchema), getCollectionById);

export default router;