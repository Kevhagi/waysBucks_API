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
        type: Sequelize.INTEGER,
        references : {
          model : "users",
          key : "id"
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
      },
      statusTransaction: {
        type: Sequelize.STRING
      },
      nameOrder : {
        type: Sequelize.STRING
      },
      emailOrder : {
        type: Sequelize.STRING
      },
      phoneOrder : {
        type: Sequelize.STRING
      },
      postCodeOrder : {
        type: Sequelize.INTEGER
      },
      addressOrder : {
        type: Sequelize.TEXT
      },
      transactionImage : {
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
    await queryInterface.dropTable('transactions');
  }
};