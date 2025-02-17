#!/usr/bin/env node
import path from "path";
import { main } from ".";
import { exec } from 'child_process';

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'

async function cli() {
    switch (process.argv[2]) {
        case "run": {
            await main()
            break;
        }
        case "open": {
            openChrome()
            break
        }
        default: {
            console.error("Error:不明なコマンドです")
            break;
        }
    }
}

async function openChrome() {
    console.log("chromeを起動する")
    const timeout = (() => {
        const num = Number(process.argv[3])
        if (Number.isNaN(num)) {
            return undefined
        } else {
            return num
        }
    })() ?? 2000

    const cwd = path.join(import.meta.dirname, "../")
    if (is_windows) {
        console.log(path.join(cwd, "open.bat") + "を実行します")
        exec(path.join(cwd, "open.bat"))
    } else if (is_mac) {
        console.log(path.join(cwd, "open.command") + "を実行します")
        console.info(`Info:Macで実行できない場合、'chmod 755 ${path.join(cwd, "open.command")}'を実行して下さい`)
        exec(path.join(cwd, "open.command"))
    }
    setTimeout(() => {
        process.exit()
    }, timeout)
}

await cli()