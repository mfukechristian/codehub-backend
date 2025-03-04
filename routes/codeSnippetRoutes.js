import express from "express";
import {
  createCodeSnippet,
  getAllCodeSnippets,
  getCodeSnippetById,
  updateCodeSnippet,
  deleteCodeSnippet,
} from "../controllers/codeSnippetController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createCodeSnippet)
  .get(protect, getAllCodeSnippets);
router
  .route("/:id")
  .get(getCodeSnippetById)
  .put(protect, admin, updateCodeSnippet)
  .delete(protect, admin, deleteCodeSnippet);

export default router;
