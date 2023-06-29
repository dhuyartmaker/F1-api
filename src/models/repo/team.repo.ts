import TeamModel from "../teams.model";

class TeamRepo {
    async getAll({
        query,
        select = ["name"],
        sortBy = { createdAt: 1 }
    } : {
        query: Record<string, any>,
        select?: Array<string>,
        sortBy?: Record<string, any>
    }) {
        return await TeamModel.find(query)
            .sort(sortBy)
            .select(select.reduce((result, item) => ({ ...result, [item] : 1 }), {}))
            .lean()
    }
}

export default new TeamRepo()