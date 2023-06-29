import mongoose from "mongoose";
import "./drivers.model"
import "./races.model"
import "./results.model"

// Declare the Schema of the Mongo model
const fastestLapSchema = new mongoose.Schema({
    raceId: { type: mongoose.Types.ObjectId, ref: 'Races' },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver' },
    resultId: { type:  mongoose.Types.ObjectId, ref: 'Result' },
    position: { type: Number },
    lap: { type: Number },
    timeOfDay: { type: Date },
    time: { type: mongoose.Types.Decimal128 },
    avgSpeed: { type: Number }
}, {
    timestamps: true
});

//Export the model
const FastestLapModel = mongoose.model('FastestLap', fastestLapSchema);
export default FastestLapModel;