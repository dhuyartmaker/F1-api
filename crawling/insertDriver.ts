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

const driversFile = "./crawling/data/drivers.json"
const racesFile = "./crawling/data/races.json"
const raceResult = "./crawling/data/race-result.json"
const qualifyResult = "./crawling/data/qualifying-result.json"
const startingGridResult = "./crawling/data/starting-grid-result.json"
const fastestResult = "./crawling/data/fastest-laps-result.json"
const pitStopResult = "./crawling/data/pit-stop-summary-result.json"
const practice1Result = "./crawling/data/practice-1-result.json"
const practice2Result = "./crawling/data/practice-2-result.json"
const practice3Result = "./crawling/data/practice-3-result.json"

const fromYear = 2020;
const endYear = 2023;

async function a() {
    await Database.getInstance()
    const raceResultList = await asyncReader(raceResult);
    const qualifyResultList = await asyncReader(qualifyResult);
    const startingGridResultList = await asyncReader(startingGridResult);
    const fastestResultList = await asyncReader(fastestResult);
    const pitStopResultList = await asyncReader(pitStopResult);
    const pracetice1List = await asyncReader(practice1Result);
    const pracetice2List = await asyncReader(practice2Result);
    const pracetice3List = await asyncReader(practice3Result);

    jsonReader(driversFile, async (error: any, data: any) => {
        const listDriver = data.filter((iDriver: any) => iDriver.year >= fromYear); // Filter >= 2020
        for (let iDriver = 0; iDriver < listDriver.length; iDriver += 1) {
            const driver = listDriver[iDriver]
            const upsertTeam = await TeamModel.findOneAndUpdate({ name: driver.team }, { name: driver.team }, { upsert: true, new: true })
            const upsertDriver = await DriverModel.findOneAndUpdate({ name: driver.driver }, { ...driver, name: driver.driver, teamId: upsertTeam._id }, { upsert: true })
        }

        jsonReader(racesFile, async (error: any, dataRace: any) => {
            const listRace = dataRace.filter((iDriver: any) => iDriver.year >= fromYear); // Filter >= 2020
            for (let iRace = 0; iRace < listRace.length; iRace += 1) {
                const race = listRace[iRace];
                const findWinner = await DriverModel.findOne({ name: race.winner });
                const createRace = await RaceModel.create({ ...race, driverWinnerId: findWinner?._id, country: race.grandprix, time: new Date(race.date) })
                // console.log("==createRace==", createRace)

                //  Race-result
                const filterByLink = (raceResultList as Array<any>).filter(li => li.link === race.link);
                const timeofWinnerPosition = HHmmssToNumber(filterByLink.find((rs : any) => rs.pos === '1').time);
                for (let iResult = 0; iResult < filterByLink.length; iResult += 1) {
                    const result = filterByLink[iResult];
                    const driverId = await DriverModel.findOne({ name: result.driver})
                    const teamId = await TeamModel.findOne({ name: result.car })

                    console.log("==result==", result)
                    const insertRaceResult = await ResultModel.create({
                        ...result,
                        driverId: driverId?._id,
                        teamId: teamId?._id,
                        raceId: createRace._id,
                        timeRetired: { 
                            time: !`${result.time}`.includes("lap") && !`${result.time}`.includes("DN") ? (result.pos !== "1" ? calcAddTime(timeofWinnerPosition, result.time) : timeofWinnerPosition) : 0,
                            other: result.time === "DNF" || result.time === "DNS" ? result.time : null,
                            lapRemaining: 
                                `${result.time}`.includes("lap") ?
                                Number(`${result.time}`.replace("laps", "").replace("lap", "").replace("+", "")) :
                                0,
                        },
                        position: result.pos === "NC" ? -1 :
                            result.pos === "DQ" ? 0 :
                            Number(result.pos)
                    })

                    filterByLink[iResult]._id = insertRaceResult._id;
                }

                // Qualifying
                const qualifyResult = (qualifyResultList as Array<any>).filter(li => li.link === race.link);
                for (let iFastest = 0; iFastest < qualifyResult.length; iFastest += 1) {
                    const fastestJson = qualifyResult[iFastest];
                    const findResultId = filterByLink.find(item => 
                        item.driver === fastestJson.driver &&
                        item.link === fastestJson.link
                    )
                    const driverId = await DriverModel.findOne({ name: fastestJson.driver})
                    console.log("==fastestJson==", fastestJson)
                    const insertFastest = await QualifyingModel.create({
                        ...fastestJson,
                        driverId: driverId?._id,
                        raceId: createRace._id,
                        resultId: findResultId?._id,
                        q1: fastestJson.q1 === "DNS" ? -2 : fastestJson.q1 === "DNF" ? 0 : fastestJson.q1 === "" ? -1 : HHmmssToNumber(fastestJson.q1),
                        q2: fastestJson.q2 === "DNS" ? -2 : fastestJson.q2 === "DNF" ? 0 : fastestJson.q2 === "" ? -1 : HHmmssToNumber(fastestJson.q2),
                        q3: fastestJson.q3 === "DNS" ? -2 : fastestJson.q3 === "DNF" ? 0 : fastestJson.q3 === "" ? -1 : HHmmssToNumber(fastestJson.q3),
                        laps: fastestJson.laps,
                        position: fastestJson.pos === "RT" ? -1 : fastestJson.pos === "NC" ? -1 : Number(fastestJson.pos),
                    })
                }

                // Starting Grid
                const startingGridResults = (startingGridResultList as Array<any>).filter(li => li.link === race.link);
                for (let iFastest = 0; iFastest < startingGridResults.length; iFastest += 1) {
                    const fastestJson = startingGridResults[iFastest];
                    const findResultId = filterByLink.find(item => 
                        item.driver === fastestJson.driver &&
                        item.link === fastestJson.link
                    )
                    const driverId = await DriverModel.findOne({ name: fastestJson.driver})
                    console.log("==fastestJson==", fastestJson)
                    const insertFastest = await StartingGridModel.create({
                        ...fastestJson,
                        driverId: driverId?._id,
                        raceId: createRace._id,
                        resultId: findResultId?._id,
                        time: fastestJson.time ? HHmmssToNumber(fastestJson.time) : -1,
                        position: fastestJson.stop === "NC" ? -1 : Number(fastestJson.stop),
                    })
                }

                 // Fastest-laps
                const fastestResult = (fastestResultList as Array<any>).filter(li => li.link === race.link);
                for (let iFastest = 0; iFastest < fastestResult.length; iFastest += 1) {
                    const fastestJson = fastestResult[iFastest];
                    const findResultId = filterByLink.find(item => 
                        item.driver === fastestJson.driver &&
                        item.link === fastestJson.link
                    )

                    const driverId = await DriverModel.findOne({ name: fastestJson.driver})
                    console.log("==fastestJson==", fastestJson)
                    const insertFastest = await FastestLapModel.create({
                        ...fastestJson,
                        driverId: driverId?._id,
                        raceId: createRace._id,
                        resultId: findResultId?._id,
                        position: fastestJson.pos === "NC" ? -1 : Number(fastestJson.pos),
                        timeOfDay: new Date(`0 ${fastestJson["time-of-day"]}`),
                        time: HHmmssToNumber(fastestJson.time),
                        avgSpeed: fastestJson["avg-speed"]
                    })
                }

                // Pit-stop=summary
                const pitStopResult = (pitStopResultList as Array<any>).filter(li => li.link === race.link);
                for (let iPit = 0; iPit < pitStopResult.length; iPit += 1) {
                    const pitStopJson = pitStopResult[iPit];
                    const findResultId = filterByLink.find(item => 
                        item.driver === pitStopJson.driver &&
                        item.link === pitStopJson.link
                    )
                    const driverId = await DriverModel.findOne({ name: pitStopJson.driver })
                    console.log("==HHmmssToNumber(pitStopJson.time)==", pitStopJson)
                    const insertFastest = await PitStopSummaryModel.create({
                        ...pitStopJson,
                        driverId: driverId?._id,
                        raceId: createRace._id,
                        resultId: findResultId?._id,
                        position: pitStopJson.pos === "NC" ? -1 : Number(pitStopJson.pos),
                        timeOfDay: new Date(`0 ${pitStopJson["time-of-day"]}`),
                        time: HHmmssToNumber(pitStopJson.time),
                        total: HHmmssToNumber(pitStopJson["total"]),
                        stops: Number(pitStopJson.stop)
                    })
                }

                // Practice 1 2 3
                const practice1 = (pracetice1List as Array<any>).filter(li => li.link === race.link);
                const practice2 = (pracetice2List as Array<any>).filter(li => li.link === race.link);
                const practice3 = (pracetice3List as Array<any>).filter(li => li.link === race.link);
                console.log("====practice1====", practice1.length)
                for (let iPractice = 0; iPractice < practice1.length; iPractice += 1) {
                    const practice1Json = practice1[iPractice];
                    const findResultId = filterByLink.find(item => 
                        item.driver === practice1Json.driver &&
                        item.link === practice1Json.link
                    )
                    const driverId = await DriverModel.findOne({ name: practice1Json.driver })
                    console.log("==practice1Json==", practice1Json)
                    const insertPractive = await PractiveModel.create({
                        ...practice1Json,
                        driverId: driverId?._id,
                        raceId: createRace._id,
                        resultId: findResultId?._id,
                        practiceTime: 1,
                        time: HHmmssToNumber(practice1Json.time),
                        gap: practice1Json.gap,
                        position: practice1Json.pos === "NC" ? -1 : Number(practice1Json.pos),
                    })
                }

                // console.log("====practice2====", practice2.length)
                for (let iPractice = 0; iPractice < practice2.length; iPractice += 1) {
                    const practice1Json = practice2[iPractice];
                    const findResultId = filterByLink.find(item => 
                        item.driver === practice1Json.driver &&
                        item.link === practice1Json.link
                    )
                    const driverId = await DriverModel.findOne({ name: practice1Json.driver })
                    const insertPractive = await PractiveModel.create({
                        ...practice1Json,
                        driverId: driverId?._id,
                        raceId: createRace._id,
                        resultId: findResultId?._id,
                        practiceTime: 2,
                        time: HHmmssToNumber(practice1Json.time),
                        gap: practice1Json.gap,
                        position: practice1Json.pos === "NC" ? -1 : Number(practice1Json.pos),
                    })
                }

                // console.log("====practice3====", practice3.length)
                for (let iPractice = 0; iPractice < practice3.length; iPractice += 1) {
                    const practice1Json = practice3[iPractice];
                    const findResultId = filterByLink.find(item => 
                        item.driver === practice1Json.driver &&
                        item.link === practice1Json.link
                    )
                    const driverId = await DriverModel.findOne({ name: practice1Json.driver })
                    const insertPractive = await PractiveModel.create({
                        ...practice1Json,
                        driverId: driverId?._id,
                        raceId: createRace._id,
                        practiceTime: 3,
                        resultId: findResultId?._id,
                        time: HHmmssToNumber(practice1Json.time),
                        gap: practice1Json.gap,
                        position: practice1Json.pos === "NC" ? -1 : Number(practice1Json.pos),
                    })
                }
            }

            process.exit()
        })
    })
}

a();