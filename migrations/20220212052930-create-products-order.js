'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionID: {
        type: Sequelize.INTEGER,
        references : {
          model : "transactions",
          key : "id"
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
      },
      productID: {
        type: Sequelize.INTEGER,
        references : {
          model : "products",
          key : "id"
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products_orders');
  }
};