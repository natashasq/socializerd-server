const { Sequelize } = require("sequelize");

const User = require("../models/user.model").User;
const Post = require("../models/post.model").Post;
const Comment = require("../models/comment.model").Comment;

exports.home = async (req, res, next) => {
  try {
    Post.belongsTo(User, {
      foreignKey: "user_id",
    });

    Comment.belongsTo(User, {
      foreignKey: "user_id",
    });

    Comment.belongsTo(Post, {
      foreignKey: "post_id",
    });

    const comments = await Comment.findAll({
      raw: true,
      attributes: ["comment_id", "comment_content", "createdAt"],
      include: {
        required: true,
        attributes: [
          "user_name",
          "img_url",
          [Sequelize.col("user_id"), "user_id"],
        ],
        model: User,
      },
      where: {
        post_id: req.body.post_id,
      },
    });

    res.send(comments);
  } catch (err) {
    next(err);
  }
};
