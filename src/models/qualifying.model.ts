import mongoose from "mongoose";
import "./drivers.model"
import "./races.model"
import "./results.model"

// Declare the Schema of the Mongo model
const qualifyingSchema = new mongoose.Schema({
    raceId: { type: mongoose.Types.ObjectId, ref: 'Race' },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver' },
    q1: { type: Number },
    q2: { type: Number },
    q3: { type: Number },
    laps: { type: Number },
    position: { type: Number },
}, {
    timestamps: true
});

qualifyingSchema.index({ raceId: 1 })
qualifyingSchema.index({ driverId: 1 })

//Export the model
const QualifyingModel = mongoose.model('Qualifying', qualifyingSchema);
export default QualifyingModel;