import mongoose from "mongoose";
import "./drivers.model";

// Declare the Schema of the Mongo model
const raceSchema = new mongoose.Schema({
    year: { type: Number },
    country: { type: String },
    driverWinnerId: { type: mongoose.Types.ObjectId, ref: "Driver" },
    laps: { type: Number },
    time: { type: Date }
}, {
    timestamps: true
});

raceSchema.index({ year: 1, country: 1 })

//Export the model
const RaceModel = mongoose.model('Race', raceSchema);
export default RaceModel;