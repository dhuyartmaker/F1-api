import errorResponse from "../core/error.response";
import RaceModel from "../models/races.model";
import teamRepo from "../models/repo/team.repo";
import ResultModel from "../models/results.model";
import TeamModel from "../models/teams.model";

interface TeamPayload {
    name: string;
}

interface GetTeamPayload {
    year?: number;
    name?: string;
}

class TeamService {
    async upsertByName(payload: TeamPayload) {
        return await TeamModel.findOneAndUpdate({ name: payload.name }, { ...payload }, { new: true, upsert: true });
    }

    async getAllAndCalcTotal(payload: GetTeamPayload) {
        const { year, name } = payload;
        if (!year) throw new errorResponse.BadRequestError("Year is required!")
        const allRace = await RaceModel.find({ year: Number(year) })
        const allResult = await ResultModel.aggregate([
            { 
                $match:
                    { raceId: { $in: allRace.map(item => item._id )}}
            },
            {
                $group: {
                    _id: "$teamId",
                    total: {
                        $sum: "$pts"
                    },
                }
            },
            {
                "$sort": { total: -1 }
            }
        ])
        const findAllTeam = await teamRepo.getAll({ query: { _id: { $in: allResult.map(item => item._id )}}})
        const reduceTeams = findAllTeam.reduce((result: any, item: any) => ({ ...result, [`${item._id}`]: item }), {});
        return allResult.map((item) => ({
            ...item,
            ...reduceTeams[`${item._id}`]
        }))
    }

    async getMemberTeam(payload: GetTeamPayload) {
        const { year, name } = payload;
        if (!year) throw new errorResponse.BadRequestError("Year is required!")
        const findTeam = await TeamModel.findOne({ name });
        if (!findTeam) throw new errorResponse.NotFoundError("Not found Team!")

        const result = await ResultModel.aggregate([
            {
                $match: {
                    teamId: findTeam._id
                }
            },
            {
                $group: {
                    _id: "$raceId",
                    raceId: { $first: "$raceId" },
                    total: {
                        $sum: "$pts"
                    }
                }
            },
            {
                $lookup: {
                    "from": 'races',
                    "as": "races",
                    "let": { raceId: "$raceId" },
                    "pipeline": [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$raceId"]}
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                year: 1,
                                country: 1,
                                time: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: '$races',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    "races.time": 1
                }
            }
        ])

        return result
    }
}

export default new TeamService();