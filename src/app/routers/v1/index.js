const router = require("express").Router();
const signup = require("./signup");
const login = require("./login");
const manageUser = require("./manageUser");
const manageProfile = require("./manageProfile");
const articles = require("./article");
const comment = require("./comment");
const AuthMiddleware = require("./middleware/auth");

router.use("/auth/signup", signup);
router.use("/auth/login", login);
router.use(AuthMiddleware.authorizeUser);
router.use("/user/manage", manageUser);
router.use("/user/profile", manageProfile);
router.use("/article", articles);
router.use("/article/:articleId/comment", comment);

module.exports = router;
