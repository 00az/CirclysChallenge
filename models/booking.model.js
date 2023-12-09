const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  movieId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Movie",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  slotId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  seats:{
    type: Number,
    required: true,
  },
  noReserve:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
});

module.exports = model("Booking", bookingSchema);
