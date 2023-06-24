import * as cheerio from "cheerio";
import fs from "fs";
import { jsonReader } from "../src/utils/crawling";

const fromYear = 1950;
const endYear = 2023;

const category = {
    races: "races",
    drivers: "drivers",
    teams: "team",
    fastestLaps: "fastest-laps",
}

const raceCateogry = {
    raceResult: "race-result",
    fastestLaps: "fastest-laps",
    pitStopSummary: "pit-stop-summary",
    startingGrid: "starting-grid",
    qualifying: "qualifying",
    pracetice1: "practice-1",
    pracetice2: "practice-2",
    pracetice3: "practice-3",
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
        }, 2000)
    })
}

const attrDriver = ["pos", "driver", "nationality", "team", "pts"]
const attrRaces = ["grandprix", "date", "winner", "team", "laps", "time"]
const attrResultRace = ["pos", "no", "driver", "car", "laps", "time", "pts"]
const attrOtherReace = {
    [raceCateogry.fastestLaps]: ["pos", "no", "driver", "car", "lap", "time-of-day", "time", "avg-speed"],
    [raceCateogry.pitStopSummary]: ["stop", "no", "driver", "lap", "time-of-day", "time", "total"],
    [raceCateogry.qualifying]: ["pos", "no", "driver", "car", "q1", "q2", "q3", "laps"],
    [raceCateogry.pracetice1]: ["pos", "no", "driver", "car", "time", "gap", "laps"],
    [raceCateogry.pracetice2]: ["pos", "no", "driver", "car", "time", "gap", "laps"],
    [raceCateogry.pracetice3]: ["pos", "no", "driver", "car", "time", "gap", "laps"],
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
        const arrData = data.filter((d : any) => d.year === 2023);

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
                        continue;
                    }
                    eachDriver[attrResultRace[col - 1]] = loadCol.text().trim().replace(/\n/, "")
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
        const arrData = data.filter((d : any) => d.year === 2023);

        for (let iList = 0; iList < Object.keys(attrOtherReace).length; iList += 1) {
            const nameList = Object.keys(attrOtherReace)[iList];
            console.log("===nameList===", nameList)
            for (let iDoc = 0; iDoc < arrData.length; iDoc += 1) {
                const result: any[] = [];
                const doc = arrData[iDoc]
                const linkRaw = `https://www.formula1.com${doc.link}`.replace(raceCateogry.raceResult, nameList);
                console.log("==linkRaw==", linkRaw)
                const dataDriverEachYear = await fetchWithDelay(linkRaw);
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
                            eachDriver[attrOtherReace[nameList][col - 1]] = `${firstName} ${lastName}`;
                            continue;
                        }
                        eachDriver[attrOtherReace[nameList][col - 1]] = loadCol.text().trim().replace(/\n/, "")
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
                    console.log("===jsonString===", jsonString)
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