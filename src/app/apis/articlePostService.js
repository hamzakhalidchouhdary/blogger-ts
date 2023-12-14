const ServiceResponse = require("../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../utils/constants/httpStatus");

const createPost = async function (req, res, next) {
  try {
    const { user, body: articleDetails } = req;
    const newArticle = await user.createArticle(articleDetails);
    res.status(HTTP_STATUS.CREATED).json(newArticle);
    return;
  } catch (err) {
    return next(err);
  }
};

const updatePost = async function (req, res, next) {
  try {
    const {
      user,
      body: articleDetails,
      params: { id: articleId },
    } = req;
    await user.updateArticle(articleDetails, articleId);
    res.status(HTTP_STATUS.OK).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const deletePost = async function (req, res, next) {
  try {
    const {
      user,
      params: { id: articleId },
    } = req;
    await user.deleteArticle(articleId);
    res.status(HTTP_STATUS.OK).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const getPosts = async function (req, res, next) {
  try {
    const { user } = req;
    const userArticles = await user.getAllArticles();
    res.status(HTTP_STATUS.OK).json(userArticles);
    return;
  } catch (err) {
    return next(err);
  }
};

const getPost = function (req, res, next) {
  try {
    const { user } = req;
    res.status(HTTP_STATUS.OK).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPosts,
};
