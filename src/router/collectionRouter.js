import { Router } from "express";
import {
  createCollection,
  getCollectionById,
  getAllCollections,
  searchCollections,
  updateCollection,
  deleteCollection,
} from "../controller/collectionController.js";
import { validateBody, validateParam } from "../middleware/validation.js";
import {
  createCollectionSchema,
  searchCollectionSchema,
  updateCollectionSchema,
  idCollection,
} from "../model/collection.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.use(authenticateToken);

router.post("/", validateBody(createCollectionSchema), createCollection);

router.get("/:id", validateParam(idCollection), getCollectionById);

router.get("/", getAllCollections);

router.get(
  "/search/:query",
  validateParam(searchCollectionSchema),
  searchCollections
);

router.patch(
  "/:id",
  validateParam(idCollection),
  validateBody(updateCollectionSchema),
  updateCollection
);

router.delete("/:id", validateParam(idCollection), deleteCollection);

export default router;
