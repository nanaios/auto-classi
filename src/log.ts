import fs from "fs"
import path from "path"

let isDetailedLog = true

const date = new Date().toISOString()

const logFilePath = path.join("log", `${"nice"}.log`)
const logFile = fs.writeFileSync(logFilePath, "ENOENT: no such file or directory, open")
console.log(`ログファイルパス:${logFilePath}`)

export function detailedLog(data: any) {
    if (isDetailedLog) {
        console.log(data);
    }
}