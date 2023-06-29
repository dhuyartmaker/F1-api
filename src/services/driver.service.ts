import DriverModel from "../models/drivers.model";
import ResultModel from "../models/results.model";

interface DriverPayload {
    name: string;
    nationality: string;
}

interface IPayloadGetAll {
    year?: number;
    select?: any;
}

interface IPayloadGetList extends IPayloadGetAll {
    limit?: number;
    page?: number;
}

class DriverService {
    async getAll(params: IPayloadGetAll) {
        const { select = { "name": 1, "_id": 1, "nationality": 1, "teamId": 1 } } = params;
        return await DriverModel.find({
            ...params
        })
        .select(select)
        .populate({
            path: "teamId",
            select: 'name _id',
        })
        .lean()
        .exec()
    }

    async getList(params: IPayloadGetList) {
        const { page = 1, limit = 10, select = { "name": 1, "_id": 1, "nationality": 1, "teamId": 1 } } = params;
        return await DriverModel.find({
            ...params
        })
        .select(select)
        .populate("teamId", 'name -_id')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec()
    }

    async getAllByYear(params: IPayloadGetAll) {
        console.log("==params==", params)
        const result = await ResultModel.aggregate([
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
                                year: 1
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
                $match: {
                    "races.year": Number(params.year)
                }
            },
            {
                $lookup: {
                    "from": 'drivers',
                    "as": "driver",
                    "let": { driverId: "$driverId" },
                    "pipeline": [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$driverId"]}
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                nationality: 1,
                            }
                        },
                        {
                            $lookup: {
                                "from": 'teams',
                                "as": "team",
                                "let": { driverId: "$driverId" },
                                "pipeline": [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$driverId"]}
                                        }
                                    },
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $unwind: {
                    path: '$driver',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                }
            }
        ])

        return result;
    }

    async upsertByName(payload: DriverPayload) {
        return await DriverModel.findOneAndUpdate({ name: payload.name }, { ...payload }, { new: true, upsert: true });
    }
}

export default new DriverService();