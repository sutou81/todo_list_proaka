import { useState, useEffect } from 'react'

//ユーザー情報の型定義
/*TypeScriptにおいて、| はユニオン型 (Union Type) と呼ばれる型を表現するために使用されます。ユニオン型は、「複数の型のうちいずれかの型を取りうる」ことを表します。

今回の例 status: 'online' | 'offline' では、status プロパティは 'online' という文字列型
、または 'offline' という文字列型のどちらかの値を持つことができます。
つまり、status は 'online' か 'offline' のどちらかの文字列でなければならない、という制約を表現しています。*/
interface User{
  id:number
  name:string
  email:string
  status:'online' | 'offline'
}

function UserProfile() {
  //ユーザーデータを取得する関数
  //userの値はinterface Userの型を持つか、nullの型を持ち、初期値はnull
  //以下のコードの説明:useState はジェネリック関数であり、型引数を受け取ることができます。→
  //→型引数は、useState が返すステート変数の型を指定するために使用します。→
  //→useState<型> の <型> の部分が型引数です。→
  //→** useState<User | null>(null) の場合**→
  //→この場合、型引数は User | null です。これは「ユニオン型」と呼ばれる型で、→
  //→「User 型または null 型のどちらか」を表します。つまり、この useState が→
  //→返すステート変数は、User オブジェクトか null のどちらかの値を持ちます。→
  //→初期値として null が渡されているため、初期状態では null になります。
  const [user, setUser] = useState<User | null>(null)
  //ローディング状態を管理するState
  const [loading, setLoading] = useState(true)
  //エラー状態を管理するState
  const [error, setError] = useState<string>('')
  //↑型引数は必ずしも指定する必要はありません。TypeScriptは型推論という機能を持っており、型引数を省略した場合でも、
  //文脈から型を推論してくれる場合があります。しかし、型引数を明示的に指定することで、コードの可読性や保守性を高め、
  //型エラーを早期に発見しやすくなるというメリットがあります。

  useEffect(() => {
    //async非同期通信を行うコード、他にも使うコードがある。
    //非同期通信は、asyncのコードの中にaweiteコードを使う(await は、async 関数の中で使用できるキーワードで、Promise の完了を待ちます。)
    /** 🌸asyncを使った非同期の説明以下🌸
     * async は関数を非同期関数として定義するキーワード。
     * async 関数は常に Promise を返す。
     * await は async 関数内で Promise の完了を待つ。
     * async/await で非同期処理を同期的に記述可能。
     *
     * Promise は非同期処理の状態を表すオブジェクト。
     * 状態は pending(処理中), fulfilled(正常終了), rejected(異常終了) の3つ。
     * 非同期処理の結果が返ってくるまで Promise が状態を保持し、結果が返ってきたら状態が変化する。
     */
    /*🌕asyncコードを使った非同期通信のひな形
      
      try {
          非同期の処理をするコードを書く(awaiteを付ける)
      　promiseの値がfulfilled(正常終了)の時に行うコードを書く
        } catch (error) {
        rejected(異常終了)の時の処理を書く
        }
      結論：解釈はおおむね正しいですが、より正確に表現すると以下のようになります。

      async 関数内では、await を使って Promise の完了を待ちます。try...catch ブロックは、Promise が rejected 状態になった場合に発生するエラーを捕捉するために使用されます。fulfilled 状態の場合の処理は、try ブロック内に記述します。

      詳細な解説

      async 関数内で await を使うと、Promise が fulfilled または rejected 状態になるまで処理が一時停止します。

      fulfilled の場合: Promise が正常に完了（fulfilled）すると、await 式はその結果の値を返します。その後、try ブロック内の後続のコードが実行されます。
      rejected の場合: Promise がエラーで完了（rejected）すると、await 式はエラーをスローします。このスローされたエラーは、catch ブロックで捕捉されます。
    🌕*/
    const fetchUser = async () => {
      try{
        //ローディングを開始
        setLoading(true)
        //以下のコードは疑似的にfetchアクセス状態を作ってるコードです。本来はawait fetch('https://example.com/data'); // 非同期処理（fetch）の様に書く
        /*await new Promise(resolve => setTimeout(resolve, 1000)) の詳細🌟で囲われた箇所が重要🌟

          このコードは、まさに擬似的な遅延（遅らせる処理）を表現するために書かれたもので、🌟実際の fetch などの非同期処理の代わり🌟として使われます。

          new Promise(resolve => ...): 新しい Promise オブジェクトを作成しています。Promise は非同期処理の状態を管理するオブジェクトです。
          resolve => setTimeout(resolve, 1000): Promise の中身を定義する関数です。resolve は Promise を fulfilled 状態にする関数で、setTimeout を使って
          1000ミリ秒（1秒）後に resolve を呼び出しています。reject は Promise を rejected 状態にする関数ですが、このコードでは使用されていません。
          await: await キーワードは、async 関数の中で使用できます。await は、Promise が fulfilled または rejected 状態になるまで、処理を一時停止します。

          今回のawait new Promise(resolve => setTimeout(resolve, 1000))の流れ以下
          今回の await new Promise(resolve => setTimeout(resolve, 1000)) の場合、

          Promise が作成された直後は pending 状態です。
          1秒後、setTimeout によって resolve 関数が呼び出されます。
          resolve が呼び出されると、Promise の状態は fulfilled に変わります。
          await は Promise が fulfilled 状態になったことを検知し、処理を再開します。
          つまり、ご認識の通り、今回の擬似 fetch は1秒後に resolve が実行されて、Promise は fulfilled 状態になります。

          🌟//上記のawait new Promise(⛅resolve⛅ => setTimeout(resolve, 1000))のコードに対する全体的説明とは異なり。
          今回は、⛅のイラストで囲まれた「resolve」について、※resolveの⛅で囲まれたコードは以下の様にも書くことができる➡
          (resolve, reject)の様に書ける。(resolve, reject)や⛅で囲まれた「resolve」は、Promise を作成する際に渡す特別な関数
          （「実行関数」または「executor関数」と呼ばれます）の引数です。以下詳しい説明
          普通の関数の引数との違い→🚙 キーワードは⚡で囲まれた文
            →🚙 普通の関数の引数は、関数を呼び出す側が値を渡します。しかし、Promise の (resolve, reject) は、
            💡Promise を作成する際に ⚡JavaScript が自動的に渡してくれる⚡関数💡です。私たちは、
            Promise の中身を記述する関数の中で、これらの関数を適切なタイミングで呼び出すことで、
            「約束の成功」または「約束の失敗」を Promise に伝える役割を担います。

              まとめ
              new Promise((resolve, reject) => { ... }) の (resolve, reject) は、
              Promise の中身を記述する関数に JavaScript が自動的に渡してくれる特別な関数です。
              resolve は「約束の成功」を、reject は「約束の失敗」を Promise に伝える役割を持ちます。
              これらは、Promise の状態を変化させるための重要な仕組みです。
            🌟//
        */

        //この1つ前の長いブロックのコメントアウトを一読すると以下のコードが理解できるが、簡潔に以下の処理が何をやってるか説明すると
        //await→この処理(※💝) が終わるまでは、この後に書いてある処理を待ってくださいって言ってる、じゃあ、この処理って(以下)  
        //new Promise(resolve => ...): 新しい Promise オブジェクトを作成しています。t、今回はsetTimeoutの中のresolveを実行することで
        //fulfilled (履行済み、成功)の結果が得られる。この結果を得たら、これ以降のの処理が実行される
        await new Promise(resolve => setTimeout(resolve,1000))

        //ダミーデータ
        /*interface User{
            id:number
            name:string
            email:string
            status:'online' | 'offline'
          } 
          で設定した型を以下のdummyUserの設定にあたり、型注釈として、:Userを設定
      */
        const dummyUser:User = {
          id:1,
          name:"山田太郎",
          email: "yamada@example.com",
          status:"online"
        }

        //ユーザー情報を設定 dummyUser上記で設定した、const [user, setUser] = useState<User | null>(null)のsetUserで更新
        //ここで、ダミーデータとしてuserの情報をセットする意図→疑似的fetchでuser情報を取得してきたと仮定する為
        setUser(dummyUser)
        //errorを空にする
        setError('')
      } catch(err){
        //エラー処理
        setError("ユーザー情報取得に失敗しました")
        setUser(null)
      } finally{
        //ローディング終了
        setLoading(false)
      }
    }

    fetchUser()//上記の関数実行
    //以下の[]の意図を含めて、useEffectのコードの概略
    /*
      ※1useEffectは、コードの実行を完全に遅らせるのではなく、レンダリング後や特定の条件を満たした後に実行されるようにスケジュールします。
      ※2 ※1を詳しく具体例を交えて解説
        useEffectを使う事で、以下の様なコードを書いた際
        
        useEffect(() => {
        　console.log("2番目")//このコードを後にとして簡略して表示する
        },(※この部分のコードには③の質問に関連する))
        console.log("1番目")
        useEffectは、コンポーネントのレンダリングが完了した後（画面に表示された後）に実行されます。
        そのため、console.log("1番目") が先に実行され、その後で useEffect 内の console.log("2番目") が実行されます。
        「遅延」ではなく、「レンダリング後に実行される」という性質を持っています。

      ※3useEffectのひな形としては、
      useEffect(() => {
      　console.log("2番目")//このコードを後に🌟として簡略して表示する
      },🌻(※この部分のコードには③の質問に関連する))
      🌻の部分の記載方法としては、
      🌻の部分のコードの記載なし: コンポーネントがマウント（初回レンダリング）された後、および再レンダリングされるたびに useEffect が実行されます。
      🌻の部分が空配列 [] の場合: コンポーネントがマウントされた後一度だけ useEffect が実行されます。
      🌻の部分に変数（値）を指定した場合: 指定した変数の値が変更された場合に useEffect が実行されます。※🌟

      上記の※🌟の具体例が
      スプレッドシートのフロントエンジニア学習メモのuseEffectの解説タブを見ると、少しは理解できるかも
    */
  },[])

  //この後条件分岐によりreturn文が複数存在するが、複数returnがあっても条件分岐をしてるので問題ない
  //loadingはboolean、true or false
  if(loading) {
    return <div>読み込み中...</div>
  }


  //errorの値はuseStateで設定してある、初期値は空白又は疑似fetchが成功後も空白になる。エラーの中身が存在すれば、表示
  if(error) {
    return <div className="error">{error}</div>
  }

  if(!user) {
    return <div>ユーザーがみつかりません</div>
  }

  return (
    <div className="user-rofile">
      <h2>ユーザープロフィール</h2>
      <div className="user-info">
        <p>名前: {user.name}</p>
        <p>メール: {user.email}</p>
        <p>状態:  {user.status === 'online' ? 'オンライン' : 'オフライン'}</p>
      </div>
    </div>
  )
}

export default UserProfile