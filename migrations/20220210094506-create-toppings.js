'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('toppings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      toppingName: {
        type: Sequelize.STRING
      },
      toppingPrice: {
        type: Sequelize.INTEGER
      },
      toppingImage: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('toppings');
  }
};