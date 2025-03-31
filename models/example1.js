'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class example1 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  example1.init({
    name: DataTypes.STRING,
    col1: DataTypes.STRING,
    col2: DataTypes.STRING,
    col3: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'example1',
  });
  return example1;
};