const router = require("express").Router();
const ManageProfileService = require("../../apis/manageProfileService");

router.post("/", ManageProfileService.createProfile);
router.put("/", ManageProfileService.updateProfile);
router.delete("/", ManageProfileService.deleteProfile);
router.get("/", ManageProfileService.getProfile);

module.exports = router;
