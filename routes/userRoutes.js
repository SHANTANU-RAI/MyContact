const express = require("express");
const { registerUser, loginUser, currenterUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register" , registerUser );

router.post("/login" , loginUser );

router.get("/current" , validateToken, currenterUser );

module.exports = router;