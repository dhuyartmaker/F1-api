import PitStopSummaryModel from "../pit-stop-summary.model";

interface IQuery {
    raceId?: string;
}

class PitStopSummaryRepo {
    async getAll({
        query,
        select = ["lap", "time", "stops", "timeOfDay", "total"],
        sortBy = { lap: 1, stop: 1 }
    } : {
        query: IQuery,
        select?: Array<string>,
        sortBy?: Record<string, any>
    }) {
        return await PitStopSummaryModel.find(query)
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

export default new PitStopSummaryRepo()