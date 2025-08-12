const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware");
const guildController = require("@controllers/guildController");

const {
  createGuildSchema,
  updateGuildSchema,
} = require("./guildValidator");
const validateBody = require("@middlewares/validateBody");

router.post(
  "/",
  authMiddleware,
  validateBody(createGuildSchema),
  guildController.create
);

router.put(
  "/:id",
  authMiddleware,
  validateBody(updateGuildSchema),
  guildController.update
);

router.get(
  "/:id",
  authMiddleware,
  guildController.getById
);

router.get(
  "/",
  authMiddleware,
  guildController.getByGameMasterId
);

router.delete(
  "/:id",
  authMiddleware,
  guildController.deleteGuild
);

module.exports = router;
