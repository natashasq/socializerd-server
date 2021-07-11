const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");

const { User } = require("../models/user.model");
const { Friends } = require("../models/friends.model");
const { Message } = require("../models/message.model");
const sequelize = require("../config/db").sequelize;

exports.friends = async (req, res, next) => {
  try {
    let allFriends = [];

    const friends = await User.findOne({
      subQuery: false,
      where: {
        user_id: req.user_id,
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
      subQuery: false,
      where: {
        user_id: req.user_id,
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

    res.status(200).send(allFriends);
  } catch (err) {
    next(err);
  }
};

exports.addFriend = async (req, res, next) => {
  try {
    const sentRequest = await Friends.findAll({
      where: {
        [Op.and]: [
          {
            status: { [Op.is]: null },
          },
          {
            [Op.or]: [
              {
                [Op.and]: [
                  { user_id: req.user_id },
                  { friend_id: req.body.data?.friend_id },
                ],
              },
              {
                [Op.and]: [
                  { user_id: req.body.data?.friend_id },
                  { friend_id: req.user_id },
                ],
              },
            ],
          },
        ],
      },
    });

    if (sentRequest.length) {
      res.status(301).send("There is pending request!");
    }

    await Friends.create({
      user_id: req.user_id, //ili req.paramas.user_id
      friend_id: req.body.data?.friend_id, //req.session.user_id, OVO TREBA
    });

    const newFriend = await User.findByPk(req.body.data?.friend_id, {
      nested: true,
      attributes: ["user_id", "user_name", "img_url"],
      include: {
        model: Friends,
        where: {
          friend_id: req.user_id,
        },
      },
    });

    const updatedStatus = await Friends.findOne({
      raw:true,
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { user_id: req.user_id },
              { friend_id: req.query?.friend_id },
            ],
          },
          {
            [Op.and]: [
              { user_id: req.query?.friend_id },
              { friend_id: req.user_id },
            ],
          },
        ],
      },
      attributes: ["user_id", "friend_id", "status"]
    });

    return res.status(200).send(updatedStatus);

  } catch (err) {
    next(err);
  }
};

exports.requestAction = async (req, res, next) => {
  try {
    if (req.body.data?.action === "accept") {
     await Friends.update(
        { status: "accept" },
        {
          where: {
            [Op.or]: [
              {
                [Op.and]: [
                  { user_id: req.user_id },
                  { friend_id: req.body.data?.friend_id },
                ],
              },
              {
                [Op.and]: [
                  { user_id: req.body.data?.friend_id },
                  { friend_id: req.user_id },
                ],
              },
            ],
          },
        }
      );
      const updatedFriend = await User.findByPk(req.body.data?.friend_id, {
        nested: true,
        attributes: ["user_id", "user_name", "img_url"],
        include: {
          model: Friends,
          where: {
            friend_id: req.user_id,
          },
        },
      });

      return res.status(200).send(updatedFriend);
    }

    if (
      req.body.data?.action === "reject" ||
      req.body.data?.action === "cancel" ||
      req.body.data?.action === "unfriend"
    ) {
      await Friends.destroy({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { user_id: req.user_id },
                { friend_id: req.body.data?.friend_id },
              ],
            },
            {
              [Op.and]: [
                { user_id: req.body.data?.friend_id },
                { friend_id: req.user_id },
              ],
            },
          ],
        },
      });

      const updatedFriend = await User.findByPk(req.body.data?.friend_id, {
        raw: true,
        attributes: ["user_id"],
      });

      return res.status(200).send(updatedFriend);
    }
  } catch (err) {
    next(err);
  }
};


exports.friendStatus = async (req, res, next) => {
  try {
    const friendStatus = await Friends.findOne({
      raw:true,
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { user_id: req.user_id },
              { friend_id: req.query?.friend_id },
            ],
          },
          {
            [Op.and]: [
              { user_id: req.query?.friend_id },
              { friend_id: req.user_id },
            ],
          },
        ],
      },
      attributes: ["user_id", "friend_id", "status"]
    });

    res.status(200).send(friendStatus);
  } catch (err) {
    next(err);
  }
};

exports.statusUpdate = async (req, res, next) => {
  try{
    if (req.body.data?.action === "accept") {
      await Friends.update(
        { status: "accept" },
        {
          where: {
            [Op.or]: [
              {
                [Op.and]: [
                  { user_id: req.user_id },
                  { friend_id: req.body.data?.friend_id },
                ],
              },
              {
                [Op.and]: [
                  { user_id: req.body.data?.friend_id },
                  { friend_id: req.user_id },
                ],
              },
            ],
          },
        }
      );

      const updatedStatus = await Friends.findOne({
        raw:true,
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { user_id: req.user_id },
                { friend_id: req.body.data?.friend_id },
              ],
            },
            {
              [Op.and]: [
                { user_id: req.body.data?.friend_id },
                { friend_id: req.user_id },
              ],
            },
          ],
        },
        attributes: ["user_id", "friend_id", "status"]
      });

      return res.status(200).send(updatedStatus);
    }

    if (
      req.body.data?.action === "reject" ||
      req.body.data?.action === "cancel" ||
      req.body.data?.action === "unfriend"
    ) {
      await Friends.destroy({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { user_id: req.user_id },
                { friend_id: req.body.data?.friend_id },
              ],
            },
            {
              [Op.and]: [
                { user_id: req.body.data?.friend_id },
                { friend_id: req.user_id },
              ],
            },
          ],
        },
      });

      const updatedStatus = await Friends.findOne({
        raw:true,
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { user_id: req.user_id },
                { friend_id: req.body.data?.friend_id },
              ],
            },
            {
              [Op.and]: [
                { user_id: req.body.data?.friend_id },
                { friend_id: req.user_id },
              ],
            },
          ],
        },
        attributes: ["user_id", "friend_id", "status"]
      });

      return res.status(200).send(updatedStatus);
    }
  }
  catch(err) {
    next(err);
  }
}
