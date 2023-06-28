import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const teamSchema = new mongoose.Schema({
    name: { type: String }
}, {
    timestamps: true
});

//Export the model
const TeamModel = mongoose.model('Team', teamSchema);
export default TeamModel;