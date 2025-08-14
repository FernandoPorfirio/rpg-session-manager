const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware");
const guildController = require("@controllers/guildController");

const {
  createGuildSchema,
  updateGuildSchema,
  formGuildsSchema,
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

router.get("/:id", authMiddleware, guildController.getById);

router.get("/", authMiddleware, guildController.getByGameMasterId);

router.delete("/:id", authMiddleware, guildController.deleteGuild);

router.post(
  "/form-automatically",
  authMiddleware,
  validateBody(formGuildsSchema),
  guildController.formGuildsAutomatically
);

router.get(
  "/session/:sessionId",
  authMiddleware,
  guildController.getGuildsBySessionId
);

module.exports = router;
