#!/usr/bin/env node
import { isDev, main, TIMEOUT } from "@/classi";
import { exec } from 'child_process';
import packageJson from "../package.json"
import { config, configJson } from "./config";
import iconv from "iconv-lite";

const DEFAULT_CHROME_PATHS: { [x in NodeJS.Platform]?: string } = {
    win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
}

async function cli() {
    switch (process.argv[2]) {
        case "run": {
            await main(packageJson.version)
            break;
        }
        case "open": {
            openChrome()
            break
        }
        case "config": {
            config()
            break
        }
        case "--version": {
            console.log(`v${packageJson.version}`)
            break
        }
        default: {
            console.error("Error:不明なコマンドです")
            break;
        }
    }
}

async function openChrome() {
    const path = configJson["chrome-path"] || DEFAULT_CHROME_PATHS[process.platform]
    if (isDev) {
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
    }, TIMEOUT)
}

await cli()