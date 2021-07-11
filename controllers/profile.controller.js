const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const User = require("../models/user.model").User;
const Post = require("../models/post.model").Post;
const Comment = require("../models/comment.model").Comment;
const Friends = require("../models/friends.model").Friends;

exports.profilePage = async (req, res, next) => {
  try {
    // const users = await User.findAll({
    // 	include: {
    // 		model: Post,
    // 		as: 'posts'
    // 	},
    // 	where: {
    // 		user_id: '?' //ovde zameniti '?'
    // 	}
    // });

    // //zameniti '1'
    // const userName = await users.find(user => user.id === 1).user_name;
    // const profilePhoto = await users.find(user => user.id === 1).img_url;
    // const email = await users.find(user => user.id === 1).email;
    // //po isto principu se prave
    // //const user
    // //const currentUser

    let allFriends = [];

    const friends = await User.findOne({
      where: {
        user_id: "5c6012e0-accf-11eb-9c27-79885056e1ca",
      },
      include: [
        {
          model: User,
          as: "friends",
          attributes: ["user_id", "user_name", "img_url", "email"],
        },
      ],
    });

    const userFriends = await User.findOne({
      where: {
        user_id: "5c6012e0-accf-11eb-9c27-79885056e1ca",
      },
      include: [
        {
          model: User,
          as: "userFriends",
          attributes: ["user_id", "user_name", "img_url", "email"],
        },
      ],
    });

    allFriends = [
      ...allFriends,
      ...friends.friends,
      ...userFriends.userFriends,
    ];
    const friendUserName = allFriends.map((friend) => friend.user_name);
    const friendEmail = allFriends.map((friend) => friend.email);
    const friendPhoto = allFriends.map((friend) => friend.img_url);

    const reqStatus = await Friends.findAll({
      where: {
        [Op.and]: [{ user_id: "?" }, { friend_id: "?" }], //ovde ce ici req.session.user_id i body ili params user_id
      },
    });

    res.send(allFriends);
  } catch (err) {
    next(err);
  }
};


