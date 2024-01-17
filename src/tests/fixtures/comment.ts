const CommentModel = require("../../app/models").Comment;
const { faker } = require("@faker-js/faker");
const _ = require("lodash");

const getCommentCount = async function (articleId) {
  return CommentModel.count({ where: { articleId } });
};

const createComment = async function (
  content = "",
  articleId = null,
  userId = null
) {
  if (_.isEmpty(content)) {
    content = faker.random.words(7);
  }
  const commentDetails = {
    content,
    articleId,
    createdBy: userId,
    updatedBy: userId,
  };
  return CommentModel.new(commentDetails);
};

const getCommentById = async function (commentId = null) {
  return CommentModel.getById(commentId);
};

module.exports = {
  getCommentCount,
  createComment,
  getCommentById,
};
