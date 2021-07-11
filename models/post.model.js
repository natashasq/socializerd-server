const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const { User } = require('./user.model');
const { Comment } = require('./comment.model')

sequelize.define('Post', {
  post_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1
  },
  post_content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'posts'
})

const { Post } = sequelize.models;

//relations
Post.hasMany(Comment, {
  as: 'comments',
  foreignKey: 'post_id',
  sourceKey: 'post_id'
})


// Post.belongsTo(User, {
//   foreignKey: 'user_id',
// }) ovo radi u controlleru ali ne i ovde 

// Post.belongsTo(User, {
//   foreignKey: 'user_id',
//   targetKey: 'user_id'
// });
// Post.hasMany(Comment, {
//   foreignKey: 'id'
// })

module.exports.Post = Post;