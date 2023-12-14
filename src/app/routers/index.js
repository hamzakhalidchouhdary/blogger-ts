const router = require("express").Router();
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const version1 = require("./v1/index");

router.use("/api/v1", version1);
router.use("", (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).end();
  return;
});

module.exports = router;
