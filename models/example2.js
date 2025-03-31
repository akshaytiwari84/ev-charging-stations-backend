'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class example2 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  example2.init({
    name: DataTypes.STRING,
    col4: DataTypes.STRING,
    col5: DataTypes.STRING,
    col6: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'example2',
  });
  return example2;
};