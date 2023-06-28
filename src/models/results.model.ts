import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const resultSchema = new mongoose.Schema({
    raceId: { type: mongoose.Types.ObjectId, ref: 'Races' },
    driverId: { type: mongoose.Types.ObjectId, ref: 'Driver' },
    pts: { type: Number },
    timeRetired: { 
        time: { type: Number },
        other: { type: String },
        lapRemaining: { type: Number },
    },
    teamId: { type: mongoose.Types.ObjectId, ref: 'Team' },
    no: { type: Number },
    position: { type: Number },
    laps: { type: Number },
    races: { type: String },
    qualifying: { type: mongoose.Schema.Types.Mixed },
}, {
    timestamps: true
});

const qualifySchema = new mongoose.Schema({
    q1: { type: Number },
    q2: { type: Number },
    q3: { type: Number },
    laps: { type: Number } 
}, {
    timestamps: false,
    id: false,
    versionKey: false
})

//Export the model
const ResultModel = mongoose.model('Result', resultSchema);
export default ResultModel;