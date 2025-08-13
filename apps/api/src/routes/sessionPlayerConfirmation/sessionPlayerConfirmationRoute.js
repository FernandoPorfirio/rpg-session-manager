const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware");
const sessionPlayerConfirmationController = require("@controllers/sessionPlayerConfirmationController");

const {
  createSessionPlayerConfirmationSchema,
} = require("./sessionPlayerConfirmationValidator");
const validateBody = require("@middlewares/validateBody");

router.post(
  "/",
  authMiddleware,
  validateBody(createSessionPlayerConfirmationSchema),
  sessionPlayerConfirmationController.create
);

router.get(
  "/:id",
  authMiddleware,
  sessionPlayerConfirmationController.getById
);

router.get(
  "/",
  authMiddleware,
  sessionPlayerConfirmationController.getByGameMasterIdWithFilters
);

router.get(
  "/session/:sessionId/players",
  authMiddleware,
  sessionPlayerConfirmationController.getConfirmedPlayersBySessionId
);

router.delete(
  "/:id",
  authMiddleware,
  sessionPlayerConfirmationController.deleteConfirmation
);

module.exports = router;
