const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware");
const playerController = require("@controllers/playerController");

const {
  createPlayerSchema,
  updatePlayerSchema,
} = require("./playerValidator");
const validateBody = require("@middlewares/validateBody");

router.post(
  "/",
  authMiddleware,
  validateBody(createPlayerSchema),
  playerController.create
);

router.put(
  "/:id",
  authMiddleware,
  validateBody(updatePlayerSchema),
  playerController.update
);

router.get(
  "/:id",
  authMiddleware,
  playerController.getById
);

router.get(
  "/",
  authMiddleware,
  playerController.getByGameMasterIdWithFilters
);

router.delete(
  "/:id",
  authMiddleware,
  playerController.deletePlayer
);

module.exports = router;
