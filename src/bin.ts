#!/usr/bin/env -S node --enable-source-maps
import cac from "cac";
import { run } from "./classi";
import packageJson from "../package.json"
import { defaultLog } from "./log";
import type { RunCommandArgs } from "./args";

const cli = cac("AutoClassi")

cli
    .option("--log", "詳細なログを有効にする", { default: false })
    .option("--non-headless", "ヘッドレスモードを無効にする", { default: false })

cli.command("run")
    .option("--rate <rate>", "動画の再生倍率を設定する", { default: 1 })
    .option("--per <per>", "初手正解率を設定する", { default: 100 })
    .action(async (args: RunCommandArgs) => {
        await run(args)
    })

cli.version(packageJson.version)

try {
    cli.parse()
} catch (error) {
    defaultLog("コマンドを展開できませんでした")
    process.exit(1)
}

//await run()