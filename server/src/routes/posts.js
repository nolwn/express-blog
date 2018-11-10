// npm modules
const express = require("express");
const router = express.Router();

// My files
const { getAll, getOne, create, update, remove } = require("../controllers/posts");

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
