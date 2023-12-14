const User = require("./user");
const UserModel = require("../../models").User;
const ArticleModel = require("../../models").Article;
const _ = require("lodash");

function Admin(userDetails) {
  User.call(this, userDetails);

  this.createUser = async function (_userDetails) {
    return UserModel.new(_userDetails);
  };
  this.updateUser = async function (_userDetails, userId) {
    return UserModel.modify(_userDetails, userId);
  };
  this.deleteUser = async function (userId) {
    return UserModel.remove(userId);
  };
  this.deleteArticle = function (articleId) {
    return ArticleModel.remove(articleId);
  };
}

Admin.prototype = new User();
Admin.prototype.role = "admin";

module.exports = Admin;
