'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('toppings_orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productOrderID: {
        type: Sequelize.INTEGER,
        references : {
          model : "products_orders",
          key : "id"
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
      },
      toppingID: {
        type: Sequelize.INTEGER,
        references : {
          model : "toppings",
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
    await queryInterface.dropTable('toppings_orders');
  }
};