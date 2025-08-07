const express = require("express");
const router = express.Router();
const authMiddleware = require('@middlewares/authMiddleware');
const gameMasterController = require("@controller/gameMasterController");

const { createGameMasterSchema, loginSchema } = require("./gameMasterValidator");
const validateBody = require("@middlewares/validateBody");

router.post(
  "/",
  validateBody(createGameMasterSchema),
  gameMasterController.create
);

router.post(
  "/login",
  validateBody(loginSchema),
  gameMasterController.login
);

router.get(
  "/:id",
  authMiddleware,
  gameMasterController.getById
);

module.exports = router;
