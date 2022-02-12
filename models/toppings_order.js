'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class toppings_order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      toppings_order.belongsTo(models.products_order, {
        as : "products_order",
        foreignKey : {
          name : "productOrderID"
        }
      })

      toppings_order.belongsTo(models.toppings, {
        as : "toppings",
        foreignKey : {
          name : "toppingID"
        }
      })
    }
  }
  toppings_order.init({
    productOrderID: DataTypes.INTEGER,
    toppingID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'toppings_order',
  });
  return toppings_order;
};