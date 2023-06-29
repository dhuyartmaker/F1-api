import QualifyingModel from "../qualifying.model";

interface IQuery {
    raceId?: string;
}

class QualifyingRepo {
    async getAll({
        query,
        select = ["q3", "q2", "q1", "no", "position", "laps", "raceId"],
        sortBy = { position: 1 }
    } : {
        query: IQuery,
        select?: Array<string>,
        sortBy?: Record<string, any>
    }) {
        console.log("==query==", query)
        return await QualifyingModel.find(query)
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

export default new QualifyingRepo()