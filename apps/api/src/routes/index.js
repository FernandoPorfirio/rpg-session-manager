const express = require("express");
const router = express.Router();

const healthcheckRoutes = require("./healthcheckRoute");
const gameMasterkRoutes = require("./gameMaster/gameMasterRoute");

router.use("/healthcheck", healthcheckRoutes);
router.use("/game_master", gameMasterkRoutes);

module.exports = router;
