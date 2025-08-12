const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware");
const guildMemberController = require("@controllers/guildMemberController");

const {
  createGuildMemberSchema,
} = require("./guildMemberValidator");
const validateBody = require("@middlewares/validateBody");

router.post(
  "/",
  authMiddleware,
  validateBody(createGuildMemberSchema),
  guildMemberController.create
);

router.get(
  "/:id",
  authMiddleware,
  guildMemberController.getById
);

router.get(
  "/",
  authMiddleware,
  guildMemberController.getByGameMasterIdWithFilters
);

router.delete(
  "/:id",
  authMiddleware,
  guildMemberController.deleteGuildMember
);

module.exports = router;
