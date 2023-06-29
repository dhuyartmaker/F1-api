import ResultModel from "../models/results.model"
import racesService from "./races.service";
import errorResponse from "../core/error.response";
import _ from "lodash";

interface IQuery {
    year?: number;
    country?: string;
}

class RaceResultService {
    async getResultByYear({ year, select = [] } : { year: number, select?: Array<string> }) {
        const getAllRaces = await racesService.getAll({ query: { year }, select: { _id: 1 }})

        const objGroup = select.reduce((result, item) => ({
            ...result,
            [item]: `$${item}`
        }), {})
        const getAllRacesResult = await ResultModel.aggregate([
            {
                $match: {
                    raceId: { $in: getAllRaces.map(race => race._id) }
                }
            },
            {
                $group: {
                    _id: "$driverId",
                    total: {
                        $sum: "$pts"
                    },
                    ...objGroup
                }
            }
        ])
        
        return getAllRacesResult.reduce((result, item: any) => ({
            ...result,
            [`${item._id}`]: item.total
        }), {});
    }

    async getResultDriverEachRaceByYear({
            query,
            select = ["timeRetired", "position", "laps", "no", "pts"],
            sortBy = { pts: -1, laps: -1 }
        } : {
            query: IQuery,
            select?: Array<string>,
            sortBy?: Record<string, number>
        }) {
        const getAllRaces = await racesService.getAll({ query, select: { _id: 1 }})
        if (getAllRaces.length === 0) throw new errorResponse.NotFoundError()
        const parseSelect = select.reduce((result, item) => ({
            ...result,
            [item]: 1
        }), {})
        const getAllRacesResult = await ResultModel.find(
            {
                raceId: { $in: getAllRaces.map(race => race._id) }
            },
        ).select(parseSelect)
        .populate({
            path: "driverId",
            select: "_id name teamId",
            populate: {
                path: "teamId",
                select: "_id name",
            }
        })
        .sort(sortBy)
        
        return getAllRacesResult;
    }

    async getResultByDriverId({ year, driverId } : { year: number, driverId: string }) {
        const getAllRaces = await racesService.getAll({ query: { year }, select: { _id: 1, country: 1, time: 1 }})

        const parseObjectAllRaces : Record<string, any> = getAllRaces.reduce((result, item) => ({
            ...result,
            [`${item._id}`]: {
                country: item.country,
                time: item.time
            }
        }), {})

        const getAllRacesResult = await ResultModel.find({
            raceId: { $in: Object.keys(parseObjectAllRaces) },
            driverId,
        }).populate({
            path: "driverId",
            select: "_id name teamId",
            populate: {
                path: "teamId",
                select: "_id name",
            }
        })
        .select("_id raceId drvierId position pts")
        .lean()

        const parseObject : Record<string, any> = getAllRacesResult.reduce((result, item) => ({
            ...result,
            [`${item.raceId}`]: {
                ...item
            }
        }), {})

        return getAllRaces.reduce((result: Array<any>, item: any) => {
            if (parseObject[`${item._id}`]) {
                result.push({...item, ...parseObject[`${item._id}`] })
                return result;
            }
            return result;
        }, [])
    }
}

export default new RaceResultService()