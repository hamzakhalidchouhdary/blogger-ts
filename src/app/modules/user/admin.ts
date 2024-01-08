const User = require("./user.ts");
const UserModel = require("../../models").User;
const ArticleModel = require("../../models").Article;
import { UserDetails } from "../../../utils/common/interfaces";

class Admin extends User {
  constructor(userDetails: UserDetails) {
    super(userDetails);
    this.role = "admin";
  }

  createUser: Function = async function (_userDetails: UserDetails) {
    return UserModel.new(_userDetails);
  };
  updateUser: Function = async function (_userDetails: UserDetails, userId: number) {
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
