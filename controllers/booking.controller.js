const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const Slot = require("../models/slot.model");
const Movie = require("../models/movie.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");

exports.createReservation = async (req, res) => {
  try {
    const { movieId, slotId, seats } = req.body;
    const token = req.headers["x-access-token"];

    // Verify JWT token and get user ID
    const decoded = await jwt.verify(token, authConfig.secret);
    const userId = decoded.id;


    const [user, slot, movie] = await Promise.all([
      User.findOne({ userId }),
      Slot.findOne({ _id: slotId }),
      Movie.findOne({ _id: movieId }),
    ]);

    if (slot.capacity === 0 || slot.capacity < seats) {
      return res.status(200).send({ code: 200, msg: "Sorry, slots capacity is full" });
    }

    try {
      await Slot.findOneAndUpdate({ _id: slotId }, { $inc: { capacity: -seats } });

      // Generate reservation number and create booking
      const count = await Booking.countDocuments({});
      const noReserve = `#${count + 1}`;
      const id = user._id.toString();
      const map =
      { userId: id, movieId: movieId, slotId: slotId, seats: seats, noReserve:noReserve }
      await Booking.create(map);

      // Prepare reservation response
      const reservation = {
        time: slot.time,
        movie: movie.title,
        noReserve: noReserve,
        seats: seats,
      };

      return res.status(201).send({ code: 201, msg: "success", reservation });
    } catch (error) {
      return res.status(400).send({ code: 40000, msg: error.message || "Service exception, please contact admin" });
    }
  } catch (error) {
    return res.status(400).send({ code: 40000, msg: error.message || "Service exception, please contact admin" });
  }
};
