import fs from "fs"
import path from "path"
import { getCaller } from "./utility";

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

export const logFilePath = path.join("log", `${Date.now()}.log`)

fs.writeFileSync(logFilePath, "")

const logStream = fs.createWriteStream(logFilePath)

export function defaultLog(data: string) {
	const date = new Date()
	logStream.write(`[ ${toISOStringWithTimezone(date)} ] ${data}	[ caller: "${getCaller()}" ] \n`)
	console.log(data);
}

export function detailedLog(data: string) {
	const date = new Date()
	logStream.write(`[ ${toISOStringWithTimezone(date)} ]	詳細ログ : ${data}	[ caller: "${getCaller()}" ] \n`)
	if (isDetailedLog) {
		console.log(data);
	}
}