const app = require("../../app/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const UserFixture = require("../fixtures/user");
const { verifyJWT } = require("../../utils/common/auth");

chai.use(chaiHttp);
chai.should();
const request = chai.request;

describe("auth", function () {
  describe("Login", function () {
    before(async function () {
      this.user = await UserFixture.createUser({ hashedPassword: "1234" });
    });
    it("should return user token with correct username and password", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: this.user.username,
        password: "1234",
      });
      resp.status.should.equal(HTTP_STATUS.OK);
      resp.body.should.have.key("token");
      const decodedToken = await verifyJWT(resp.body.token);
      decodedToken.userId.should.equal(this.user.id);
    });
    it("should not login if password is incorrect", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: this.user.username,
        password: "12345",
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should not login if username is incorrect", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: "randomUser",
        password: "1234",
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should not login if password is empty", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: this.user.username,
        password: "",
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should not login if password is null", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: this.user.username,
        password: null,
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should not login if password is undefined", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: this.user.username,
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should not login if username is empty", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: "",
        password: "1234",
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should not login if username is null", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        username: null,
        password: "1234",
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should not login if username is undefined", async function () {
      const resp = await request(app).post("/api/v1/auth/login").send({
        password: "1234",
      });
      resp.status.should.equal(HTTP_STATUS.BAD_REQUEST);
      resp.body.should.empty;
    });
    it("should access login:get route", async function () {
      const resp = await request(app).get("/api/v1/auth/login").send({});
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      resp.body.should.empty;
    });
    it("should access login:put route", async function () {
      const resp = await request(app).put("/api/v1/auth/login").send({});
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      resp.body.should.empty;
    });
    it("should access login:delete route", async function () {
      const resp = await request(app).delete("/api/v1/auth/login").send({});
      resp.status.should.equal(HTTP_STATUS.NOT_ALLOWED);
      resp.body.should.empty;
    });
  });
});
