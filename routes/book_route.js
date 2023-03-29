const route = require("express").Router();
const controller = require("../controllers/book_controller");

route.get("/", [controller.get]);

module.exports = route;
