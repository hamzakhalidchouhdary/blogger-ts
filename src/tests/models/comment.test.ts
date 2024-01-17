import { describe, it } from 'mocha';
const { expect } = require("chai");
const CommentModel = require("../../app/models").Comment;
const ERROR_TEXT = require("../../utils/constants/errorText");
const UserFixtures = require("../fixtures/user");
const ArticleFixtures = require("../fixtures/article");
const CommentFixtures = require("../fixtures/comment");
const USER_ROLES = require("../../utils/constants/userRoles");

describe("Comment Model", function () {
  before(async function () {
    this.user = await UserFixtures.createUser({ role: USER_ROLES.ADMIN });
    this.article = await ArticleFixtures.createArticle({}, this.user.id);
  });
  describe("Create new", function () {
    it("should expect a object arg", async function () {
      try {
        await CommentModel.new("");
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should expect a non object arg", async function () {
      try {
        await CommentModel.new({});
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should create a new comment", async function () {
      const payload = {
        content: "test comment",
        articleId: this.article.id,
        createdBy: this.user.id,
        updatedBy: this.user.id,
      };
      const articleCommentCountBefore = await CommentFixtures.getCommentCount(
        this.article.id
      );
      await CommentModel.new(payload);
      const articleCommentCountAfter = await CommentFixtures.getCommentCount(
        this.article.id
      );
      expect(articleCommentCountBefore + 1).to.equal(articleCommentCountAfter);
    });
  });
  describe("Get Comment by Id", function () {
    beforeEach(async function () {
      this.comment = await CommentFixtures.createComment(
        "test comment",
        this.article.id,
        this.user.id
      );
    });
    it("should throw error if no comment id available", async function () {
      try {
        await CommentModel.getById();
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if comment id is 0", async function () {
      try {
        await CommentModel.getById(0);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if comment id is -ve", async function () {
      try {
        await CommentModel.getById(-10);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should return comment data if id is valid", async function () {
      const comment = await CommentModel.getById(this.comment.id);
      expect(comment.id).to.equal(this.comment.id);
      expect(comment.content).to.equal(this.comment.content);
      expect(comment.createdBy).to.equal(this.user.id);
      expect(comment.updatedBy).to.equal(this.user.id);
      expect(comment.articleId).to.equal(this.article.id);
    });
  });
  describe("Modify Comment", function () {
    beforeEach(async function () {
      this.comment = await CommentFixtures.createComment(
        "test comment",
        this.article.id,
        this.user.id
      );
    });
    it("should throw error if no comment id available", async function () {
      try {
        await CommentModel.modify("updated comment");
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if comment id is 0", async function () {
      try {
        await CommentModel.modify("updated comment", 0);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if comment id is -ve", async function () {
      try {
        await CommentModel.modify("updated comment", -10);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if no user id available", async function () {
      try {
        await CommentModel.modify("updated comment", this.comment.id);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if comment id is 0", async function () {
      try {
        await CommentModel.modify("updated comment", this.comment.id, 0);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if comment id is -ve", async function () {
      try {
        await CommentModel.modify("updated comment", this.comment.id, -10);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if comment content not available", async function () {
      try {
        await CommentModel.modify(undefined, this.comment.id, this.user.id);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should throw error if comment content is empty", async function () {
      try {
        await CommentModel.modify("", this.comment.id, this.user.id);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should throw error if comment content is null", async function () {
      try {
        await CommentModel.modify(null, this.comment.id, this.user.id);
      } catch (err) {
        expect(err.message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should update comment", async function () {
      await CommentModel.modify(
        "updated comment",
        this.comment.id,
        this.user.id
      );
      const updatedComment = await CommentFixtures.getCommentById(
        this.comment.id
      );
      expect(updatedComment.content).to.equal("updated comment");
    });
    it("should not update other user comment", async function () {
      const otherUser = await UserFixtures.createUser({
        role: USER_ROLES.ADMIN,
      });
      await CommentModel.modify(
        "updated comment",
        this.comment.id,
        otherUser.id
      );
      const updatedComment = await CommentFixtures.getCommentById(
        this.comment.id
      );
      expect(updatedComment.content).to.equal(this.comment.content);
      expect(updatedComment.content).not.to.equal("updated comment");
    });
  });
  describe("Remove Comment", function () {
    beforeEach(async function () {
      this.comment = await CommentFixtures.createComment(
        "test comment",
        this.article.id,
        this.user.id
      );
    });
    it("should delete user comment", async function () {
      await CommentModel.remove(this.comment.id, this.user.id);
      const deletedComment = await CommentFixtures.getCommentById(
        this.comment.id
      );
      expect(deletedComment).to.be.null;
    });
    it("should not delete other user comment", async function () {
      const otherUser = await UserFixtures.createUser({
        role: USER_ROLES.ADMIN,
      });
      await CommentModel.remove(this.comment.id, otherUser.id);
      const deletedComment = await CommentFixtures.getCommentById(
        this.comment.id
      );
      expect(deletedComment).not.to.be.null;
    });
  });
});
