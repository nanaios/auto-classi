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
	defaultLog(`待機時間を偽装する:${args.fakeHuman}`)
	defaultLog(`偽装時の最大待機時間:${args.maxWaitForFake}`)
	defaultLog(`偽装時の最小待機時間:${args.minWaitForFake}`)
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
	fakeHuman: boolean
	maxWaitForFake: number
	minWaitForFake: number
}