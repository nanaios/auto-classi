import fs from "fs"
import path from "path"

let isDetailedLog = false

function toISOStringWithTimezone(date: Date): string {
    const pad = function (str: string): string {
        return ('0' + str).slice(-2);
    }
    const year = (date.getFullYear()).toString();
    const month = pad((date.getMonth() + 1).toString());
    const day = pad(date.getDate().toString());
    const hour = pad(date.getHours().toString());
    const min = pad(date.getMinutes().toString());
    const sec = pad(date.getSeconds().toString());
    const tz = -date.getTimezoneOffset();
    const sign = tz >= 0 ? '+' : '-';
    const tzHour = pad((tz / 60).toString());
    const tzMin = pad((tz % 60).toString());

    return `${year}-${month}-${day}T${hour}:${min}:${sec}${sign}${tzHour}:${tzMin}`;
}

const logFilePath = path.join("log", `${Date.now()}.log`)
fs.writeFileSync(logFilePath, "")

const logStream = fs.createWriteStream(logFilePath)

export function defaultLog(data: any) {
    const date = new Date()
    logStream.write(`[${toISOStringWithTimezone(date)}]${data}\n`)
    console.log(data);
}

export function detailedLog(data: any) {
    const date = new Date()
    logStream.write(`[${toISOStringWithTimezone(date)}]${data}\n`)
    if (isDetailedLog) {
        console.log(data);
    }
}