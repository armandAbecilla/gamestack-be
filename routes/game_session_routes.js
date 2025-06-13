const express = require("express");
const router = express.Router();
const gamesSessionCtrl = require("../controllers/game-session-controller");

router.post("/add", async (req, res) => {
  await gamesSessionCtrl.addSession(req, res);
});

router.patch("/:id", async (req, res) => {
  await gamesSessionCtrl.updateSession(req, res);
});

router.get("/:id", async (req, res) => {
  await gamesSessionCtrl.getGameSession(req, res);
});

router.delete("/:id", async (req, res) => {
  await gamesSessionCtrl.deleteGameSession(req, res);
});

module.exports = router;
