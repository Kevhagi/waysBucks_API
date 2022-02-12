'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.hasMany(models.products_order, {
        as : "products_order",
        foreignKey : {
          name : "productID"
        }
      })
    }
  }
  products.init({
    productName: DataTypes.STRING,
    productPrice: DataTypes.INTEGER,
    productImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};