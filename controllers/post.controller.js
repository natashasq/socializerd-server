const { Sequelize } = require("sequelize");

const User = require("../models/user.model").User;
const Post = require("../models/post.model").Post;
const Comment = require("../models/comment.model").Comment;

exports.create = async (req, res, next) => {
  try {
    const post = await Post.create({
      post_user_id: req.user_id,
      post_content: req.body.data.content,
    });

    const postObject = post.get({ plain: true });

    const user = await User.findByPk(req.user_id);

    res.status(200).send({
      ...postObject,
      post_user_name: user.user_name,
      post_img_url: user.img_url,
    });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    Post.belongsTo(User, {
      foreignKey: "post_user_id",
    });

    const posts = await Post.findAll({
      raw: true,
      subQuery: false,
      attributes: [
        "post_id",
        "post_content",
        "updatedAt",
        [Sequelize.col("User.user_id"), "post_user_id"],
        [Sequelize.col("User.user_name"), "post_user_name"],
        [Sequelize.col("User.img_url"), "post_img_url"],
      ],
      order: [["updatedAt", "DESC"]],
      include: {
        required: true,
        attributes: [],
        model: User,
      },
    });

    res.status(200).send(posts);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        post_id: req.body.post_id,
      },
    });
    res.status(200).send("The post is successfully deleted.");
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    await Post.update(
      {
        post_content: req.body.data.post_content,
      },
      {
        where: {
          post_id: req.body.data.post_id,
        },
      }
    );

    const newPost = await Post.findByPk(req.body.data.post_id, {
      raw: true,
      attributes: ["post_id", "post_content", "updatedAt", "post_user_id"],
    });

    //pokusaj
    const user = await User.findByPk(req.user_id);
    res.status(200).send({
      ...newPost,
      post_user_name: user.user_name,
      post_img_url: user.img_url,
    });

    //res.status(200).send({ newPost });

  
  } catch (err) {
    next(err);
  }
};
