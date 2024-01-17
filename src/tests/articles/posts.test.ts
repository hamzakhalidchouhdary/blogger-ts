import { describe, it } from 'mocha';
const app = require("../../app/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const UserFixtures = require("../fixtures/user");
const USER_ROLES = require("../../utils/constants/userRoles");
const ArticleFixtures = require("../fixtures/article");
const { expect } = require("chai");
const ArticleModel = require("../../app/models").Article;
const _ = require("lodash");
const sinon = require("sinon");

chai.use(chaiHttp);
chai.should();
const request = chai.request;

describe("Article Posts", function () {
  beforeEach(function () {
    this.payload = {
      title: "test article",
      content: "this is test article",
    };
  });
  describe("Admin Role", function () {
    beforeEach(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.ADMIN });
      this.token = await UserFixtures.getUserToken(this.user.id);
    });
    it("should allow admin to create new post", async function () {
      const resp = await request(app)
        .post("/api/v1/article")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.CREATED);
      const [newArticle] = await ArticleModel.findLatest();
      newArticle.title.should.equal(this.payload.title);
      newArticle.content.should.equal(this.payload.content);
      newArticle.createdBy.should.equal(this.user.id);
      newArticle.updatedBy.should.equal(this.user.id);
    });
    it("should not allow admin to create new post if body is empty", async function () {
      const articleCountBefore = await ArticleFixtures.getArticleCount();
      const resp = await request(app)
        .post("/api/v1/article")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const articleCountAfter = await ArticleFixtures.getArticleCount();
      resp.body.should.to.have.lengthOf(4);
      articleCountBefore.should.to.equal(articleCountAfter);
    });
    it("should not allow admin to create new post if title is empty", async function () {
      const articleCountBefore = await ArticleFixtures.getArticleCount();
      this.payload.title = "";
      const resp = await request(app)
        .post("/api/v1/article")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.to.have.lengthOf(1);
      const articleCountAfter = await ArticleFixtures.getArticleCount();
      articleCountBefore.should.to.equal(articleCountAfter);
    });
    it("should not allow admin to create new post if content is empty", async function () {
      this.payload.content = "";
      const articleCountBefore = await ArticleFixtures.getArticleCount();
      const resp = await request(app)
        .post("/api/v1/article")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.to.have.lengthOf(1);
      const articleCountAfter = await ArticleFixtures.getArticleCount();
      articleCountBefore.should.to.equal(articleCountAfter);
    });
    it("should allow admin to edit a post", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const payload = { title: "update title" };
      const resp = await request(app)
        .put(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedArticle = await ArticleFixtures.findArticleById(
        newArticle.id
      );
      expect(updatedArticle.title).to.be.equal(payload.title);
    });
    it("should not edit a post title if empty", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const payload = { title: "" };
      const resp = await request(app)
        .put(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const updatedArticle = await ArticleFixtures.findArticleById(
        newArticle.id
      );
      expect(updatedArticle.title).to.be.equal(newArticle.title);
    });
    it("should not edit a post content if empty", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const payload = { content: "" };
      const resp = await request(app)
        .put(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const updatedArticle = await ArticleFixtures.findArticleById(
        newArticle.id
      );
      expect(updatedArticle.content).to.be.equal(newArticle.content);
    });
    it("should not edit a post if payload empty", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const payload = {};
      const resp = await request(app)
        .put(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const updatedArticle = await ArticleFixtures.findArticleById(
        newArticle.id
      );
      expect(updatedArticle.title).to.be.equal(newArticle.title);
      expect(updatedArticle.content).to.be.equal(newArticle.content);
    });
    it("should not update a post title", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const payload = { title: "updated title" };
      const resp = await request(app)
        .put(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedArticle = await ArticleFixtures.findArticleById(
        newArticle.id
      );
      expect(updatedArticle.title).to.be.equal(payload.title);
    });
    it("should not update a post content", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const payload = { content: "updated content" };
      const resp = await request(app)
        .put(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedArticle = await ArticleFixtures.findArticleById(
        newArticle.id
      );
      expect(updatedArticle.content).to.be.equal(payload.content);
    });
    it("should allow admin to delete a post", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const articleCountBefore = await ArticleFixtures.getArticleCount();
      const resp = await request(app)
        .delete(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      const articleCountAfter = await ArticleFixtures.getArticleCount();
      expect(articleCountBefore).to.equal(articleCountAfter + 1);
      resp.body.should.empty;
    });
    it("should return all admin's post", async function () {
      const tempUser = await UserFixtures.createUser({});
      const article1 = await ArticleFixtures.createArticle({}, this.user.id);
      const article2 = await ArticleFixtures.createArticle({}, this.user.id);
      const article3 = await ArticleFixtures.createArticle({}, this.user.id);
      const article4 = await ArticleFixtures.createArticle({}, this.user.id);
      await ArticleFixtures.createArticle({}, tempUser.id);

      const resp = await request(app)
        .get("/api/v1/article/list")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.be.an("array");
      resp.body.should.have.lengthOf(4);
      expect(_.map(resp.body, "id")).to.have.members([
        article1.id,
        article2.id,
        article3.id,
        article4.id,
      ]);
    });
    it("should allow admin to fetch post by id", async function () {
      const resp = await request(app)
        .get("/api/v1/article/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Manager Role", function () {
    beforeEach(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.MANAGER });
      this.token = await UserFixtures.getUserToken(this.user.id);
    });
    it("should allow manager to create new post", async function () {
      const resp = await request(app)
        .post("/api/v1/article")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.CREATED);
      const [newArticle] = await ArticleFixtures.getLatestCreatedArticle();
      expect(newArticle.id).to.be.equal(resp.body.id);
      expect(newArticle.title).to.be.equal(this.payload.title);
      expect(newArticle.createdBy).to.be.equal(this.user.id);
    });
    it("should allow manager to edit a post", async function () {
      const newArticle = await ArticleFixtures.createArticle({}, this.user.id);
      const payload = { title: "update title" };
      const resp = await request(app)
        .put(`/api/v1/article/${newArticle.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedArticle = await ArticleFixtures.findArticleById(
        newArticle.id
      );
      expect(updatedArticle.title).to.be.equal(payload.title);
      expect(updatedArticle.updatedBy).to.equal(this.user.id);
    });
    it("should not allow manager to delete a post", async function () {
      const resp = await request(app)
        .delete("/api/v1/article/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should return all manager's post", async function () {
      const tempUser = await UserFixtures.createUser({});
      const article1 = await ArticleFixtures.createArticle({}, this.user.id);
      const article2 = await ArticleFixtures.createArticle({}, this.user.id);
      const article3 = await ArticleFixtures.createArticle({}, this.user.id);
      const article4 = await ArticleFixtures.createArticle({}, this.user.id);
      await ArticleFixtures.createArticle({}, tempUser.id);

      const resp = await request(app)
        .get("/api/v1/article/list")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.be.an("array");
      resp.body.should.have.lengthOf(4);
      expect(_.map(resp.body, "id")).to.have.members([
        article1.id,
        article2.id,
        article3.id,
        article4.id,
      ]);
    });
    it("should allow manager to fetch post by id", async function () {
      const resp = await request(app)
        .get("/api/v1/article/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Reader Role", function () {
    before(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.READER });
      this.token = await UserFixtures.getUserToken(this.user.id);
    });
    it("should not allow reader to create new post", async function () {
      const resp = await request(app)
        .post("/api/v1/article")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should not allow reader to edit a post", async function () {
      const resp = await request(app)
        .put("/api/v1/article/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should not allow reader to delete a post", async function () {
      const resp = await request(app)
        .delete("/api/v1/article/1s")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should return all reader's post", async function () {
      const tempUser = await UserFixtures.createUser({});
      const article1 = await ArticleFixtures.createArticle({}, this.user.id);
      const article2 = await ArticleFixtures.createArticle({}, this.user.id);
      const article3 = await ArticleFixtures.createArticle({}, this.user.id);
      const article4 = await ArticleFixtures.createArticle({}, this.user.id);
      await ArticleFixtures.createArticle({}, tempUser.id);

      const resp = await request(app)
        .get("/api/v1/article/list")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.be.an("array");
      resp.body.should.have.lengthOf(4);
      expect(_.map(resp.body, "id")).to.have.members([
        article1.id,
        article2.id,
        article3.id,
        article4.id,
      ]);
    });
    it("should allow reader to fetch post by id", async function () {
      const resp = await request(app)
        .get("/api/v1/article/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Error Handling", function () {
    beforeEach(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.ADMIN });
      this.token = await UserFixtures.getUserToken(this.user.id);
    });
    it("should handle 400 error while fetching all posts", async function () {
      sinon
        .stub(ArticleModel, "findByAuthorId")
        .rejects({ status: HTTP_STATUS.BAD_REQUEST, message: "Test error" });
      const resp = await request(app)
        .get("/api/v1/article/list")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.text.should.equal("Test error");
      sinon.restore();
    });
  });
});
