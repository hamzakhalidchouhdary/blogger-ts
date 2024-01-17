import { describe, it } from 'mocha';
const app = require("../../app/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const UserFixture = require("../fixtures/user");
const { generateJWT } = require("../../utils/common/auth");
const USER_ROLES = require("../../utils/constants/userRoles");
const { faker } = require("@faker-js/faker");
const { expect } = chai;
const sinon = require("sinon");
const UserModel = require("../../app/models").User;

chai.use(chaiHttp);
chai.should();
const request = chai.request;

describe("Manage Profile", function () {
  describe("Admin Role", function () {
    beforeEach(async function () {
      this.user = await UserFixture.createUser({ role: USER_ROLES.ADMIN });
      this.token = await generateJWT({ userId: this.user.id });
    });
    it("should allow to create profile", async function () {
      const resp = await request(app)
        .post("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.CREATED);
      resp.body.should.empty;
    });
    it("should allow to update profile", async function () {
      const payload = {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
      };
      const resp = await request(app)
        .put("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedUser = await UserFixture.findUserById(this.user.id);
      expect(updatedUser.firstName).to.equal(payload.firstName);
      expect(updatedUser.lastName).to.equal(payload.lastName);
      expect(updatedUser.role).to.equal(USER_ROLES.ADMIN);
    });
    it("should allow to delete profile", async function () {
      const resp = await request(app)
        .delete("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
    it("should allow to get profile", async function () {
      const resp = await request(app)
        .get("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Manager Role", function () {
    beforeEach(async function () {
      this.user = await UserFixture.createUser({ role: USER_ROLES.MANAGER });
      this.token = await generateJWT({ userId: this.user.id });
    });
    it("should allow to create profile", async function () {
      const resp = await request(app)
        .post("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.CREATED);
      resp.body.should.empty;
    });
    it("should allow to update profile", async function () {
      const payload = {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
      };
      const resp = await request(app)
        .put("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedUser = await UserFixture.findUserById(this.user.id);
      expect(updatedUser.firstName).to.equal(payload.firstName);
      expect(updatedUser.lastName).to.equal(payload.lastName);
      expect(updatedUser.role).to.equal(USER_ROLES.MANAGER);
    });
    it("should allow to delete profile", async function () {
      const resp = await request(app)
        .delete("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
    it("should allow to get profile", async function () {
      const resp = await request(app)
        .get("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Reader Role", function () {
    beforeEach(async function () {
      this.user = await UserFixture.createUser({ role: USER_ROLES.READER });
      this.token = await generateJWT({ userId: this.user.id });
    });
    it("should allow to create profile", async function () {
      const resp = await request(app)
        .post("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.CREATED);
      resp.body.should.empty;
    });
    it("should allow to update profile", async function () {
      const payload = {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
      };
      const resp = await request(app)
        .put("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedUser = await UserFixture.findUserById(this.user.id);
      expect(updatedUser.firstName).to.equal(payload.firstName);
      expect(updatedUser.lastName).to.equal(payload.lastName);
      expect(updatedUser.role).to.equal(USER_ROLES.READER);
    });
    it("should allow to delete profile", async function () {
      const resp = await request(app)
        .delete("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
    it("should allow to get profile", async function () {
      const resp = await request(app)
        .get("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Error Handling", function () {
    beforeEach(async function () {
      this.user = await UserFixture.createUser({ role: USER_ROLES.ADMIN });
      this.token = await generateJWT({ userId: this.user.id });
    });
    it("should handle 400 error while updating user profile", async function () {
      sinon
        .stub(UserModel, "modify")
        .rejects({ status: HTTP_STATUS.BAD_REQUEST, message: "Test error" });
      const payload = {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
      };
      const resp = await request(app)
        .put("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.text.should.equal("Test error");
      sinon.restore();
    });
    it("should handle 500 error while updating user profile", async function () {
      sinon.stub(UserModel, "modify").rejects({ message: "Test error" });
      const payload = {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
      };
      const resp = await request(app)
        .put("/api/v1/user/profile")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(payload);
      resp.status.should.equal(HTTP_STATUS.INTERNAL_ERROR);
      resp.text.should.equal("Test error");
      sinon.restore();
    });
  });
});
