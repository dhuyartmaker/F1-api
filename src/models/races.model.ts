import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const raceSchema = new mongoose.Schema({
    year: { type: Number },
    type: { type: String },
    country: { type: String },
    driverWinnerId: { type: mongoose.Types.ObjectId },
    laps: { type: Number },
    time: { type: Date }
}, {
    timestamps: true
});

raceSchema.index({ year: 1, type: 1, country: 1 })

//Export the model
const RaceModel = mongoose.model('Race', raceSchema);
export default RaceModel;