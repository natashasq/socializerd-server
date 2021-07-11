const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
//const csurf = require('csurf');
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const helmet = require("helmet");
const sequelize = require("./config/db");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");

//const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

const server = http.createServer(app);

//csrf
// const csrfMiddleware = csurf({
//   cookie: true
// });

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

const run = async () => {};
sequelize.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
  run();
});

app.use(cors(corsOptions));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "super secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(cookieParser());
//app.use(csrfMiddleware);
app.use(flash());
app.use(helmet());

// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

const postRoutes = require("./routes/post.route");
const authRoutes = require("./routes/auth.route");
const friendsRoute = require("./routes/friends.route");
const messagesRoute = require("./routes/message.route");
const commentsRoute = require("./routes/comments.route");
const profileRoute = require("./routes/profile.route");
const userRoute = require("./routes/user.route");


app.use(profileRoute);
app.use(postRoutes);
app.use(authRoutes);
app.use(friendsRoute);
app.use(messagesRoute);
app.use(commentsRoute);
app.use(userRoute);


//socket.io
const io = (path) =>
  require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
    path,
  });

const inboxIo = io("/inbox");
const { messagesSocket } = require("./controllers/message.controller");

messagesSocket(inboxIo);




app.use((req, res, next) => {
  res.send("Route not found!");
});

//app.use(errorHandler);

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
