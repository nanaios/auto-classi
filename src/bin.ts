#!/usr/bin/env node
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
    if (is_windows) {
        exec(".\\open.bat")
    } else if (is_mac) {
        exec(".\\open.sh")
    }
    setTimeout(() => {
        process.exit(0)
    }, 2000);
}

await cli()