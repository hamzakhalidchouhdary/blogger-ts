import { NextFunction, Request, Response } from "express";
const User = require('../modules/user/user');
const ServiceResponse = require("../../utils/common/serviceResponse");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const _ = require("lodash");

const createComment = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const user: typeof User = req.user;
    const comment: string = req.body.content;
    const articleId: number = _.parseInt(req.params.articleId);
    await user.createComment(comment, articleId);
    res.status(HTTP_STATUS.CREATED).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const updateComment = async function (req: Request, res: Response, next: NextFunction) {
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

const deleteComment = async function (req: Request, res: Response, next: NextFunction) {
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

const getComment = function (req: Request, res: Response, next: NextFunction) {
  try {
    const { user } = req;
    res.status(HTTP_STATUS.OK).json({});
    return;
  } catch (err) {
    return next(err);
  }
};

const getCommentList = async function (req: Request, res: Response, next: NextFunction) {
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
