const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const router = require("express").Router();
const AuthService = require("../../apis/authService");

router.post("/", AuthService.signupNewUser);

router.use("/", (req, res) => {
  res.status(HTTP_STATUS.NOT_ALLOWED).end();
  return;
});

module.exports = router;
