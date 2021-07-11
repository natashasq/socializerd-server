const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize'); 

const { User } = require('./user.model');

sequelize.define('Friends', {
    connection_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    friend_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
    status: {
        type: DataTypes.STRING
    }
  }, {
    tableName: 'friends'
  },
  )
  
  const { Friends } = sequelize.models;


  // Friends.belongsTo(User, {
  //     forignKey: 'user_id'
  // })

  module.exports.Friends = Friends;