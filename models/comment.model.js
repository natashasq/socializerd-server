const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const { User } = require('./user.model');
const { Post } = require('./post.model');

sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1
      },
      comment_content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },{
        tableName: 'comments'
    })

const { Comment } = sequelize.models;

    //relations
// Comment.belongsTo(User)
// Comment.belongsTo(Post)

module.exports.Comment = Comment;