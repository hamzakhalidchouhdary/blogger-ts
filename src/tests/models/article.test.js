const { expect } = require("chai");
const ERROR_TEXT = require("../../utils/constants/errorText");
const UserFixtures = require("../fixtures/user");
const ArticleFixtures = require("../fixtures/article");
const { faker } = require("@faker-js/faker");
const _ = require("lodash");
const ArticleModel = require("../../app/models").Article;

describe("Article Model", function () {
  before(async function () {
    this.user = await UserFixtures.createUser();
  });
  describe("Create New Article", function () {
    it("should expect an arg", async function () {
      try {
        await ArticleModel.new();
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should expect an object as arg", async function () {
      try {
        await ArticleModel.new("");
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should expect an non-empty object as arg", async function () {
      try {
        await ArticleModel.new({});
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should create new article", async function () {
      const payload = {
        title: faker.random.words(5),
        content: faker.random.words(20),
        createdBy: this.user.id,
        updatedBy: this.user.id,
      };
      await ArticleModel.new(payload);
      const [newArticle] = await ArticleFixtures.getLatestCreatedArticle();
      expect(newArticle.title).to.equal(payload.title);
      expect(newArticle.content).to.equal(payload.content);
      expect(newArticle.createdBy).to.equal(this.user.id);
      expect(newArticle.updatedBy).to.equal(this.user.id);
    });
  });
  describe("Modify Article", function () {
    beforeEach(async function () {
      this.article = await ArticleFixtures.createArticle({}, this.user.id);
    });
    it("should expect article details as first arg", async function () {
      try {
        await ArticleModel.modify(undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should expect article details object as first arg", async function () {
      try {
        await ArticleModel.modify("");
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should expect article details a non-empty object as first arg", async function () {
      try {
        await ArticleModel.modify({});
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should expect article id as second arg", async function () {
      try {
        await ArticleModel.modify({ key: "value" }, undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect article id as integer", async function () {
      try {
        await ArticleModel.modify({ key: "value" }, null);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect article id as non-zero integer", async function () {
      try {
        await ArticleModel.modify({ key: "value" }, 0);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect article id as +ve integer", async function () {
      try {
        await ArticleModel.modify({ key: "value" }, -1);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should update article title", async function () {
      await ArticleModel.modify({ title: "new title" }, this.article.id);
      const updatedArticle = await ArticleFixtures.findArticleById(
        this.article.id
      );
      expect(updatedArticle.title).to.be.equal("new title");
      expect(updatedArticle.title).not.to.be.equal(this.article.title);
    });
  });
  describe("FindLatest", function () {
    beforeEach(async function () {
      this.article1 = await ArticleFixtures.createArticle({}, this.user.id);
      this.article2 = await ArticleFixtures.createArticle({}, this.user.id);
    });
    it("should expect limit as first arg", async function () {
      try {
        await ArticleModel.findLatest(undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect limit as integer", async function () {
      try {
        await ArticleModel.findLatest(null);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect limit as non-zero integer", async function () {
      try {
        await ArticleModel.findLatest(0);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect where as second arg", async function () {
      try {
        await ArticleModel.findLatest(1, undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should expect where as object", async function () {
      try {
        await ArticleModel.findLatest(1, null);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should return top first latest article", async function () {
      const articles = await ArticleModel.findLatest(1);
      expect(articles).to.be.a("array").that.have.lengthOf(1);
      expect(articles[0].id).to.be.equal(this.article2.id);
    });
    it("should return top 2 latest article", async function () {
      const articles = await ArticleModel.findLatest(2);
      expect(articles).to.be.a("array").that.have.lengthOf(2);
      expect(_.map(articles, 'id')).to.be.have.members([this.article1.id, this.article2.id]);
    });
  });
  describe("findById", function () {
    beforeEach(async function () {
      this.article1 = await ArticleFixtures.createArticle({}, this.user.id);
      this.article2 = await ArticleFixtures.createArticle({}, this.user.id);
    });
    it("should expect an arg", async function () {
      try {
        await ArticleModel.findById();
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an integer", async function () {
      try {
        await ArticleModel.findById("");
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an non-zero integer", async function () {
      try {
        await ArticleModel.findById(0);
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an +ve integer", async function () {
      try {
        await ArticleModel.findById(-1);
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should find article by it`s id", async function () {
      const article = await ArticleModel.findById(this.article1.id);
      expect(article).to.be.a("object");
      expect(article.id).to.be.equal(this.article1.id);
      expect(article.id).not.to.be.equal(this.article2.id);
    });
  });
  describe("findByAuthorId", function () {
    beforeEach(async function () {
      this.user1 = await UserFixtures.createUser();
      this.user2 = await UserFixtures.createUser();
      this.article1 = await ArticleFixtures.createArticle({}, this.user1.id);
      this.article2 = await ArticleFixtures.createArticle({}, this.user1.id);
      this.article3 = await ArticleFixtures.createArticle({}, this.user2.id);
    });
    it("should expect an arg", async function () {
      try {
        await ArticleModel.findByAuthorId();
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an integer", async function () {
      try {
        await ArticleModel.findByAuthorId("");
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an non-zero integer", async function () {
      try {
        await ArticleModel.findByAuthorId(0);
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an +ve integer", async function () {
      try {
        await ArticleModel.findByAuthorId(-1);
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should find article by it`s author id", async function () {
      const articles = await ArticleModel.findByAuthorId(this.user1.id);
      expect(articles).to.be.a("array").that.have.lengthOf(2);
      expect(_.map(articles, "id")).to.have.members([
        this.article1.id,
        this.article2.id,
      ]);
      expect(_.map(articles, "id")).not.to.includes(this.article3.id);
    });
  });
  describe("remove article", function () {
    beforeEach(async function () {
      this.article1 = await ArticleFixtures.createArticle({}, this.user.id);
      this.article2 = await ArticleFixtures.createArticle({}, this.user.id);
    });
    it("should expect an arg", async function () {
      try {
        await ArticleModel.remove();
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an integer", async function () {
      try {
        await ArticleModel.remove("");
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an non-zero integer", async function () {
      try {
        await ArticleModel.remove(0);
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should expect an +ve integer", async function () {
      try {
        await ArticleModel.remove(-1);
      } catch ({ message }) {
        expect(message).to.be.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should find article by it`s author id", async function () {
      await ArticleModel.remove(this.article1.id);
      const deletedArticle = await ArticleFixtures.findArticleById(
        this.article1.id
      );
      expect(deletedArticle).to.be.null;
    });
  });
});
