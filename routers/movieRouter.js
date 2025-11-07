const express = require("express");

const controller = require("../controllers/controller.js");

const router = express.Router();

router.get("/", controller.index)

router.get("/:id", controller.show)

router.post("/:id/review", controller.store)

module.exports = router;