import { describe, it } from 'mocha';
const app = require("../../app/index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const UserFixtures = require("../fixtures/user");
const {expect} = chai;

chai.use(chaiHttp);
chai.should();
const request = chai.request;

describe("Auth", function () {
  describe("User Authorization", function () {
    it("should throw error if user not found", async function () {
      const token = await UserFixtures.getUserToken(0);
      const resp = await request(app)
        .get("/api/v1/")
        .set({ Authorization: `Bearer ${token}` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      resp.body.should.empty;
    });
    it("should throw error if auth header not found", async function () {
      const resp = await request(app)
        .get("/api/v1/")
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      expect(resp.text).to.equal('token not found')
      resp.body.should.empty;
    });
    it("should throw error if auth token not found", async function () {
      const resp = await request(app)
        .get("/api/v1/")
        .set({ Authorization: `Bearer` })
        .send({});
      resp.status.should.equal(HTTP_STATUS.UNAUTHORIZED);
      expect(resp.text).to.equal('token is empty')
      resp.body.should.empty;
    });
  });
});
