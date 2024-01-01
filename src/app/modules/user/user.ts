const HTTP_STATUS = require("../../../utils/constants/httpStatus");
const ArticleModel = require("../../models").Article;
const CommentModel = require("../../models").Comment;
const UserModel = require("../../models").User;
import _ from "lodash";
const ERROR_TEXT = require("../../../utils/constants/errorText");

type NumberOrNull = number | null

interface UserDetails {
  id: NumberOrNull,
  firstName: string,
  lastName: string,
  username: string,
  role: string
}

interface Error {
  message: string,
  status: number
}

class User implements UserDetails {
  id: NumberOrNull;
  firstName: string;
  lastName: string;
  username: string;
  role: string;

  constructor(userDetails: UserDetails) {    
    this.id = userDetails.id || null;
    this.firstName = userDetails.firstName || "";
    this.lastName = userDetails.lastName || "";
    this.username = userDetails.username || "";
    this.role = userDetails.role || "";
  }

  isCommentOwner: Function = async (commentId: NumberOrNull) => {
    const commentDetails = await CommentModel.getById(commentId);
    return commentDetails.createdBy == this.id;
  };
  createUser: Function = function () : Error {
    throw Object({
      message:ERROR_TEXT.PERMISSIONS.CREATE.USER,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
  updateUser: Function = function () : Error {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.UPDATE.USER,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
  deleteUser: Function = function () : Error {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.DELETE.USER,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
  updateProfile: Function = async  (updateProfile: any) => {
    return UserModel.modify(updateProfile, this.id);
  };
  createArticle: Function = async (articleDetails: any) => {
    articleDetails.createdBy = articleDetails.updatedBy = this.id;
    return ArticleModel.new(articleDetails);
  };
  updateArticle: Function =  (articleDetails: any, articleId: number) => {
    if (!_.isEmpty(articleDetails)) articleDetails.updatedBy = this.id;
    return ArticleModel.modify(articleDetails, articleId);
  };
  deleteArticle: Function = function (): Error {
    throw Object({
      message: ERROR_TEXT.PERMISSIONS.DELETE.ARTICLE,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  };
  createComment: Function = async  (content: string = "", articleId: NumberOrNull = null) => {
    const commentObj = {
      content,
      articleId,
      createdBy: this.id,
      updatedBy: this.id,
    };
    return CommentModel.new(commentObj);
  };
  updateComment: Function = async  (content: string = "", commentId: NumberOrNull = null) => {
    if (!(await this.isCommentOwner(commentId)))
      throw Object({
        message: ERROR_TEXT.NOT_A_OWNER,
        status: HTTP_STATUS.NOT_ALLOWED,
      });

    return CommentModel.modify(content, commentId, this.id);
  };
  deleteComment: Function = async  (commentId: NumberOrNull = null) => {
    if (!(await this.isCommentOwner(commentId)))
      throw Object({
        message: ERROR_TEXT.NOT_A_OWNER,
        status: HTTP_STATUS.NOT_ALLOWED,
      });

    return CommentModel.remove(commentId, this.id);
  };
  viewArticleComments: Function = async function (articleId: number) {
    return CommentModel.getAllByArticleId(articleId);
  };
  getAllArticles: Function = async  () => {
    return ArticleModel.findByAuthorId(this.id);
  };
}

module.exports = User;
