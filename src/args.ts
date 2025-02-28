import { defaultLog } from "./log"

export let runCommandArgs: RunCommandArgs

export function setArgsForRunCommand(args: RunCommandArgs) {
    defaultLog(`詳細なログ:${args.log}`)
    defaultLog(`再生倍率:${args.rate}`)
    defaultLog(`推定初手正解率:${args.per}`)
    runCommandArgs = args
}

interface GlobalCommandArgs {
    log: boolean
    nonHeadless: boolean
}

export interface RunCommandArgs extends GlobalCommandArgs {
    rate: number,
    per: number
}