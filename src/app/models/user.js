"use strict";
const _ = require("lodash");
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const { generateHashedPassword } = require("../../utils/common/auth");
const ERROR_TEXT = require("../../utils/constants/errorText");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Article, {
        foreignKey: "createdBy",
      });
    }
    static async new(userDetails = {}) {
      if (!_.isObject(userDetails))
        throw Object({ message: ERROR_TEXT.NOT_OBJECT });
      if (_.isEmpty(userDetails)) throw Object({ message: ERROR_TEXT.EMPTY });
      return this.create(userDetails, {
        fields: ["firstName", "lastName", "hashedPassword", "username", "role"],
      });
    }
    static async modify(userDetails = {}, userId = null) {
      if (!_.isObject(userDetails))
        throw Object({ message: ERROR_TEXT.NOT_OBJECT });
      if (_.isEmpty(userDetails))
        throw Object({
          message: ERROR_TEXT.EMPTY,
          status: HTTP_STATUS.BAD_REQUEST,
        });
      if (!(_.isFinite(userId) || userId > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      return this.update(userDetails, {
        where: { id: userId },
        // fields: ['firstName', 'lastName', 'username']
      });
    }
    static async findLatest(limit = 1, where = {}) {
      if (!(_.isFinite(limit) || limit > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      if (!_.isObject(where)) throw Object({ message: ERROR_TEXT.NOT_OBJECT });
      return this.findAll({
        limit,
        where,
        order: [["createdAt", "DESC"]],
      });
    }
    static async findByUsername(username = "") {
      if (_.isEmpty(username))
        throw Object({ message: ERROR_TEXT.EMPTY, status: 400 });
      return this.findOne({
        where: { username },
      });
    }
    static async findById(id = null) {
      if (!(_.isFinite(id) || id > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      return this.findOne({
        where: { id },
      });
    }
    static async remove(id = null) {
      if (!(_.isFinite(id) || id > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      return this.destroy({
        where: { id },
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: { msg: "first name must be alphabetic value" },
          notNull: { msg: "first name can not be null" },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: { msg: "last name must be alphabetic value" },
          notNull: { msg: "last name can not be null" },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: {
            msg: "username must be alphabetic value",
            args: [/^[a-z0-9_.-]+$/gim],
          },
          notNull: { msg: "username can not be null" },
        },
      },
      hashedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "hashed password can not be empty",
          },
          notNull: { msg: "hashed password can not be null" },
        },
      },
      role: {
        type: DataTypes.ENUM,
        defaultValue: "manager",
        allowNull: false,
        values: ["admin", "manager", "reader"],
        // set(value) {
        //   this.setDataValue('role', value.toL);
        // },
        validate: {
          isIn: {
            msg: "role must be one of the `Admin` | `Manager` | `Reader`",
            args: [["admin", "manager", "reader"]],
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: async function (user) {
          const plainPassword = user.getDataValue("hashedPassword");
          const hashedPassword = await generateHashedPassword(plainPassword);
          user.setDataValue("hashedPassword", hashedPassword);
        },
      },
      indexes: [],
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
