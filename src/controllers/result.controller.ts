import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import SuccessResponse from "../core/success.response";
import driverService from "../services/driver.service";
import racesResultService from "../services/races-result.service";
import _ from "lodash";
import racesService from "../services/races.service";

class ResultController {
    getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const query : any = req.query;

        if (!query.country) {
            return new SuccessResponse.OkResponseMessage({
                message: "Ok",
                status: 200,
                metadata: await racesService.getAll({
                    query,
                    isPopulate: true
                })
            }).send(res)
        }

        const getResultByYear = await racesResultService.getResultDriverEachRaceByYear({
            query: {
                year: query.year,
                country: query.country,
            },
        })
        return new SuccessResponse.OkResponseMessage({
            message: "Ok",
            status: 200,
            metadata: getResultByYear
        }).send(res)
    })

    getStartingGrid = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const query : any = req.query;

        const getResultByYear = await racesResultService.getResultDriverEachRaceByYear({
            query: {
                year: query.year,
                country: query.country,
            },
            select: ["qualifying", "timeRetired", "position", "laps", "no", "pts"],
        })
        return new SuccessResponse.OkResponseMessage({
            message: "Ok",
            status: 200,
            metadata: getResultByYear
        }).send(res)
    })
}

export default new ResultController()