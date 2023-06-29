import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import SuccessResponse from "../core/success.response";
import driverService from "../services/driver.service";
import racesResultService from "../services/races-result.service";
import _ from "lodash";

class DriverController {
    getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const query : any = req.query;
        let getDriverByYear : any = {};

        if (query.year) {
            getDriverByYear = await racesResultService.getResultByYear({ year: query.year })
            query["_id"] = { $in: Object.keys(getDriverByYear).map(race => race)}
            delete query.year;
        }
        const result = await driverService.getAll(query);
        return new SuccessResponse.OkResponseMessage({
            message: "Ok",
            status: 200,
            metadata: result.map(item => ({
                ...item,
                total: getDriverByYear[`${item._id}`]
            }))
        }).send(res)
    })

    getDetailDriverByYear = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const query : any = req.query;
        let getDriverByYear : any = {};

        if (query.year) {
            getDriverByYear = await racesResultService.getResultByDriverId({
                year: query.year,
                driverId: query.driverId
            })
            query["_id"] = { $in: Object.keys(getDriverByYear).map(race => race)}
            delete query.year;
        }

        return new SuccessResponse.OkResponseMessage({
            message: "Ok",
            status: 200,
            metadata: getDriverByYear
        }).send(res)
    })
}

export default new DriverController()