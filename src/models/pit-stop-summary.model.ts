import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const pitStopSummaryModel = new mongoose.Schema({
    raceId: { type: mongoose.Types.ObjectId, ref: 'Races' },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver' },
    // resultId: { type:  mongoose.Types.ObjectId, ref: 'Result' },
    lap: { type: Number },
    stops: { type: Number },
    timeOfDay: { type: Date },
    time: { type: mongoose.Types.Decimal128 },
    total: { type: Number },
}, {
    timestamps: true
});

//Export the model
const PitStopSummaryModel = mongoose.model('PitStopSummary', pitStopSummaryModel);
export default PitStopSummaryModel;