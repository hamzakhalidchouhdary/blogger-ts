"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        references: {
          model: "articles",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("comments");
  },
};
