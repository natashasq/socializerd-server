const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const { User } = require('./user.model');

sequelize.define('Message', {
    message_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1
    },
    friend_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_read: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
  }, {
    tableName: 'messages'
  })
  
  const { Message } = sequelize.models;
  


  module.exports.Message = Message;
  