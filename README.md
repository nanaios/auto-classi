<img src="https://img.shields.io/badge/-Node.js-339933.svg?logo=node.js&style=flat-square" width="40%"><img src="https://img.shields.io/badge/-Typescript-000000.svg?logo=typescript&style=popout-square" width="40%">

## 注意
**事前にnode.jsをインストールする必要があります。ご注意ください。**
**Chromeを複数開いていると上手く作動しない場合があります。Chromeをすべて閉じたうえでもう一度試してください。**
**Macユーザーは`autoclassi open`が正しく動作しない場合があります。画面のログの指示に従って、権限を追加してください。**

## 使い方
1. コンソールを開き`npm install -g auto-classi`と入力してください。
2. `autoclassi open`とコンソールに入力し専用のChromeを開きます。このとき、あらかじめほかのChromeタブを全て閉じておいてください。
3. Classiで任意の課題を開いて「課題に取り組む」ボタンを押して、遷移した画面で待ちます。この時、講座がいくつか表示されている画面であれば大丈夫です。
4. `autoclassi run`で自動操作が始まります。この時、コマンドに引数を指定できます。構文は`autoclassi run [初手正解率] [待機時間(ms)] [再生倍率]`となります。例：`autoclassi run 50 1000 2` => 推定初手正解率50%、待機時間1000ms、動画の再生倍率2倍。デフォルト値は正解率100%、待機時間500ms、再生倍率1倍です。