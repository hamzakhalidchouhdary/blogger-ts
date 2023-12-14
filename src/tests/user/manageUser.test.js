const app = require("../../app/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const UserFixtures = require("../fixtures/user");
const USER_ROLES = require("../../utils/constants/userRoles");
const { generateJWT } = require("../../utils/common/auth");
const { faker } = require("@faker-js/faker");
const { expect } = require("chai");

chai.use(chaiHttp);
chai.should();
const request = chai.request;

describe("Manage User", function () {
  describe("Admin User Role", function () {
    before(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.ADMIN });
      this.token = await generateJWT({ userId: this.user.id });
    });
    beforeEach(function () {
      this.payload = {
        firstName: faker.name.firstName(),
        lastName: faker.name.firstName(),
        username: faker.internet.userName(),
        hashedPassword: faker.internet.password(),
      };
    });
    it("should create new user profile", async function () {
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.CREATED);
      resp.body.should.be.an("object").that.is.not.empty;
      resp.body.username.should.equal(this.payload.username);
      resp.body.firstName.should.equal(this.payload.firstName);
      resp.body.lastName.should.equal(this.payload.lastName);
      resp.body.role.should.equal(USER_ROLES.MANAGER);
      const [newlyCreatedUser] = await UserFixtures.getLatestCreatedUser();
      newlyCreatedUser.username.should.equal(this.payload.username);
      newlyCreatedUser.firstName.should.equal(this.payload.firstName);
      newlyCreatedUser.lastName.should.equal(this.payload.lastName);
      newlyCreatedUser.role.should.equal(USER_ROLES.MANAGER);
    });
    it("should not allow to create new user profile if firstName is undefined", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      delete this.payload.firstName;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if lastName is undefined", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      delete this.payload.lastName;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if password is undefined", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      delete this.payload.hashedPassword;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if username is undefined", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      delete this.payload.username;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if firstName is empty", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.firstName = "";
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if lastName is empty", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.lastName = "";
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if password is empty", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.hashedPassword = "";
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if username is empty", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.username = "";
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if firstName is null", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.firstName = null;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if lastName is null", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.lastName = null;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if password is null", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.hashedPassword = null;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should not allow to create new user profile if username is null", async function () {
      const userCountBefore = await UserFixtures.getUserCount();
      this.payload.username = null;
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send(this.payload);
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.be.an("array").that.have.lengthOf(1);
      const userCountAfter = await UserFixtures.getUserCount();
      userCountBefore.should.equal(userCountAfter);
    });
    it("should allow admin to update user profile", async function () {
      const newFirstName = faker.name.firstName();
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ firstName: newFirstName });
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.firstName.should.equal(newFirstName);
      updatedUserDetails.lastName.should.equal(this.payload.lastName);
      updatedUserDetails.username.should.equal(this.payload.username);
    });
    it("should allow admin to edit user profile - first name update ", async function () {
      const newFirstName = faker.name.firstName();
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ firstName: newFirstName });
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.firstName.should.equal(newFirstName);
    });
    it("should allow admin to edit user profile - last name update ", async function () {
      const newLastName = faker.name.firstName();
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ lastName: newLastName });
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.lastName.should.equal(newLastName);
    });
    it("should allow admin to edit user profile - username update ", async function () {
      const newUserName = faker.internet.userName();
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ username: newUserName });
      resp.status.should.equal(HTTP_STATUS.OK);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.username.should.equal(newUserName);
    });
    it("should not allow admin to edit user profile - if first name is null", async function () {
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ firstName: null });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.firstName.should.equal(this.payload.firstName);
    });
    it("should not allow admin to edit user profile - if last name is null", async function () {
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ lastName: null });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.lastName.should.equal(this.payload.lastName);
    });
    it("should not allow admin to edit user profile - if username is null", async function () {
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({ username: null });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.username.should.equal(this.payload.username);
    });
    it("should not update user profile if details are empty", async function () {
      const user = await UserFixtures.createUser(this.payload);
      const resp = await request(app)
        .put(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      const updatedUserDetails = await UserFixtures.findUserById(user.id);
      updatedUserDetails.username.should.equal(this.payload.username);
      updatedUserDetails.firstName.should.equal(this.payload.firstName);
      updatedUserDetails.lastName.should.equal(this.payload.lastName);
    });
    it("should allow to delete user profile", async function () {
      const user = await UserFixtures.createUser(this.payload);
      const userCountBefore = await UserFixtures.getUserCount();
      const resp = await request(app)
        .delete(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      const userCountAfter = await UserFixtures.getUserCount();
      const deletedUser = await UserFixtures.findUserById(user.id);
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
      userCountBefore.should.equal(userCountAfter + 1);
      expect(deletedUser).to.be.null;
    });
    it("should allow to get user profile", async function () {
      const resp = await request(app)
        .get("/api/v1/user/manage/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Manager User Role", function () {
    before(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.MANAGER });
      this.token = await generateJWT({ userId: this.user.id });
    });
    it("should not allow to create new user profile", async function () {
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.firstName(),
          username: faker.internet.userName(),
          hashedPassword: faker.internet.password(),
        });
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should not allow to update user profile", async function () {
      const resp = await request(app)
        .put("/api/v1/user/manage/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should not allow to delete user profile", async function () {
      const user = await UserFixtures.createUser(this.payload);
      const userCountBefore = await UserFixtures.getUserCount();
      const resp = await request(app)
        .delete(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      const userCountAfter = await UserFixtures.getUserCount();
      const deletedUser = await UserFixtures.findUserById(user.id);
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
      userCountBefore.should.equal(userCountAfter);
      expect(deletedUser).to.be.a("object").that.is.not.empty;
    });
    it("should allow to get user profile", async function () {
      const resp = await request(app)
        .get("/api/v1/user/manage/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
  describe("Reader User Role", function () {
    before(async function () {
      this.user = await UserFixtures.createUser({ role: USER_ROLES.READER });
      this.token = await generateJWT({ userId: this.user.id });
    });
    it("should not allow to create new user profile", async function () {
      const resp = await request(app)
        .post("/api/v1/user/manage/new")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({
          firstName: faker.name.firstName(),
          lastName: faker.name.firstName(),
          username: faker.internet.userName(),
          hashedPassword: faker.internet.password(),
        });
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should not allow to update user profile", async function () {
      const resp = await request(app)
        .put("/api/v1/user/manage/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should not allow to delete user profile", async function () {
      const user = await UserFixtures.createUser(this.payload);
      const userCountBefore = await UserFixtures.getUserCount();
      const resp = await request(app)
        .delete(`/api/v1/user/manage/${user.id}`)
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      const userCountAfter = await UserFixtures.getUserCount();
      const deletedUser = await UserFixtures.findUserById(user.id);
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
      userCountBefore.should.equal(userCountAfter);
      expect(deletedUser).to.be.a("object").that.is.not.empty;
    });
    it("should allow to get user profile", async function () {
      const resp = await request(app)
        .get("/api/v1/user/manage/1")
        .set({ Authorization: `Bearer ${this.token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.empty;
    });
  });
});
