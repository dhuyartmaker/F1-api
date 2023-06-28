import fs from "fs";

export const jsonReader = (filePath: string, cb: any) => {
    fs.readFile(filePath, (err: any, fileData: any) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            if (fileData.length === 0) return cb && cb(null, [])
            const object = JSON.parse(fileData.toString());
            console.log("===", object.length)
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

export const asyncReader = (filePath: string) => {
    return new Promise((resolve: any, reject: any) => {
        fs.readFile(filePath, (err: any, fileData: any) => {
            if (err) {
                reject(err)
            }
            try {
                if (fileData.length === 0) return resolve([])
                const object = JSON.parse(fileData.toString());
                resolve(object)
            } catch (err) {
                reject(err)
            }
        });
    })
}

export const HHmmssToNumber = (hours: string) => {
    const splitDot = hours.split(".");
    const splitHours = splitDot[0].split(":");
    return splitHours.length === 3 ? 
        ((Number(splitHours[0]) * 3600 + Number(splitHours[1]) * 60 + Number(splitHours[2])) * 1000) + (Number(splitDot?.[1] || 0)) : (
        splitHours.length === 2 ?
        ((Number(splitHours[0]) * 60 + Number(splitHours[1])) * 1000) + (Number(splitDot?.[1] || 0)) :
        (Number(splitHours[0]) * 1000) + (Number(splitDot?.[1] || 0))
        )
}

export const calcAddTime = (hours: number, add: string) => {
    if (add === "DNF") return -1;
    const time = Number(add.replace("+", "").replace("s", "")) * 1000;
    return hours + time;
}