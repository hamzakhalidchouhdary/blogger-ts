const ServiceResponse = require("../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../utils/constants/httpStatus");

const createComment = async function (req, res, next) {
  try {
    const {
      user,
      body: { content: comment },
      params: { articleId },
    } = req;
    await user.createComment(comment, articleId);
    res.status(HTTP_STATUS.CREATED).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const updateComment = async function (req, res, next) {
  try {
    const {
      user,
      body: { content },
      params: { id },
    } = req;
    await user.updateComment(content, id);
    res.status(HTTP_STATUS.OK).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const deleteComment = async function (req, res, next) {
  try {
    const {
      user,
      params: { id: commentId },
    } = req;
    await user.deleteComment(commentId);
    res.status(HTTP_STATUS.OK).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const getComment = function (req, res, next) {
  try {
    const { user } = req;
    res.status(HTTP_STATUS.OK).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const getCommentList = async function (req, res, next) {
  try {
    const {
      user,
      params: { articleId },
    } = req;
    const comments = await user.viewArticleComments(articleId);
    res.status(HTTP_STATUS.OK).json(comments);
    return;
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  getCommentList,
};
