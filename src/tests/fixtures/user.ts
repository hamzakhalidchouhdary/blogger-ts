const { faker } = require("@faker-js/faker");
const { generateJWT } = require("../../utils/common/auth");

const UserModel = require("../../app/models").User;

const getUserDetails = function (user = {}) {
  return {
    firstName: user.firstName || faker.name.firstName(),
    lastName: user.lastName || faker.name.firstName(),
    username: user.username || faker.internet.userName(),
    hashedPassword: user.hashedPassword || faker.internet.password(),
    role: user.role || "manager",
  };
};

const createUser = async function (user) {
  const userDetails = getUserDetails(user);
  return UserModel.new(userDetails);
};

const getUserToken = async function (userId) {
  return generateJWT({ userId });
};

const getLatestCreatedUser = async function (userId) {
  return UserModel.findLatest();
};

const findUserById = async function (userId) {
  return UserModel.findById(userId);
};

const getUserCount = async function () {
  return UserModel.count();
};

module.exports = {
  createUser,
  getUserToken,
  getLatestCreatedUser,
  getUserCount,
  findUserById,
};
