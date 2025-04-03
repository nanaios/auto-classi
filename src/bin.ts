#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import cac from "cac";
import { run } from "./classi";
import packageJson from "../package.json" with {type: "json"}
import { defaultLog, logFilePath } from "./log";
import type { RunCommandArgs } from "./args";

const notifier = updateNotifier({ pkg: packageJson });

notifier.check()

if (notifier.update) {
	defaultLog(`AutoClassiに更新が来ています`)
	defaultLog(`${notifier.update.current} => ${notifier.update.latest}`)
	defaultLog(`'npm install -g auto-classi'と入力して、更新してください`)
}

const cli = cac("AutoClassi")

cli.option("--log", "詳細なログを有効にする", { default: false })
	.option("--non-headless", "ヘッドレスモードを無効にする", { default: false })

cli.command("run")
	.option("--rate <rate>", "動画の再生倍率を設定します", { default: 1 })
	.option("--per <per>", "初手正解率を設定します", { default: 100 })
	.option("--non-cookie-cache", "cookieのキャッシュを無効にします", { default: false })
	.option("--forced-cache", "cookieのキャッシュを永久保存モードで保存します", { default: false })
	.option("--skip-video", "動画の再生をスキップします", { default: false })
	.option("--fake-human", "解答時や正答確認時にランダムな待機時間を発生させます", { default: false })
	.option("--max-wait-for-fake", "fake-humanオプションでの最小待機時間を設定", { default: 120 })
	.option("--min-wait-for-fake", "fake-humanオプションでの最小待機時間を設定", { default: 30 })
	.action(async (args: RunCommandArgs) => {
		try {
			await run(args)
		} catch (error) {
			console.error(error)
			console.log(`詳細なログ:${logFilePath}`)
			process.exit(1)
		}
	})

cli.help()
cli.version(packageJson.version)

try {
	cli.parse()
} catch (error) {
	defaultLog("コマンドを展開できませんでした")
	process.exit(1)
}