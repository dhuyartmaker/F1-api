import StartingGridModel from "../starting-grid.model";

interface IQuery {
    raceId?: string;
}

class StartingGridRepo {
    async getAll({
        query,
        select = ["time", "position"],
        sortBy = { position: 1 }
    } : {
        query: IQuery,
        select?: Array<string>,
        sortBy?: Record<string, any>
    }) {
        return await StartingGridModel.find(query)
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

export default new StartingGridRepo()