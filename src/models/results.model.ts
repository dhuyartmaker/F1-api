import mongoose from "mongoose";
import "./drivers.model"
import "./races.model"

// Declare the Schema of the Mongo model
const resultSchema = new mongoose.Schema({
    raceId: { type: mongoose.Types.ObjectId, ref: 'Race' },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver' },
    pts: { type: Number },
    timeRetired: { 
        time: { type: Number },
        other: { type: String },
        lapRemaining: { type: Number },
    },
    teamId: { type: mongoose.Types.ObjectId, ref: 'Teams' },
    no: { type: Number },
    position: { type: Number },
    laps: { type: Number },
    races: { type: String },
    qualifying: { type: mongoose.Schema.Types.Mixed },
}, {
    timestamps: true
});

resultSchema.index({ raceId: 1 })
resultSchema.index({ driverId: 1 })

const qualifySchema = new mongoose.Schema({
    q1: { type: Number },
    q2: { type: Number },
    q3: { type: Number },
    laps: { type: Number },
    timeStartingGrid: { type: Number },
}, {
    timestamps: false,
    id: false,
    versionKey: false
})

//Export the model
const ResultModel = mongoose.model('Result', resultSchema);
export default ResultModel;