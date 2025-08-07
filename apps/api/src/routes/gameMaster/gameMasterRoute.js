const express = require("express");
const router = express.Router();
const gameMasterController = require("../../controller/gameMasterController");

const { createGameMasterSchema } = require("./gameMasterValidator");
const validateBody = require("@middlewares/validateBody");

router.post(
  "/",
  validateBody(createGameMasterSchema),
  gameMasterController.create
);

module.exports = router;
