import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const practiceModel = new mongoose.Schema({
    raceId: { type: mongoose.Types.ObjectId, ref: 'Races' },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver' },
    resultId: { type:  mongoose.Types.ObjectId, ref: 'Result' },
    practiceTime: { type: Number, enum: [1,2,3], default: 1 },
    time: { type: Number },
    gap: { type: String },
    laps: { type: Number },
    position: { type: Number },
}, {
    timestamps: true
});

//Export the model
const PractiveModel = mongoose.model('Practice', practiceModel);
export default PractiveModel;