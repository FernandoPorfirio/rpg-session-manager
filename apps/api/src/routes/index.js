const express = require("express");
const router = express.Router();

const healthcheckRoutes = require("./healthcheckRoute");
const gameMasterkRoutes = require("./gameMaster/gameMasterRoute");
const sessionRoutes = require("./session/sessionRoute");
const classRoutes = require("./class/classRoute");
const playerRoutes = require("./player/playerRoute");
const guildRoutes = require("./guild/guildRoute");

router.use("/healthcheck", healthcheckRoutes);
router.use("/game_master", gameMasterkRoutes);
router.use("/session", sessionRoutes);
router.use("/class", classRoutes);
router.use("/player", playerRoutes);
router.use("/guild", guildRoutes);

module.exports = router;
