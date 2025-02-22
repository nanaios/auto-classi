#!/usr/bin/env -S node --enable-source-maps
import { arg, main, setArg } from "@/classi";
import { exec } from 'child_process';
import packageJson from "../package.json"
import { config, configJson } from "./config";
import iconv from "iconv-lite";
import cac from "cac"
import { inti } from "./init";

const DEFAULT_CHROME_PATHS: { [x in NodeJS.Platform]?: string } = {
    win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
}

const cli = cac()

cli.option("--dev", "開発者モードでコマンドを実行する", { default: false })
cli.option("--log", "詳細なログを出力します", { default: false })

cli.command("run", "AutoClassiの起動")
    .option("--rate <rate>", "ビデオの再生倍率", { default: 1 })
    .option("--wait <wait>", "待機時間", { default: 500 })
    .option("--per <per>", "推定初手正解率", { default: 100 })
    .option("--skip-video", "ビデオを飛ばすかどうか", { default: false })
    .option("--set-cookie", "cookieを保存するかどうか", { default: true })
    .option("--load-cookie", "cookieを読み込むかどうか", { default: false })
    .action(async (inputs) => {
        setArg(inputs)
        await main(packageJson.version)
    })

cli.command("open", "専用のChromeを開きます")
    .option("--timeout <timeout>", "コマンド終了までの時間", { default: 2000 })
    .action(async (input) => {
        await openChrome(input)
    })

cli.command("config <name>", "configを操作します")
    .option("--value <value>", "指定した名前のconfigに値をセットします", { default: undefined })
    .option("--clear", "指定した名前のconfigをリセットします", { default: false })
    .action((name, options) => {
        config(name, options)
    })

cli.command("init", "初期設定をします")
    .action(async () => {
        await inti()
    })


cli.help()
cli.version(packageJson.version);
cli.name = "AutoClassi"


try {
    cli.parse()
} catch (error) {
    console.log("Error:不明なコマンド及び引数")
    process.exit(1)
}

async function openChrome(arg: any) {
    const path = configJson["chrome-path"] || DEFAULT_CHROME_PATHS[process.platform]
    if (arg.dev) {
        console.log(`chrome path="${path}"`)
    }

    //@ts-ignore
    exec(`"${path}" --remote-debugging-port=9222`, { encoding: 'Shift_JIS' }, (_: any, __: any, stderr: Buffer) => {
        console.log(iconv.decode(stderr, "Shift_JIS"))
        process.exit(1)
    }
    )

    setTimeout(() => {
        process.exit()
    }, arg.timeout)
}