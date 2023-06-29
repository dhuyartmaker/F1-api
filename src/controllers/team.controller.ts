import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import SuccessResponse from "../core/success.response";
import driverService from "../services/driver.service";
import racesResultService from "../services/races-result.service";
import _ from "lodash";
import qualifyingRepo from "../models/repo/qualifying.repo";
import errorResponse from "../core/error.response";
import RaceModel from "../models/races.model";
import teamsService from "../services/teams.service";

class TeamController {
    getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query;
        const result = query.name
        ? await teamsService.getMemberTeam(query)
        : await teamsService.getAllAndCalcTotal(query);

        return new SuccessResponse.OkResponseMessage({
            message: "Ok",
            status: 200,
            metadata: result
        }).send(res)
    })
}

export default new TeamController()