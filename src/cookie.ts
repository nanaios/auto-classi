import fs from "fs"
import path from "path"
import type { Cookie } from "puppeteer"
import { defaultLog, detailedLog } from "./log"
import { runCommandArgs } from "./args"

let cookiesJsonFileName = "cookie.json"
DEV: cookiesJsonFileName = "cookie.dev.json"

const cookiesJsonPath = path.join(import.meta.dirname, "../json", cookiesJsonFileName)

export function readCookies() {
	const json = fs.readFileSync(cookiesJsonPath, "utf-8")
	return JSON.parse(json) as Cookie[]
}

export const isWithInExpirationDate = () => {
	detailedLog("キャッシュされたcookieの検証を開始")

	//dateのタイムスタンプはミリ秒単位なので、1000で割って秒単位にする
	const now = Math.floor(Date.now() / 1000)
	detailedLog(`現在時刻(タイムスタンプ):${now}`)
	const cookies = readCookies()

	if (cookies.length === 0) return false;

	for (const { expires, name } of cookies) {
		detailedLog(`cookie[name:"${name}"]の有効期限を調査`)

		//"expires"が-1の時、cookieはセッション終了時に削除される設定なので復元が可能
		//したがって、有効期限内と判断する
		//逆に、-1出ないときは調査が必要なので処理をする
		if (expires === -1) {
			defaultLog(`cookie[name:"${name}"]はセッションcookieです`)
		} else {
			const floorExpires = Math.floor(expires)
			detailedLog(`有効期限(タイムスタンプ):${floorExpires}`)
			if (now < floorExpires) {
				detailedLog(`cookie[name:"${name}"]は有効期限内です`)
			} else {
				detailedLog(`cookie[name:"${name}"]は有効期限外です`)
				return false
			}
		}
	}
	return true
}

export function writeCookies(cookies: Cookie[]) {
	if (runCommandArgs.forcedCache) {
		detailedLog("cookieの有効期限を上書きします")
		cookies.forEach(cookie => {
			//cookieの有効期限を上書きする
			cookie.expires = -1
		})
	}

	const json = JSON.stringify(cookies)
	fs.writeFileSync(cookiesJsonPath, json)
}