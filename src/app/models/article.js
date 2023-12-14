"use strict";
const _ = require("lodash");
const { Model } = require("sequelize");
const ERROR_TEXT = require("../../utils/constants/errorText");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      models.Article.belongsTo(models.User, {
        foreignKey: "createdBy",
      });
    }
    static async new(articleDetails = {}) {
      if (!_.isObject(articleDetails))
        throw Object({ message: ERROR_TEXT.NOT_OBJECT });
      if (_.isEmpty(articleDetails))
        throw Object({ message: ERROR_TEXT.EMPTY });
      return this.create(articleDetails, {
        fields: ["title", "content", "createdBy", "updatedBy"],
      });
    }
    static async modify(articleDetails = {}, articleId = null) {
      if (!_.isObject(articleDetails))
        throw Object({ message: ERROR_TEXT.NOT_OBJECT });
      if (_.isEmpty(articleDetails))
        throw Object({
          message: ERROR_TEXT.EMPTY,
          status: HTTP_STATUS.BAD_REQUEST,
        });
      if (!(_.isFinite(articleId) || articleId > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      return this.update(articleDetails, {
        where: { id: articleId },
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
    static async findById(id = null) {
      if (!(_.isFinite(id) || id > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      return this.findOne({
        where: { id },
      });
    }
    static async findByAuthorId(authorId = null) {
      if (!(_.isFinite(authorId) || authorId > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      return this.findAll({
        where: { createdBy: authorId },
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
  Article.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      createdBy: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
      },
      updatedBy: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Article",
    }
  );
  return Article;
};
