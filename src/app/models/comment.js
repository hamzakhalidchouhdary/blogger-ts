"use strict";
const { Model } = require("sequelize");
const _ = require("lodash");
const HTTP_STATUS = require("../../utils/constants/httpStatus");
const ERROR_TEXT = require("../../utils/constants/errorText");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {}
    static async new(commentDetails = {}) {
      if (!_.isObject(commentDetails))
        throw Object({ message: ERROR_TEXT.NOT_OBJECT });
      if (_.isEmpty(commentDetails))
        throw Object({ message: ERROR_TEXT.EMPTY });
      return this.create(commentDetails, {
        fields: ["content", "createdBy", "updatedBy", "articleId"],
      });
    }
    static async getById(id = null) {
      if (!(_.isFinite(id) || id > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      return this.findOne({ where: { id } });
    }
    static async modify(content = "", id = null, ownerId = null) {
      if (!(_.isFinite(id) || id > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      if (!(_.isFinite(ownerId) || ownerId > 0))
        throw Object({ message: ERROR_TEXT.INVALID_NUM });
      if (_.isEmpty(content)) throw Object({ message: ERROR_TEXT.EMPTY });

      this.update({ content }, { where: { id, updatedBy: ownerId } });
    }
    static async remove(id, createdBy) {
      return this.destroy({
        where: {
          id,
          createdBy,
        },
      });
    }
    static async getAllByArticleId(articleId) {
      return this.findAll({ where: { articleId } });
    }
  }
  Comment.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
