const Movie = require("../models/movie.model");
const Slot = require("../models/slot.model");
const mongoose = require("mongoose");

validateRequestBody = async (req, res, next) => {
  const ObjectId = mongoose.Types.ObjectId;
  const {movieId, slotId, seats} = req.body;
  if (!movieId || !slotId || !seats) {
    return res.status(400).send({ code: 40002, msg: "Missing required fields" });
  }
  const rex = /^[0-9a-fA-F]{24}$/;
  if (!rex.test(movieId) || !rex.test(slotId)) {
    return res.status(400).send({ code: 40001, msg: "IDs are incorrect" });
  }
  const [savedMovie, savedSlot] = await Promise.all([
    Movie.findOne({ _id: ObjectId(movieId) }),
    Slot.findOne({ _id: ObjectId(slotId) }),
  ]);

  if (!savedMovie) {
    return res.status(400).send({ code: 40003,
      msg: "Movie ID is incorrect"});
  }
  if (!savedSlot) {
    return res.status(400).send({ code: 40003,
      msg: "Slot ID is incorrect"});
  }

  next();
};

module.exports = {
  validateRequestBody,
};
