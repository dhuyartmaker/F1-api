import FastestLapsModel from "../fastest-lap.model";

interface IQuery {
    raceId?: string;
}

class FastestLapRepo {
    async getAll({
        query,
        select = ["position", "laps", "timeOfDay", "time", "avgSpeed"],
        sortBy = { position: 1 }
    } : {
        query: IQuery,
        select?: Array<string>,
        sortBy?: Record<string, any>
    }) {
        console.log("==query==", query)
        return await FastestLapsModel.find(query)
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

export default new FastestLapRepo()