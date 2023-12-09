const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const slotSchema = new Schema({
    movieId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Movie"
    },
    time: {
        type: Date,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    }

});


module.exports = model("Slot", slotSchema);