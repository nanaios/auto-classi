<img src="https://img.shields.io/badge/-Node.js-339933.svg?logo=node.js&style=flat-square" width="40%"><img src="https://img.shields.io/badge/-Typescript-000000.svg?logo=typescript&style=popout-square" width="40%">

## 注意
**事前にnode.jsをインストールする必要があります。ご注意ください。**  
**Chromeを複数開いていると上手く作動しない場合があります。Chromeをすべて閉じたうえでもう一度試してください。**

## 使い方
1. コンソールを開き`npm install -g auto-classi`と入力してください。この時、コマンドに引数を指定できます。構文は`autoclassi open [ --timeout ]`となります。<br>例：`autoclassi open --timeout=5000` => タイムアウト時間5000ms。デフォルト値はタイムアウト時間5000msです。
2. `autoclassi open`とコンソールに入力し専用のChromeを開きます。このとき、あらかじめほかのChromeタブを全て閉じておいてください。
3. Classi先生課題の欄を開きます。取り組み中の欄を開いておいてください。
4. `autoclassi run`で自動操作が始まります。この時、コマンドに引数を指定できます。構文は`autoclassi run [ --wait | --rate | --per ]`となります。<br>例：`autoclassi run --per=50 --wait=1000 --rate=2` => 推定初手正解率50%、待機時間1000ms、動画の再生倍率2倍。<br>デフォルト値は正解率100%、待機時間500ms、再生倍率1倍です。