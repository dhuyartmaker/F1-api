import * as cheerio from "cheerio";
import fs from "fs";
import { asyncReader, jsonReader } from "../src/utils/crawling";
import mongoose from "mongoose";

const fromYear = 2020;
const endYear = 2023;

const category = {
    races: "races",
    drivers: "drivers",
    teams: "team",
    fastestLaps: "fastest-laps",
}

const qualifyResult = "./crawling/data/qualifying-result.json"

const raceCateogry = {
    raceResult: "race-result",
    // fastestLaps: "fastest-laps",
    // pitStopSummary: "pit-stop-summary",
    startingGrid: "starting-grid",
    // pracetice1: "practice-1",
    // pracetice2: "practice-2",
    // pracetice3: "practice-3",
}

const driversFile = "./crawling/data/drivers.json"
const racesFile = "./crawling/data/races.json"
const raceResult = "./crawling/data/race-result.json"

const CRAW_RESULT_LINK = (year: number, category: string) => `https://www.formula1.com/en/results.html/${year}/${category}.html`;

const CLASS = {
    FILTER: ".resultsarchive-filter-wrap",
    RESULT_TABLE: ".resultsarchive-table",
    FIRSTNAME: ".hide-for-tablet",
    LASTNAME: ".hide-for-mobile"
}

const fetchWithDelay = (link: string) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const data = await fetch(link).then(data => data.text()).then(data => data)
                .catch(error => {
                    console.log("==error==", error)
                    reject(error)
                });
            resolve(data)
        }, 500)
    })
}

const attrDriver = ["pos", "driver", "nationality", "team", "pts"]
const attrRaces = ["grandprix", "date", "winner", "team", "laps", "time"]
const attrResultRace = ["pos", "no", "driver", "car", "laps", "time", "pts"]
const attrOtherReace = {
    // [raceCateogry.fastestLaps]: ["pos", "no", "driver", "car", "lap", "time-of-day", "time", "avg-speed"],
    // [raceCateogry.pitStopSummary]: ["stop", "no", "driver", "car", "lap", "time-of-day", "time", "total"],
    [raceCateogry.startingGrid]: ["stop", "no", "driver", "car", "time"],
    // [raceCateogry.qualifying]: ["pos", "no", "driver", "car", "q1", "q2", "q3", "laps"],
    // [raceCateogry.pracetice1]: ["pos", "no", "driver", "car", "time", "gap", "laps"],
    // [raceCateogry.pracetice2]: ["pos", "no", "driver", "car", "time", "gap", "laps"],
    // [raceCateogry.pracetice3]: ["pos", "no", "driver", "car", "time", "gap", "laps"],
}

