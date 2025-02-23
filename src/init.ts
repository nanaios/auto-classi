import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
import { setConfig } from "./config";
import { log } from "./utilitys";

const rl = readline.createInterface({ input, output });

export async function inti() {
    const email = await rl.question("Googleログイン用Email:")
    setConfig("login-email", email)
    const password = await rl.question("Googleログイン用Password:")
    setConfig("login-password", password)
    log("configをセットしました")
    process.exit(0)
}