const movieController = require("../controllers/movie.controller");
const { verifyToken } = require("../middlewares/authJWT");
const {
  validateRequestQuery
}= require("../middlewares/validateRequestQuery")

module.exports = function (app) {
  app.get("/api/v1/movies", [verifyToken], movieController.getAllMovies);
  app.get("/api/v1/check", [verifyToken,validateRequestQuery], movieController.checkMovie);
};