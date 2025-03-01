import { defaultLog } from "./log"

export let runCommandArgs: RunCommandArgs

const mapJapaneseBoolean = (bool: boolean) => bool ? "有効" : "無効"

export function setArgsForRunCommand(args: RunCommandArgs) {
	defaultLog(`詳細なログ:${mapJapaneseBoolean(args.log)}`)
	defaultLog(`再生倍率:${args.rate}`)
	defaultLog(`推定初手正解率:${args.per}`)
	defaultLog(`キャッシュされたcookieを無効にする:${mapJapaneseBoolean(args.nonCookieCache)}`)
	defaultLog(`キャッシュされたcookieで強制的にログインする${mapJapaneseBoolean(args.forcedCache)}`)
	defaultLog(`動画をスキップする:${mapJapaneseBoolean(args.skipVideo)}`)
	runCommandArgs = args
}

interface GlobalCommandArgs {
	log: boolean
	nonHeadless: boolean
}

export interface RunCommandArgs extends GlobalCommandArgs {
	rate: number,
	per: number,
	nonCookieCache: boolean
	forcedCache: boolean
	skipVideo: boolean
}