const User = require("./user.ts");
const UserModel = require("../../models").User;
const ArticleModel = require("../../models").Article;
const _ = require("lodash");

class Admin extends User {
  constructor(userDetails) {
    super(userDetails);
    this.role = "admin";
  }

  createUser = async function (_userDetails) {
    return UserModel.new(_userDetails);
  };
  updateUser = async function (_userDetails, userId) {
    return UserModel.modify(_userDetails, userId);
  };
  deleteUser = async function (userId) {
    return UserModel.remove(userId);
  };
  deleteArticle = function (articleId) {
    return ArticleModel.remove(articleId);
  };
}

module.exports = Admin;
