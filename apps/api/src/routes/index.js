const express = require("express");
const router = express.Router();

const healthcheckRoutes = require("./healthcheckRoute");
const gameMasterkRoutes = require("./gameMaster/gameMasterRoute");
const sessionRoutes = require("./session/sessionRoute");
const classRoutes = require("./class/classRoute");
const playerRoutes = require("./player/playerRoute");
const guildRoutes = require("./guild/guildRoute");
const guildMemberRoutes = require("./guildMember/guildMemberRoute");
const sessionPlayerConfirmationRoutes = require("./sessionPlayerConfirmation/sessionPlayerConfirmationRoute");

router.use("/healthcheck", healthcheckRoutes);
router.use("/game_master", gameMasterkRoutes);
router.use("/session", sessionRoutes);
router.use("/class", classRoutes);
router.use("/player", playerRoutes);
router.use("/guild", guildRoutes);
router.use("/guild_member", guildMemberRoutes);
router.use("/session_player_confirmation", sessionPlayerConfirmationRoutes);

module.exports = router;
