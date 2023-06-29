import PractiveModel from "../practice.model";

interface IQuery {
    raceId?: string;
    practiceTime?: number;
}

class PracticeRepo {
    async getAll({
        query,
        select = ["practiceTime", "time", "gap", "laps", "position"],
        sortBy = { position: 1 }
    } : {
        query: IQuery,
        select?: Array<string>,
        sortBy?: Record<string, any>
    }) {
        return await PractiveModel.find(query)
            .sort(sortBy)
            .select(select.reduce((result, item) => ({ ...result, [item] : 1 }), {}))
            .populate({
                path: "driverId",
                select: "_id name teamId",
                populate: {
                    path: "teamId",
                    select: "_id name",
                }
            })
    }
}

export default new PracticeRepo()