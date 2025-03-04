import asyncHandler from "../middleware/asyncHandler.js";
import CodeSnippet from "../models/codeSnippetModel.js";

// @desc    Create new code snippet
// @route   POST /api/codesnippets
// @access  Private
const createCodeSnippet = asyncHandler(async (req, res) => {
  const { title, code, language, description } = req.body;

  if (!title || !code || !language || !description) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const codeSnippet = await CodeSnippet.create({
    title,
    code,
    language,
    description,
    author: req.user._id,
  });

  res.status(201).json(codeSnippet);
});

// @desc    Get all code snippets
// @route   GET /api/codesnippets
// @access  Private
const getAllCodeSnippets = asyncHandler(async (req, res) => {
  const codeSnippets = await CodeSnippet.find().populate("author", "name");
  res.json(codeSnippets);
});

// @desc    Get code snippet by ID
// @route   GET /api/codesnippets/:id
// @access  Public
const getCodeSnippetById = asyncHandler(async (req, res) => {
  const codeSnippet = await CodeSnippet.findById(req.params.id).populate(
    "author",
    "name"
  );

  if (!codeSnippet) {
    res.status(404);
    throw new Error("Code snippet not found");
  }

  res.json(codeSnippet);
});

// @desc    Update code snippet
// @route   PUT /api/codesnippets/:id
// @access  Private/Admin
const updateCodeSnippet = asyncHandler(async (req, res) => {
  const codeSnippet = await CodeSnippet.findById(req.params.id);

  if (!codeSnippet) {
    res.status(404);
    throw new Error("Code snippet not found");
  }

  // Check if user is admin or the author of the post
  if (
    req.user.isAdmin ||
    req.user._id.toString() === codeSnippet.author.toString()
  ) {
    const updatedCodeSnippet = await CodeSnippet.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || codeSnippet.title,
        code: req.body.code || codeSnippet.code,
        language: req.body.language || codeSnippet.language,
        description: req.body.description || codeSnippet.description,
      },
      { new: true }
    );

    res.json(updatedCodeSnippet);
  } else {
    res.status(401);
    throw new Error("User not authorized");
  }
});

// @desc    Delete code snippet
// @route   DELETE /api/codesnippets/:id
// @access  Private/Admin
const deleteCodeSnippet = asyncHandler(async (req, res) => {
  const codeSnippet = await CodeSnippet.findById(req.params.id);

  if (!codeSnippet) {
    res.status(404);
    throw new Error("Code snippet not found");
  }

  // Check if user is admin or the author of the post
  if (
    req.user.isAdmin ||
    req.user._id.toString() === codeSnippet.author.toString()
  ) {
    await codeSnippet.remove();
    res.json({ message: "Code snippet removed" });
  } else {
    res.status(401);
    throw new Error("User not authorized");
  }
});

export {
  createCodeSnippet,
  getAllCodeSnippets,
  getCodeSnippetById,
  updateCodeSnippet,
  deleteCodeSnippet,
};
