'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerID: {
        type: Sequelize.INTEGER
      },
      orderID: {
        type: Sequelize.INTEGER
      },
      transactionImage: {
        type: Sequelize.STRING
      },
      nameForOrder: {
        type: Sequelize.STRING
      },
      emailForOrder: {
        type: Sequelize.STRING
      },
      phoneForOrder: {
        type: Sequelize.STRING
      },
      postalForOrder: {
        type: Sequelize.STRING
      },
      addressForOrder: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('transactions');
  }
};