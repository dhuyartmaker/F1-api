import mongoose from "mongoose";
import "./drivers.model"
import "./races.model"
import "./results.model"

// Declare the Schema of the Mongo model
const startingGridSchema = new mongoose.Schema({
    raceId: { type: mongoose.Types.ObjectId, ref: 'Race' },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver' },
    resultId: { type:  mongoose.Types.ObjectId, ref: 'Result' },
    q1: { type: Number },
    q2: { type: Number },
    q3: { type: Number },
    laps: { type: Number },
}, {
    timestamps: true
});

startingGridSchema.index({ raceId: 1 })
startingGridSchema.index({ driverId: 1 })

//Export the model
const StartingGridModel = mongoose.model('StartingGrid', startingGridSchema);
export default StartingGridModel;