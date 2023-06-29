import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import SuccessResponse from "../core/success.response";
import driverService from "../services/driver.service";
import racesResultService from "../services/races-result.service";
import _ from "lodash";
import qualifyingRepo from "../models/repo/qualifying.repo";
import errorResponse from "../core/error.response";
import RaceModel from "../models/races.model";
import pitstopRepo from "../models/repo/pitstop.repo";

class PitStopController {
    getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const query : any = req.query;
        if (!query.year || !query.country) throw new errorResponse.BadRequestError()
        const findRace = await RaceModel.findOne(query);
        if (!findRace) throw new errorResponse.NotFoundError("Not found Race")
        const result = await pitstopRepo.getAll({ query: { raceId: `${findRace._id}` } });

        return new SuccessResponse.OkResponseMessage({
            message: "Ok",
            status: 200,
            metadata: result
        }).send(res)
    })
}

export default new PitStopController()