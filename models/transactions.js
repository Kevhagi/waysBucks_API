'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.belongsTo(models.user, {
        as : "customer",
        foreignKey : {
          name : "customerID"
        }
      })

      transactions.hasMany(models.products_order, {
        as : "products_order",
        foreignKey : {
          name : "transactionID"
        }
      })
    }
  }
  transactions.init({
    customerID: DataTypes.INTEGER,
    statusTransaction: DataTypes.STRING,
    nameOrder: DataTypes.STRING,
    emailOrder: DataTypes.STRING,
    phoneOrder: DataTypes.STRING,
    postCodeOrder: DataTypes.INTEGER,
    addressOrder: DataTypes.TEXT,
    transactionImage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};