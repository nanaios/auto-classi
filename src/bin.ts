#!/usr/bin/env node
import { main } from ".";
import { exec } from 'child_process';
import { argToNumber } from "./utility";

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
    const timeout = argToNumber(0) ?? 2000

    let chromePath: string

    if (is_windows) {
        chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    } else if (is_mac) {
        chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    } else {
        throw new Error("Error:不明なOSです")
    }

    exec(`"${chromePath}" --remote-debugging-port=9222`)

    setTimeout(() => {
        process.exit()
    }, timeout)
}

await cli()