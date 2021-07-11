const { Sequelize } = require("sequelize");

const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const { Comment } = require("../models/comment.model");

exports.create = async (req, res, next) => {
  try {
    if (!req.body.data.comment_content) {
      return res.status(301).send("The comment content can not be empty")
    }
    const comment = await Comment.create({
      user_id: req.user_id,
      post_id: req.body.data.post_id,
      comment_content: req.body.data.comment_content,
    });

    const commentObject = comment.get({ plain: true });

    const user = await User.findByPk(req.user_id);

    return res.status(200).send({
      ...commentObject,
      comment_user_name: user.user_name,
      comment_img_url: user.img_url,
    });

  } catch (err) {
    next(err);
  }
};

Comment.belongsTo(User, {
  foreignKey: "user_id",
});

Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      raw: true,
      attributes: [
        "comment_id",
        "comment_content",
        "createdAt",
        [Sequelize.col("User.user_id"), "comment_user_id"],
        [Sequelize.col("User.user_name"), "comment_user_name"],
        [Sequelize.col("User.img_url"), "comment_img_url"],
      ],
      include: {
        required: true,
        attributes: [],
        model: User,
      },
      where: {
        post_id: req.query.post_id,
      },
    });

    return res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
};
