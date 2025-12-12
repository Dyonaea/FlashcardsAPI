import {Router} from 'express'
import { createFlashCard, deleteFlashCard, editFlashCard, getFlashCard } from '../controller/flashCardController.js';

const router = Router();
router.post('/', createFlashCard)
router.get('/:id', getFlashCard)
//lister les flashcards d'une collection
router.patch('/:id', editFlashCard)
router.delete('/:id', deleteFlashCard)
//reviser une flashcard

export default router