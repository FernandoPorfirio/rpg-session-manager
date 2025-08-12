const express = require("express");
const router = express.Router();
const classController = require("@controllers/classController");

router.get(
  "/",
  classController.getAll
);

router.get(
  "/:id",
  classController.getById
);

module.exports = router;
