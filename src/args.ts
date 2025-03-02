import { defaultLog } from "./log"

export let runCommandArgs: RunCommandArgs
export let globalCommandArgs: GlobalCommandArgs

function setArgs(args: GlobalCommandArgs) {
	globalCommandArgs = args
}

export function setArgsForRunCommand(args: RunCommandArgs) {
	defaultLog(`詳細なログ:${args.log}`)
	defaultLog(`再生倍率:${args.rate}`)
	defaultLog(`推定初手正解率:${args.per}`)
	defaultLog(`キャッシュされたcookieを無効にする:${args.nonCookieCache}`)
	defaultLog(`キャッシュされたcookieで強制的にログインする:${args.forcedCache}`)
	defaultLog(`動画をスキップする:${args.skipVideo}`)
	setArgs(args)
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