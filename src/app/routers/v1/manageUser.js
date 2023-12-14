const router = require("express").Router();
const ManageUserService = require("../../apis/manageUserService");
const UserProfileValidation = require("./middleware/validations/userProfile");

router.post(
  "/new",
  UserProfileValidation.newProfile,
  ManageUserService.createUserProfile
);
router.put(
  "/:id",
  UserProfileValidation.updateProfile,
  ManageUserService.updateUserProfile
);
router.delete("/:id", ManageUserService.deleteUserProfile);
router.get("/:id", ManageUserService.getUserProfile);

module.exports = router;
