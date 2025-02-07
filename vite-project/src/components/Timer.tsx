import { useState, useEffect } from 'react'

function Timer() {
  //現在時刻を管理するState
  const [time, setTime] = useState<string>('')

  //コンポーネントがマウントされたときに実行→画面に表示された時に実行
  //マウント：画面に表示される事、アンマウント：画面から消える事
  //useEffectの説明:useEffectを使うと、useEffectに渡された関数はレンダーの結果が画面に反映された後に動作します。
  //つまりuseEffectとは、「関数の実行タイミングをReactのレンダリング後まで遅らせるhook」です。詳細はスプレッドシート：フロントエンジニア学習メモ、備忘記録
  useEffect (() => {
    //1秒ごとに時刻を更新 setInterval:間隔を明けて実行するメソッド
    const timer = setInterval(() => {
      const now = new Date()
      //timeの値を更新してる
      //toLocaleDateString()は、 Dateオブジェクトが持つ日付と時刻の値を、指定したロケールの形式で文字列として返します→※
      //上記の※の部分→現在の日付を文字列に変更する
      setTime(now.toLocaleTimeString())
    },1000)

    //クリーンアップ関数(アンマウント時に実行：画面から消えた時に実行)
    //clearInterval関数は、setInterval関数によって開始された繰り返し処理をキャンセルするために使用されます。
    //clearIntervalには、setInterval関数を引数として指定(timerの事)します。
    return () => {
      clearInterval(timer)
    }

  }, [])//[]の箇所の書き方、として3パターン存在 以下詳細※
  //※➀省略するパターン:毎回実行される、➁[]を書くパターン(今回のコードはこれ):初回のみ実行される。➂[変数、関数の戻り値]:変数や関数の戻り値が変更された場合にも実行される。

  return (
    <div className="timer">
      <h2>現在時刻</h2>
      <p>{time}</p>
    </div>
  )
}

export default Timer