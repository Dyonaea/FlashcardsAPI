import { Router } from "express";
import {
  createFlashCard,
  deleteFlashCard,
  editFlashCard,
  getFlashCard,
  getFlashCardByCollection,
  reviewFlashCard,
} from "../controller/flashCardController.js";
import { validateBody, validateParam } from "../middleware/validation.js";
import {
  createFlashCardSchema,
  getFlashCardSchema,
  updateFlashCardSchema,
  reviewingFlashCardSchema,
} from "../model/flashCard.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();
router.use(authenticateToken);
router.post("/", validateBody(createFlashCardSchema), createFlashCard);
router.get("/:id", validateParam(getFlashCardSchema), getFlashCard);
router.get(
  "/byCollection/:id",
  validateParam(getFlashCardSchema),
  getFlashCardByCollection
);
//lister les flashcards d'une collection
router.patch(
  "/:id",
  validateParam(getFlashCardSchema),
  validateBody(updateFlashCardSchema),
  editFlashCard
);
router.delete("/:id", validateParam(getFlashCardSchema), deleteFlashCard);
//reviser une flashcard
router.post(
  "/reviewCard/:id",
  validateParam(getFlashCardSchema),
  validateBody(reviewingFlashCardSchema),
  reviewFlashCard
);

export default router;
