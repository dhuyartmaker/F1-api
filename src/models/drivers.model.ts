import mongoose from "mongoose";
import "./teams.model";
// Declare the Schema of the Mongo model
const driverSchema = new mongoose.Schema({
    name: { type: String },
    teamId: { type: mongoose.Types.ObjectId, required: true, ref: 'Teams' },
    nationality: { type: String }
}, {
    timestamps: true
});
driverSchema.index({ teamId: 1 })
//Export the model
const DriverModel = mongoose.model('Driver', driverSchema);
export default DriverModel;