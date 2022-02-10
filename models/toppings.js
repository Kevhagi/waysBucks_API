'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class toppings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  toppings.init({
    toppingName: DataTypes.STRING,
    toppingPrice: DataTypes.INTEGER,
    toppingImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'toppings',
  });
  return toppings;
};