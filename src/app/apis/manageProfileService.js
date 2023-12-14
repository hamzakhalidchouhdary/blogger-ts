const ServiceResponse = require("../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../utils/constants/httpStatus");

const createProfile = function (req, res, err) {
  try {
    res.status(HTTP_STATUS.CREATED).end();
    return;
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async function (req, res, next) {
  try {
    const { user, body: payload } = req;
    const updatedProfile = await user.updateProfile(payload);
    res.status(HTTP_STATUS.OK).json(updatedProfile);
    return;
  } catch (err) {
    return next(err);
  }
};

const deleteProfile = function (req, res, next) {
  try {
    res.status(HTTP_STATUS.OK).end();
    return;
  } catch (err) {
    return next(err);
  }
};

const getProfile = function (req, res, next) {
  try {
    res.status(HTTP_STATUS.OK).end();
    return;
  } catch (err) {
    return next(err); 
  }
};

module.exports = {
  createProfile,
  updateProfile,
  deleteProfile,
  getProfile,
};
