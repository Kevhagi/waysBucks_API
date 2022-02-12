'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  products_order.init({
    transactionID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products_order',
  });
  return products_order;
};