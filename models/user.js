'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.transactions, {
        as : "transactions",
        foreignKey : {
          name : "customerID"
        }
      })
    }
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    image: DataTypes.STRING,
    role : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};