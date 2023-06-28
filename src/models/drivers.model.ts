import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const driverSchema = new mongoose.Schema({
    name: { type: String },
    teamId: { type: mongoose.Types.ObjectId, ref: 'Team' },
    nationality: { type: String }
}, {
    timestamps: true
});

//Export the model
const DriverModel = mongoose.model('Driver', driverSchema);
export default DriverModel;