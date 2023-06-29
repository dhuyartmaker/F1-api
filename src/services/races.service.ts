import RaceModel from "../models/races.model";

interface IPayloadGetAll {
    query?: {
        year?: number;
    },
    select?: any;
    sortBy?: any;
    isPopulate?: boolean;
}

class RacesService {
    async getAll(payload: IPayloadGetAll) {
        const { query = {},
            select = {
                year: 1,
                driverWinnerId: 1,
                laps: 1,
                time: 1,
                country: 1,
            },
            sortBy = { time: 1 },
            isPopulate = false } = payload;
        const execQuery = RaceModel.find({
            ...query
        })
        .select(select)
        .sort(sortBy)
        return isPopulate ?
            await execQuery.populate({
                path: "driverWinnerId",
                select: "name",
                populate: {
                    path: "teamId",
                    select: "name"
                }
            }).lean() :
            await execQuery.lean()
    }
}

export default new RacesService();