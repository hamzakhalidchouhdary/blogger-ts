import { describe, it } from 'mocha';
const app = require("../../app/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const UserFixtures = require("../fixtures/user");
const ArticleFixtures = require("../fixtures/article");
const CommentFixtures = require("../fixtures/comment");
const USER_ROLES = require("../../utils/constants/userRoles");
const { expect } = require("chai");
const sinon = require("sinon");
const CommentModel = require("../../app/models").Comment;

chai.use(chaiHttp);
chai.should();
const request = chai.request;

describe("Article Comments", function () {
  describe("Admin Role", function () {
    before(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.ADMIN });
      this.token = await UserFixtures.getUserToken(this.user.id);
    });
    beforeEach(async function () {
      this.article = await ArticleFixtures.createArticle({}, this.user.id);
    });
    it("should allow admin to add comments on article", async function () {
      const payload = {
        content: "test comment",
      };
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .post(`/api/v1/article/${this.article.id}/comment`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.CREATED);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore).to.be.equal(
        articleCommentCountAfter - 1
      );
    });
    it("should throw error if content is undefined", async function () {
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .post(`/api/v1/article/${this.article.id}/comment`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send();
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore).to.be.equal(articleCommentCountAfter);
      resp.body.should.to.have.lengthOf(2);
    });
    it("should throw error if content is empty", async function () {
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .post(`/api/v1/article/${this.article.id}/comment`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ content: "" });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore).to.be.equal(articleCommentCountAfter);
      resp.body.should.to.have.lengthOf(1);
    });
    it("should throw error if content is null", async function () {
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .post(`/api/v1/article/${this.article.id}/comment`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ content: null });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore).to.be.equal(articleCommentCountAfter);
      resp.body.should.to.have.lengthOf(1);
    });
    it("should throw error if try to add comment on a article that not exist", async function () {
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const payload = { content: "abc" };
      const resp = await request(app)
        .post(`/api/v1/article/0/comment`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.INTERNAL_ERROR);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore).to.be.equal(articleCommentCountAfter);
    });
    it("should allow admin to edit comments on article", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const payload = { content: "updated comment" };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(payload.content);
    });
    it("should not allow to edit comment if content is undefined", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const payload = {};
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.have.lengthOf(2);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(comment.content);
    });
    it("should not allow to edit comment if content is empty", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const payload = { content: "" };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.have.lengthOf(1);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(comment.content);
    });
    it("should not allow to edit comment if content is null", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const payload = { content: null };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.have.lengthOf(1);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(comment.content);
    });
    it("should not allow admin to edit other user`s comments on article", async function () {
      const tempUser = await UserFixtures.createUser();
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        tempUser.id
      );
      const payload = { content: "updated comment" };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(comment.content);
    });
    it("should allow admin to delete comments on article", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const commentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .delete(`/api/v1/article/${this.article}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      const commentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const deletedComment = await CommentFixtures.getCommentById(comment.id);
      expect(commentCountAfter).to.equal(commentCountBefore - 1);
      expect(deletedComment).to.be.null;
      resp.body.should.empty;
    });
    it("should not allow admin to delete comments of other user", async function () {
      const commentOwner = await UserFixtures.createUser({});
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        commentOwner.id
      );
      const commentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .delete(`/api/v1/article/${this.article}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      const commentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const deletedComment = await CommentFixtures.getCommentById(comment.id);
      expect(commentCountAfter).to.equal(commentCountBefore);
      expect(deletedComment).to.be.a("object");
      resp.body.should.empty;
    });
    it("should allow admin to view all comments on article", async function () {
      const tempUser1 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });
      const tempUser2 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });
      const tempUser3 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });

      await CommentFixtures.createComment("", this.article.id, tempUser1.id);
      await CommentFixtures.createComment("", this.article.id, tempUser2.id);
      await CommentFixtures.createComment("", this.article.id, tempUser3.id);
      await CommentFixtures.createComment("", this.article.id, this.user.id);

      const resp = await request(app)
        .get(`/api/v1/article/${this.article.id}/comment/list`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.be.an("array");
      expect(resp.body).to.have.lengthOf(4);
    });
    it("should allow admin to view single comment", async function () {
      const resp = await request(app)
        .get(`/api/v1/article/${this.article.id}/comment/`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.be.an("object");
      expect(resp.body).to.be.empty;
    });
    describe('Assert Error Handling', function() {
      it("should gracefully handling error when fetching comment list", async function () {
        sinon
          .stub(CommentModel, "getAllByArticleId")
          .rejects({ status: HTTP_STATUS.BAD_REQUEST, message: "Test error" });
  
        const resp = await request(app)
          .get(`/api/v1/article/${this.article.id}/comment/list`)
          .set({ Authorization: `Bearer ${this.token}` })
          .send({});
  
        resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
        resp.text.should.equal("Test error");
        sinon.restore();
      });
      it("should send 500 error when no status code defined", async function () {
        sinon
          .stub(CommentModel, "getAllByArticleId")
          .rejects({ message: "Test error" });
  
        const resp = await request(app)
          .get(`/api/v1/article/${this.article.id}/comment/list`)
          .set({ Authorization: `Bearer ${this.token}` })
          .send({});
  
        resp.status.should.equal(HTTP_STATUS.INTERNAL_ERROR);
        resp.text.should.equal("Test error");
        sinon.restore();
      });
    })
  });
  describe("Manager Role", function () {
    before(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.MANAGER });
      this.token = await UserFixtures.getUserToken(this.user.id);
    });
    beforeEach(async function () {
      this.article = await ArticleFixtures.createArticle({}, this.user.id);
    });
    it("should allow manager to add comments on article", async function () {
      const payload = {
        content: "test comment",
      };
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .post(`/api/v1/article/${this.article.id}/comment`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.CREATED);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore).to.be.equal(
        articleCommentCountAfter - 1
      );
    });
    it("should allow manager to edit comments on article", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const payload = { content: "updated comment" };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(payload.content);
    });
    it("should not allow manager to edit other user`s comments on article", async function () {
      const tempUser = await UserFixtures.createUser();
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        tempUser.id
      );
      const payload = { content: "updated comment" };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(comment.content);
    });
    it("should allow manager to delete comments on article", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const commentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .delete(`/api/v1/article/${this.article}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      const commentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const deletedComment = await CommentFixtures.getCommentById(comment.id);
      expect(commentCountAfter).to.equal(commentCountBefore - 1);
      expect(deletedComment).to.be.null;
      resp.body.should.empty;
    });
    it("should not allow manager to delete comments of other user", async function () {
      const commentOwner = await UserFixtures.createUser({});
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        commentOwner.id
      );
      const commentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .delete(`/api/v1/article/${this.article}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      const commentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const deletedComment = await CommentFixtures.getCommentById(comment.id);
      expect(commentCountAfter).to.equal(commentCountBefore);
      expect(deletedComment).to.be.a("object");
      resp.body.should.empty;
    });
    it("should allow manager to view all comments on article", async function () {
      const tempUser1 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });
      const tempUser2 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });
      const tempUser3 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });

      await CommentFixtures.createComment("", this.article.id, tempUser1.id);
      await CommentFixtures.createComment("", this.article.id, tempUser2.id);
      await CommentFixtures.createComment("", this.article.id, tempUser3.id);
      await CommentFixtures.createComment("", this.article.id, this.user.id);

      const resp = await request(app)
        .get(`/api/v1/article/${this.article.id}/comment/list`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.be.an("array");
      expect(resp.body).to.have.lengthOf(4);
    });
  });
  describe("Reader Role", function () {
    before(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.READER });
      this.token = await UserFixtures.getUserToken(this.user.id);
    });
    beforeEach(async function () {
      this.article = await ArticleFixtures.createArticle({}, this.user.id);
    });
    it("should allow reader to add comments on article", async function () {
      const payload = {
        content: "test comment",
      };
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .post(`/api/v1/article/${this.article.id}/comment`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.CREATED);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore).to.be.equal(
        articleCommentCountAfter - 1
      );
    });
    it("should allow reader to edit comments on article", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const payload = { content: "updated comment" };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(payload.content);
    });
    it("should not allow reader to edit other user`s comments on article", async function () {
      const tempUser = await UserFixtures.createUser();
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        tempUser.id
      );
      const payload = { content: "updated comment" };
      const resp = await request(app)
        .put(`/api/v1/article/${this.article.id}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      const updatedComment = await CommentFixtures.getCommentById(comment.id);
      expect(updatedComment.content).to.equal(comment.content);
    });
    it("should allow reader to delete comments on article", async function () {
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        this.user.id
      );
      const commentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .delete(`/api/v1/article/${this.article}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      const commentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const deletedComment = await CommentFixtures.getCommentById(comment.id);
      expect(commentCountAfter).to.equal(commentCountBefore - 1);
      expect(deletedComment).to.be.null;
      resp.body.should.empty;
    });
    it("should not allow reader to delete comments of other user", async function () {
      const commentOwner = await UserFixtures.createUser({});
      const comment = await CommentFixtures.createComment(
        "",
        this.article.id,
        commentOwner.id
      );
      const commentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const resp = await request(app)
        .delete(`/api/v1/article/${this.article}/comment/${comment.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      const commentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      const deletedComment = await CommentFixtures.getCommentById(comment.id);
      expect(commentCountAfter).to.equal(commentCountBefore);
      expect(deletedComment).to.be.a("object");
      resp.body.should.empty;
    });
    it("should allow reader to view all comments on article", async function () {
      const tempUser1 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });
      const tempUser2 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });
      const tempUser3 = await UserFixtures.createUser({
        role: USER_ROLES.MANAGER,
      });

      await CommentFixtures.createComment("", this.article.id, tempUser1.id);
      await CommentFixtures.createComment("", this.article.id, tempUser2.id);
      await CommentFixtures.createComment("", this.article.id, tempUser3.id);
      await CommentFixtures.createComment("", this.article.id, this.user.id);

      const resp = await request(app)
        .get(`/api/v1/article/${this.article.id}/comment/list`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.be.an("array");
      expect(resp.body).to.have.lengthOf(4);
    });
  });
});
