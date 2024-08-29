const { Signup, Login } = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const { Lookup, addSet, Collection} = require("../Controllers/LegoController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);
router.post("/lookup", Lookup);
router.post("/add", addSet);
router.get("/collection", Collection);

module.exports = router;