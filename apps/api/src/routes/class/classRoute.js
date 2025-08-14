const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware");
const classController = require("@controllers/classController");

router.get("/", authMiddleware, classController.getAll);

router.get("/:id", authMiddleware, classController.getById);

module.exports = router;
