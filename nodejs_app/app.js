require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./app/config/db");
const views = require("views");
const ejs = require("ejs");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');
const SwaggerOptions = require('./swagger.json');
const swaggerDocument = swaggerJsDoc(SwaggerOptions);

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "helloapp",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }),
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const api = require("./app/routes");
app.use(api);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 3001;
app.listen(port, () => {
  console.log(`server is running on port --> http://localhost:${port}`);
});
