import DriverModel from "../src/models/drivers.model";
import FastestLapModel from "../src/models/fastest-lap.model";
import PitStopSummaryModel from "../src/models/pit-stop-summary.model";
import PractiveModel from "../src/models/practice.model";
import QualifyingModel from "../src/models/qualifying.model";
import RaceModel from "../src/models/races.model";
import ResultModel from "../src/models/results.model";
import StartingGridModel from "../src/models/starting-grid.model";
import TeamModel from "../src/models/teams.model";

import { HHmmssToNumber, asyncReader, calcAddTime, jsonReader } from "../src/utils/crawling";
import Database from "./connectDb";

async function main() {
    console.log("Deleting....")
    await Database.getInstance()

    await DriverModel.deleteMany({})
    await TeamModel.deleteMany({})
    await RaceModel.deleteMany({})
    await FastestLapModel.deleteMany({})
    await ResultModel.deleteMany({})
    await StartingGridModel.deleteMany({})
    await PractiveModel.deleteMany({})
    await QualifyingModel.deleteMany({})
    await PitStopSummaryModel.deleteMany({})
    process.exit()
}

main()