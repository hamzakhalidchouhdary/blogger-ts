import { describe, it } from 'mocha';
const { expect } = require("chai");
const { faker } = require("@faker-js/faker");
const ERROR_TEXT = require("../../utils/constants/errorText");
const UserFixtures = require("../fixtures/user");
const UserModel = require("../../app/models").User;
const _ = require('lodash');

describe("User Model", function () {
  before(function () {
    this.payload = {
      firstName: faker.name.firstName(),
      lastName: faker.name.firstName(),
      username: faker.internet.userName(),
      hashedPassword: faker.internet.password(),
    };
  });
  describe("Create New User", function () {
    it("should throw error if payload is not object", async function () {
      try {
        await UserModel.new("");
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should throw error if payload is empty object", async function () {
      try {
        await UserModel.new({});
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should create new user", async function () {
      await UserModel.new(this.payload);
      const [newUser] = await UserFixtures.getLatestCreatedUser();
      expect(newUser.firstName).equal(this.payload.firstName);
      expect(newUser.lastName).equal(this.payload.lastName);
      expect(newUser.username).equal(this.payload.username);
    });
  });
  describe("Modify User", function () {
    beforeEach(async function () {
      this.user = await UserFixtures.createUser();
    });
    it("should throw error if payload is not object", async function () {
      try {
        await UserModel.modify("", this.user.id);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should throw error if payload is empty object", async function () {
      try {
        await UserModel.modify({}, this.user.id);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should throw error if user is undefined", async function () {
      try {
        await UserModel.modify(this.payload, undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if user is null", async function () {
      try {
        await UserModel.modify(this.payload, null);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if user is 0", async function () {
      try {
        await UserModel.modify(this.payload, 0);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if user is -ve", async function () {
      try {
        await UserModel.modify(this.payload, -10);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should update user details", async function () {
      await UserModel.modify({ firstName: "newName" }, this.user.id);
      const newUser = await UserFixtures.findUserById(this.user.id);
      expect(newUser.firstName).equal("newName");
    });
  });
  describe("FindLatest User", function () {
    before(async function () {
      this.user1 = await UserFixtures.createUser();
      this.user2 = await UserFixtures.createUser();
    });
    it("should throw error if limit is undefined", async function () {
      try {
        await UserModel.findLatest(undefined, {});
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if limit is 0", async function () {
      try {
        await UserModel.findLatest(0, {});
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if limit is null", async function () {
      try {
        await UserModel.findLatest(null, {});
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if limit is -ve", async function () {
      try {
        await UserModel.findLatest(-1, {});
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if where is not a object", async function () {
      try {
        await UserModel.findLatest(1, "");
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.NOT_OBJECT);
      }
    });
    it("should return latest user by default", async function () {
      const [user] = await UserModel.findLatest();
      expect(user).to.be.a("object");
      expect(user.id).to.equal(this.user2.id);
    });
    it("should return latest 2 user", async function () {
      const user = await UserModel.findLatest(2);
      expect(user).to.be.an("array").that.have.lengthOf(2);
      expect(_.map(user, 'id')).to.have.members([this.user1.id, this.user2.id]);
    });
  });
  describe("findByUsername", function () {
    beforeEach(async function () {
      (this.fakeUsername = faker.internet.userName()),
        (this.user1 = await UserFixtures.createUser({
          username: this.fakeUsername,
        }));
      this.user2 = await UserFixtures.createUser();
    });
    it("should throw error if username is undefined", async function () {
      try {
        const user = await UserModel.findByUsername(undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should throw error if username is null", async function () {
      try {
        const user = await UserModel.findByUsername(null);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should throw error if username is empty", async function () {
      try {
        const user = await UserModel.findByUsername("");
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.EMPTY);
      }
    });
    it("should find user by username", async function () {
      const user = await UserModel.findByUsername(this.fakeUsername);
      expect(user).to.be.a("object");
      expect(user.id).to.equal(this.user1.id);
    });
  });
  describe("findById", function () {
    beforeEach(async function () {
      this.user = await UserFixtures.createUser();
    });
    it("should throw error if id is undefined", async function () {
      try {
        const user = await UserModel.findById(undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if id is null", async function () {
      try {
        const user = await UserModel.findById(null);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if id is 0", async function () {
      try {
        const user = await UserModel.findById(0);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if id is -ve", async function () {
      try {
        const user = await UserModel.findById(-1);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should return user by its id", async function () {
      const user = await UserModel.findById(this.user.id);
      expect(user).to.be.a("object");
      expect(user.id).to.equal(this.user.id);
    });
  });
  describe("delete user", function () {
    beforeEach(async function () {
      this.user = await UserFixtures.createUser();
    });
    it("should throw error if id is undefined", async function () {
      try {
        const user = await UserModel.remove(undefined);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if id is null", async function () {
      try {
        const user = await UserModel.remove(null);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if id is 0", async function () {
      try {
        const user = await UserModel.remove(0);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should throw error if id is -ve", async function () {
      try {
        const user = await UserModel.remove(-1);
      } catch ({ message }) {
        expect(message).to.equal(ERROR_TEXT.INVALID_NUM);
      }
    });
    it("should return user by its id", async function () {
      await UserModel.remove(this.user.id);
      const user = await UserFixtures.findUserById(this.user.id);
      expect(user).to.be.null;
    });
  });
});
