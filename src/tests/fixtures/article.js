const ArticleModel = require("../../app/models").Article;
const { faker } = require("@faker-js/faker");

const getArticleDetails = function (article) {
  return {
    title: article.title || faker.random.words(5),
    content: article.content || faker.random.words(20),
  };
};

const createArticle = async function (article = {}, userId) {
  try {
    if (!userId) throw Object({ message: "userId is required" });
    const articleDetails = getArticleDetails(article);
    articleDetails.createdBy = articleDetails.updatedBy = userId;
    return ArticleModel.new(articleDetails);
  } catch (err) {
    throw err;
  }
};

const getLatestCreatedArticle = async function () {
  return ArticleModel.findLatest();
};

const findArticleById = async function (id) {
  return ArticleModel.findById(id);
};

const getArticleCount = async function () {
  return ArticleModel.count();
};

module.exports = {
  createArticle,
  getLatestCreatedArticle,
  findArticleById,
  getArticleCount,
};
