const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const { Post } = require("./post.model");
const { Comment } = require("./comment.model");
const { Friends } = require("./friends.model");
const { Message } = require("./message.model");

sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV1,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "users",
  }
);

const { User } = sequelize.models;

//relations
User.hasMany(Post, {
  as: "posts",
  foreignKey: "user_id",
  sourceKey: "user_id",
});

User.hasMany(Comment, {
  as: "comments",
  foreignKey: "user_id",
  sourceKey: "user_id",
});

// Friends.belongsTo(User,{
//   as: 'friends1',
//   foreignKey: 'user_id'
// })

// Friends.belongsTo(User, {
//   as: 'userFriends1',
//   foreignKey: 'friend_id'
// })

User.belongsToMany(User, {
  as: "friends",
  through: "Friends",
  foreignKey: "user_id",
  otherKey: "friend_id",
});

User.belongsToMany(User, {
  as: "userFriends",
  through: "Friends",
  foreignKey: "friend_id",
});

User.hasMany(Friends, {
  foreignKey: "user_id",
  otherKey: "friend_id",
});

User.hasMany(Message, {
  foreignKey: "user_id",
  otherKey: "friend_id",
});

Message.belongsTo(User, {
  as: "userData",
  through: "User",
  foreignKey: "user_id",
  otherKey: "friend_id",
});

Message.belongsTo(User, {
  as: "friendData",
  through: "User",
  foreignKey: "friend_id",
});
module.exports.User = User;
