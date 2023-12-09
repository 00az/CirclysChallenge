const Movie = require("../models/movie.model");
const Slot = require("../models/slot.model");
const mongoose = require("mongoose");

exports.getAllMovies = async (_, res) => {
  try {
    const movies = await Movie.aggregate([
      {
        "$lookup": {
          "from": "slots",
          "localField": "_id",
          "foreignField": "movieId",
          "as": "slots",
          "pipeline": [
            {
              "$project": {
                "__v": 0,
                "movieId": 0,
              },
            },
          ],
        },
      },
      {
        "$project": {
          "__v": 0,
        },
      },
    ]);
    return res.status(200).send({ code: 200, msg: "success", movies });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ code: 40000, msg: "Service exception, please contact admin" });
  }
};

exports.checkMovie = async (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;
  try {
    const { movieId, slotId } = req.query;

    const slot = await Slot.findOne({
      _id: ObjectId(slotId),
      movieId: ObjectId(movieId),
    });

    // Return capacity information
    if (slot) {
      return res.status(200).send({
        code: 200,
        msg: "success",
        capacity: slot.capacity,
        available: slot.capacity !== 0,
      });
    } else {
      return res.status(400).send({ code: 40003, msg: "Invalid movie or slot ID" });
    }
  } catch (error) {
    if (error.name === "BSONTypeError") {
      return res.status(400).send({ code: 40001, msg: "Parameter type error" });
    } else {
      console.error(error);
      return res.status(400).send({ code: 40000, msg: "Service exception, please contact admin" });
    }
  }
};