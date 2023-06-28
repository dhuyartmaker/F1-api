import TeamModel from "../models/teams.model";

interface TeamPayload {
    name: string;
}

class TeamService {
    async upsertByName(payload: TeamPayload) {
        return await TeamModel.findOneAndUpdate({ name: payload.name }, { ...payload }, { new: true, upsert: true });
    }
}

export default new TeamService();