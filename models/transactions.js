'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transactions.init({
    customerID: DataTypes.INTEGER,
    orderID: DataTypes.INTEGER,
    transactionImage: DataTypes.STRING,
    nameForOrder: DataTypes.STRING,
    emailForOrder: DataTypes.STRING,
    phoneForOrder: DataTypes.STRING,
    postalForOrder: DataTypes.STRING,
    addressForOrder: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};