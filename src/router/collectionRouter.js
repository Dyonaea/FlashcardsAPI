import { Router } from "express";
import {
  createCollection,
  getCollectionById,
  getAllCollections,
  searchCollections,
  updateCollection,
} from "../controller/collectionController.js";
import { validateBody, validateParam } from "../middleware/validation.js";
import {
  createCollectionSchema,
  getCollectionSchema,
  searchCollectionSchema,
  updateCollectionSchema,
} from "../model/collection.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.use(authenticateToken);

router.post("/", validateBody(createCollectionSchema), createCollection);

router.get("/:id", validateParam(getCollectionSchema), getCollectionById);

router.get("/", getAllCollections);

router.get(
  "/search/:query",
  validateParam(searchCollectionSchema),
  searchCollections
);

router.patch(
  "/:id",
  validateParam(getCollectionSchema),
  validateBody(updateCollectionSchema),
  updateCollection
);

export default router;
