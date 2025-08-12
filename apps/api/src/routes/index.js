const express = require("express");
const router = express.Router();

const healthcheckRoutes = require("./healthcheckRoute");
const gameMasterkRoutes = require("./gameMaster/gameMasterRoute");
const sessionRoutes = require("./session/sessionRoute");

router.use("/healthcheck", healthcheckRoutes);
router.use("/game_master", gameMasterkRoutes);
router.use("/session", sessionRoutes);

module.exports = router;
