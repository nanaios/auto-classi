<img src="https://img.shields.io/badge/-Node.js-339933.svg?logo=node.js&style=flat-square">
<img src="https://img.shields.io/badge/-Typescript-000000.svg?logo=typescript&style=popout-square">

## 注意
**事前にnode.jsをインストールする必要があります。ご注意ください。**
**Chromeを複数開いていると上手く作動しない場合があります。Chromeをすべて閉じたうえでもう一度試してください。**

## 使い方
1. releasesからrelease.zipをダウンロードしてください。  
2. 任意のフォルダでrelease.zipを解凍してください。  
3. コマンドプロンプトなどで、cdコマンドを使い展開したフォルダまでたどり着いてください。  
4. `npm ci`と入力します。再び入力できるようになるまで待ちます。
5. `npm run open`と入力します。この時開いたChromeでClassiにログインしてください。
6. Classiで任意の課題を開いて「課題に取り組む」ボタンを押して、遷移した画面で待ちます。この時、講座がいくつか表示されている画面であれば大丈夫です。
7. コマンドプロンプトで`npm run start`と入力します。この時、コマンドに引数を指定できます。構文は`npm run start [初手正解率] [待機時間(ms)]`となります。例：`npm run start 50 1000` => 推定初手正解率50%、待機時間1000ms。デフォルト値は正解率100%、待機時間500msです。
8. AutoClassiが起動し、自動で制御されていれば成功です。
