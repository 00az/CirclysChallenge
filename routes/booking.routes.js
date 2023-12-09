const { verifyToken } = require("../middlewares/authJWT");
const {
  validateRequestBody
} = require("../middlewares/validateRequestBody");
const bookingController = require("../controllers/booking.controller");

module.exports = function (app) {
  app.post(
    "/api/v1/booking",
    [verifyToken, validateRequestBody],
    bookingController.createReservation
  );
  
};
