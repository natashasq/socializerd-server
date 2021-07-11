const { Op } = require("sequelize");
const sequelize = require("../config/db").sequelize;

const { Message } = require("../models/message.model");
const { User } = require("../models/user.model");

exports.messagesSocket = (io) => {
  const socketIds = {};
  const NEW_MESSAGE = "newMessage";

  io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED");
    const { roomId, userId } = socket.handshake.query || {};

    socketIds[userId] = socket.id;

    socket.join(roomId);

    socket.on(NEW_MESSAGE, async ({ body }) => {
      const { content, friend_id, user_id } = JSON.parse(body);
      console.log(content);
      try {
        const newMessage = await Message.create({
          user_id,
          friend_id,
          content,
        });

        const newMessageObject = newMessage.get({ plain: true });

        const newMessageData = await Message.findByPk(
          newMessageObject.message_id,
          {
            include: [
              {
                model: User,
                as: "userData",
                attributes: ["user_id", "user_name", "img_url"],
              },
              {
                model: User,
                as: "friendData",
                attributes: ["user_id", "user_name", "img_url"],
              },
            ],
            subQuery: false,
          }
        );

        io.in(roomId).emit(NEW_MESSAGE, newMessageData);
      } catch (err) {
        io.in(roomId).emit("error", { message: err.message });
      }
    });

    // socket.on(TYPING, ({ body }) => {
    //   const { isTyping, contactId } = JSON.parse(body);

    //   io.to(socketIds[contactId]).emit(TYPING, isTyping);
    // });

    socket.on("disconnect", () => {
      socket.leave(roomId);
    });
  });
};

exports.messagesCount = async (req, res, next) => {
  try {
    const messagesWithFriend = await Message.findAll({
      attributes: [
        "user_id",
        [sequelize.fn("COUNT", sequelize.col("is_read")), "count"],
      ],
      where: {
        [Op.and]: [{ friend_id: req.user_id }, { is_read: 0 }],
      },
      group: "user_id",
      raw: true,
    });

    console.log(messagesWithFriend);
    res.status(200).send(messagesWithFriend);
  } catch (err) {
    next(err);
  }
};

exports.messagesCountTotal = async (req, res, next) => {
  try {
    const messagesCountTotal = await Message.findAll({
      attributes: [[sequelize.fn("COUNT", sequelize.col("is_read")), "count"]],
      where: {
        [Op.and]: [{ friend_id: req.user_id }, { is_read: 0 }],
      },
      raw: true,
    });

    console.log(messagesCountTotal);
    res.status(200).send(messagesCountTotal);
  } catch (err) {
    next(err);
  }
};

exports.sendMesssage = async (req, res, next) => {
  try {
    const user_id = await User.findByPk(req.body.user_id); //ovde ide nesto??
    if (!user_id) {
      res.send("User not found");
    }

    if (!req.body.content) {
      res.send("Content cannot be empty.");
    }

    const newMessage = await Message.create({
      friend_id: req.body.friend_id,
      content: req.body.content,
      user_id: req.body.user_id,
    });

    res.send(newMessage);
  } catch (err) {
    next(err);
  }
};

exports.isRead = async (req, res, next) => {
  console.log(req.body.data?.friend_id);
  try {
    const updateMessageInfo = await Message.update(
      { is_read: 1 },
      {
        raw: true,
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

    // console.log(updateMessageInfo, "UPDATED MESSAGES");
    // const messages = await Message.findAll({
    //   subQuery: false,
    //   where: {
    //     [Op.or]: [
    //       {
    //         [Op.and]: [
    //           { user_id: req.user_id },
    //           { friend_id: req.body.data?.friend_id },
    //         ],
    //       },
    //       {
    //         [Op.and]: [
    //           { user_id: req.body.data?.friend_id },
    //           { friend_id: req.user_id },
    //         ],
    //       },
    //     ],
    //   },
    //   include: [
    //     {
    //       model: User,
    //       as: "userData",
    //       attributes: ["user_id", "user_name", "img_url"],
    //     },
    //     {
    //       model: User,
    //       as: "friendData",
    //       attributes: ["user_id", "user_name", "img_url"],
    //     },
    //   ],
    //   order: [["updatedAt"]],
    // });

    res.status(200).send("messages updated");
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      subQuery: false,
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { user_id: req.user_id },
              { friend_id: req.query.friend_id },
            ],
          },
          {
            [Op.and]: [
              { user_id: req.query.friend_id },
              { friend_id: req.user_id },
            ],
          },
        ],
      },
      include: [
        {
          model: User,
          as: "userData",
          attributes: ["user_id", "user_name", "img_url"],
        },
        {
          model: User,
          as: "friendData",
          attributes: ["user_id", "user_name", "img_url"],
        },
      ],
      order: [["updatedAt"]],
    });

    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