const getAllDriver = async () => {
    const result = [];
    for (let i = fromYear; i <= endYear; i += 1) {
        const dataDriverEachYear = await fetchWithDelay(CRAW_RESULT_LINK(i, category.drivers));
        console.log("====dataDriverEachYear====")

        const $ = cheerio.load(dataDriverEachYear as string);
        const selectTabel = $(`${CLASS.RESULT_TABLE}`);
        const $tabel = cheerio.load(`${selectTabel.html()}`);
        const allRow = $tabel("tr", "tbody", `${selectTabel.html()}`);

        for (let row = 0; row < allRow.length; row += 1) {
            const eachDriver = { year: i } as any;
            const loadEachRow = cheerio.load(allRow[row])("td");
            for(let col = 0; col < loadEachRow.length; col += 1) {
                if (col === 0 || col === loadEachRow.length - 1) continue;
                const loadCol = cheerio.load(loadEachRow[col]);

                if (col === 2) {
                    const firstName = loadCol(CLASS.FIRSTNAME).text()
                    const lastName = loadCol(CLASS.LASTNAME).text()
                    eachDriver[attrDriver[col - 1]] = `${firstName} ${lastName}`;
                    continue;
                }
                eachDriver[attrDriver[col - 1]] = loadCol.text().trim().replace(/\n/, "")
            }
            result.push(eachDriver)
        }
    }
    // Write file
    const jsonString = JSON.stringify(result)
    console.log("===jsonString===", jsonString)
    await fs.writeFile(driversFile, jsonString, (err: any) => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

const getAllRaces = async () => {
    const result = [];
    for (let i = fromYear; i <= endYear; i += 1) {
        const dataDriverEachYear = await fetchWithDelay(CRAW_RESULT_LINK(i, category.races));
        console.log("====dataDriverEachYear====")

        const $ = cheerio.load(dataDriverEachYear as string);
        const selectTabel = $(`${CLASS.RESULT_TABLE}`);
        const $tabel = cheerio.load(`${selectTabel.html()}`);
        const allRow = $tabel("tr", "tbody", `${selectTabel.html()}`);

        for (let row = 0; row < allRow.length; row += 1) {
            const eachDriver = { year: i } as any;
            const loadEachRow = cheerio.load(allRow[row])("td");
            for(let col = 0; col < loadEachRow.length; col += 1) {
                if (col === 0 || col === loadEachRow.length - 1) continue;
                const loadCol = cheerio.load(loadEachRow[col]);
                if (col === 1) {
                    eachDriver["link"] = loadCol(".ArchiveLink").attr("href");
                    eachDriver[attrRaces[col - 1]] = loadCol.text().trim().replace(/\n/, "")
                    continue;
                }
                if (col === 3) {
                    const firstName = loadCol(CLASS.FIRSTNAME).text().trim().replace(/\n/, "")
                    const lastName = loadCol(CLASS.LASTNAME).text().trim().replace(/\n/, "")
                    eachDriver[attrRaces[col - 1]] = `${firstName} ${lastName}`;
                    continue;
                }
                eachDriver[attrRaces[col - 1]] = loadCol.text().trim().replace(/\n/, "")
            }
            result.push(eachDriver)
        }
    }
    // Write file
    const jsonString = JSON.stringify(result)
    console.log("===jsonString===", jsonString)
    await fs.writeFile(racesFile, jsonString, (err: any) => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

const readRaceJsonFileAndCrawREsult = async () => {
    jsonReader(racesFile, async (err: any, data: any) => {
        const arrData = data.filter((d : any) => d.year >= 2020);

        for (let iDoc = 0; iDoc < arrData.length; iDoc += 1) {
            const result: any[] = [];
            const doc = arrData[iDoc]
            const dataDriverEachYear = await fetchWithDelay(`https://www.formula1.com${doc.link}`);
            console.log("====dataDriverEachYear====")

            const $ = cheerio.load(dataDriverEachYear as string);
            const selectTabel = $(`${CLASS.RESULT_TABLE}`);
            const $tabel = cheerio.load(`${selectTabel.html()}`);
            const allRow = $tabel("tr", "tbody", `${selectTabel.html()}`);

            for (let row = 0; row < allRow.length; row += 1) {
                const eachDriver = { year: doc.year } as any;
                const loadEachRow = cheerio.load(allRow[row])("td");
                for(let col = 0; col < loadEachRow.length; col += 1) {
                    if (col === 0 || col === loadEachRow.length - 1) continue;
                    const loadCol = cheerio.load(loadEachRow[col]);
                    if (col === 3) { // name
                        const firstName = loadCol(CLASS.FIRSTNAME).text().trim().replace(/\n/, "")
                        const lastName = loadCol(CLASS.LASTNAME).text().trim().replace(/\n/, "")
                        eachDriver[attrResultRace[col - 1]] = `${firstName} ${lastName}`;
                        eachDriver["link"] = doc.link
                        eachDriver["id"] = new mongoose.Types.ObjectId()
                        continue;
                    }
                    eachDriver[attrResultRace[col - 1]] = loadCol.text().trim().replace(/\n/, "")
                    eachDriver["link"] = doc.link
                    eachDriver["id"] = new mongoose.Types.ObjectId()
                }
                result.push(eachDriver)
            }

            // Write file
            await jsonReader(raceResult, async (err: any, existsData: any) => {
                if (err) {
                    console.log("Error reading file:", err);
                    return;
                }
                const concatData = existsData.concat(result)
                const jsonString = JSON.stringify(concatData)
                console.log("===jsonString===", jsonString)
                await fs.writeFile(raceResult, jsonString, (err: any) => {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file')
                    }
                })
            })
        }

        
    })

    
}

const readRaceJsonFileAndCrawOtherREsult = async () => {
    jsonReader(racesFile, async (err: any, data: any) => {
        const arrData = data.filter((d : any) => d.year >= 2020);

        for (let iList = 0; iList < Object.keys(attrOtherReace).length; iList += 1) {
            const nameList = Object.keys(attrOtherReace)[iList];
            for (let iDoc = 0; iDoc < arrData.length; iDoc += 1) {
                const result: any[] = [];
                const doc = arrData[iDoc];

                const fetchResult = await fetchWithDelay(`https://www.formula1.com${doc.link}`);

                const $race = cheerio.load(fetchResult as string).html();
                // const isPrac1 = $race.includes("practice-1")
                // const isPrac2 = $race.includes("practice-2")
                // const isPrac3 = $race.includes("practice-3")
                // const isFastestLaps = cheerio.load(fetchResult as string)(".resultsarchive-side-nav")?.html()?.includes(raceCateogry.fastestLaps)
                // console.log("==", doc.link, isFastestLaps)
                // if (!isFastestLaps && nameList === raceCateogry.fastestLaps) continue;
                // if (!isPrac1 && nameList === raceCateogry.pracetice1) continue;
                // if (!isPrac2 && nameList === raceCateogry.pracetice2) continue;
                // if (!isPrac3 && nameList === raceCateogry.pracetice3) continue;
                // const isPitStop = cheerio.load(fetchResult as string)(".resultsarchive-side-nav")?.html()?.includes(raceCateogry.pitStopSummary)
                // console.log("==", doc.link, isPitStop)
                // if (!isPitStop && nameList === raceCateogry.pitStopSummary) continue;
                const linkRaw = `https://www.formula1.com${doc.link}`.replace(raceCateogry.raceResult, nameList);
                const dataDriverEachYear = await fetchWithDelay(linkRaw);

                const $ = cheerio.load(dataDriverEachYear as string);
                const selectTabel = $(`${CLASS.RESULT_TABLE}`);
                const $tabel = cheerio.load(`${selectTabel.html()}`);
                const allRow = $tabel("tr", "tbody", `${selectTabel.html()}`);

                for (let row = 0; row < allRow.length; row += 1) {
                    const eachDriver = { year: doc.year } as any;
                    const loadEachRow = cheerio.load(allRow[row])("td");
                    for(let col = 0; col < loadEachRow.length; col += 1) {
                        if (col === 0 || col === loadEachRow.length - 1) continue;
                        const loadCol = cheerio.load(loadEachRow[col]);
                        if (col === 3) { // name
                            const firstName = loadCol(CLASS.FIRSTNAME).text().trim().replace(/\n/, "")
                            const lastName = loadCol(CLASS.LASTNAME).text().trim().replace(/\n/, "")
                            eachDriver[attrOtherReace[nameList][col - 1]] = `${firstName} ${lastName}`;
                            eachDriver["link"] = doc.link;
                            continue;
                        }
                        eachDriver[attrOtherReace[nameList][col - 1]] = loadCol.text().trim().replace(/\n/, "")
                        eachDriver["link"] = doc.link;
                    }
                    result.push(eachDriver)
                }

                // Write file
                const newFile = raceResult.replace("race", nameList)
                await jsonReader(newFile, async (err: any, existsData: any) => {
                    if (err) {
                        await fs.writeFile(newFile, "", (err: any) => {
                            console.log("====err====createFail----", err)
                        })
                    }
                    const concatData = (existsData || []).concat(result)
                    const jsonString = JSON.stringify(concatData)
                    await fs.writeFile(newFile, jsonString, (err: any) => {
                        if (err) {
                            console.log('Error writing file', err)
                        } else {
                            console.log('Successfully wrote file')
                        }
                    })
                })
            }
        }
    })

    
}

// getAllDriver()
// getAllRaces()
// readRaceJsonFileAndCrawREsult()
readRaceJsonFileAndCrawOtherREsult()