const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware");
const sessionController = require("@controllers/sessionController");

const {
  createSessionSchema,
  updateSessionSchema,
} = require("./sessionValidator");
const validateBody = require("@middlewares/validateBody");

router.post(
  "/",
  authMiddleware,
  validateBody(createSessionSchema),
  sessionController.create
);

router.put(
  "/:id",
  authMiddleware,
  validateBody(updateSessionSchema),
  sessionController.update
);

router.get(
  "/:id",
  authMiddleware,
  sessionController.getById
);

router.get(
  "/",
  authMiddleware,
  sessionController.getByGameMasterId
);

router.delete(
  "/:id",
  authMiddleware,
  sessionController.deleteSession
);

module.exports = router;
