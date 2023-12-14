const ServiceResponse = require("../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../utils/constants/httpStatus");

const createUserProfile = async function (req, res, next) {
  try {
    const { user, body: userDetails = {} } = req;
    const newUser = await user.createUser(userDetails);
    res.status(HTTP_STATUS.CREATED).json(newUser);
    return;
  } catch (err) {
    return next(err);
  }
};

const updateUserProfile = async function (req, res, next) {
  try {
    const {
      user,
      body: updatedDetails,
      params: { id: userId },
    } = req;
    await user.updateUser(updatedDetails, userId);
    res.status(HTTP_STATUS.OK).json({ message: "user updated" });
    return;
  } catch (err) {
    return next(err);
  }
};

const deleteUserProfile = async function (req, res, next) {
  try {
    const {
      user,
      params: { id: userId },
    } = req;
    await user.deleteUser(userId);
    res.status(HTTP_STATUS.OK).end();
    return;
  } catch (err) {
    return next(err);
  }
};

const getUserProfile = function (req, res) {
  try {
    res.status(HTTP_STATUS.OK).end();
    return;
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserProfile,
};
