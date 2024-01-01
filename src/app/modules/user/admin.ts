const User = require("./user.ts");
const UserModel = require("../../models").User;
const ArticleModel = require("../../models").Article;
import _ from "lodash";

class Admin extends User {
  constructor(userDetails: any) {
    super(userDetails);
    this.role = "admin";
  }

  createUser: Function = async function (_userDetails: any) {
    return UserModel.new(_userDetails);
  };
  updateUser: Function = async function (_userDetails: any, userId: number) {
    return UserModel.modify(_userDetails, userId);
  };
  deleteUser: Function = async function (userId: number) {
    return UserModel.remove(userId);
  };
  deleteArticle: Function = function (articleId: number) {
    return ArticleModel.remove(articleId);
  };
}

module.exports = Admin;
