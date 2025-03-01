#!/usr/bin/env -S node --enable-source-maps
import path from "path"
import cac from "cac";
import { run } from "./classi";
import packageJson from "../package.json"
import { defaultLog, detailedLog, logFilePath } from "./log";
import type { RunCommandArgs } from "./args";

const cli = cac("AutoClassi")

cli.option("--log", "詳細なログを有効にする", { default: false })
	.option("--non-headless", "ヘッドレスモードを無効にする", { default: false })

cli.command("run")
	.option("--rate <rate>", "動画の再生倍率を設定する", { default: 1 })
	.option("--per <per>", "初手正解率を設定する", { default: 100 })
	.option("--non-cookie-cache", "cookieのキャッシュを無効にします", { default: false })
	.option("--forced-cache", "cookieのキャッシュを永久保存モードで保存します", { default: true })
	.option("--skip-video", "動画の再生をスキップする", { default: false })
	.action(async (args: RunCommandArgs) => {
		try {
			await run(args)
		} catch (error) {
			console.error(error)
			console.log(`詳細なログ:${path.join(import.meta.dirname, "../", logFilePath)}`)
			process.exit(1)
		}
	})

cli.version(packageJson.version)

try {
	cli.parse()
} catch (error) {
	defaultLog("コマンドを展開できませんでした")
	process.exit(1)
}