import { UserForm } from "../hooks/userForm";
import localforage from "localforage";//localforage採用につき追加
import { useEffect, useState } from "react";

//以下の設定を🌞とする
interface UserForm {
  name:string;
  email:string;
  [key:string]: string;
}


function CustomHookDemo() {
  //一時的な初期値 ※<UserFormはカスタムフックではなく上記の🌞の印のinterfaceで設定した方のUserForm型注釈として活用
  /*localforage追加で以下のコードを変更 
    const [storedUser, setStoredUser] = useState<UserForm>({
      name: '',
      email: ''
    });
  */
 // ローカルストレージからのデータ取得
  const [storedUsers, setStoredUsers] =useState<UserForm[]>([]);
  //localforageの追加によって追加されたコード
  //初期値データを localforage から取得
  /*今一度useEffectの機能
   前段階として、useEffectと関連深いレンダリングとはデータや処理を人間が視覚的に確認できる様にする事

   useEffectを活用する場面は→レンダリングに適さない場面➀Promise ➁DOM(addEventListener)➂connection(chatサーバーへのアクセス)
    →処理をして画面を表示するまでにタイムラグがある場合、レンダリング、即座に画面表示する事が困難な場合に処理する
    その為に、useEffectの効果として、useEffectに設定した関数は、レンダリングフェーズにではなく、レンダリング後に実行する

    簡潔的には
    ✨useEffect は、レンダリング後に実行される副作用（サーバー通信、イベントリスナー設定、外部データ取得など）を処理するための React フック。
    通常、画面表示に即座に影響を与えない処理（非同期通信、DOM操作、サーバー接続など）を実装する際に使用する。✨

  */
  useEffect(() => {
    const fetchStoredUser = async () => {
      try {
        //localforage というライブラリを使って、ブラウザのストレージから 'users' というキーに保存されているデータを取得する処理 です。
        //localforage.getItem<UserForm[]>	:localforage からデータを取得し、UserForm[] 型として受け取る
        //※ローカルストレージや IndexedDB などのストレージには、キーと値のペアでデータを保存します
        const users = await localforage.getItem<UserForm[]>('users') 
        if (users) {
          setStoredUsers(users) // ローカルストレージから取得したデータをセット
        }
      } catch (error) {
        /*
          console.log と console.error の違い
          console.log():  通常のログ出力        「Console」タブの "message"（通常のログ）に表示
          console.error():エラーメッセージの出力 「Console」タブの 🌟"error"（エラー）に表示🌟（赤色）
        */
        console.error('Error fetching data from localforage:', error)
      }
    };

    fetchStoredUser()
  }, [])//[]初回のみ実行
  //カスタムフックである、フォームフックの使用
  /*以下のコードの説明
    UserForm<UserForm>
    カスタムフックのUserForm<上記のinterface🌞のUserForm>
    <上記のinterface🌞のUserForm>の部分がカスタムフックで設定した<T>のところ
  */
  //useForm.tsで設定したinterface通り、Tには共通の要素がはいる
  //つまり、initialValutesで設定した値が、onSubmit validatesのvaluesにもstoredUserの値が適用される
  const form = UserForm<UserForm>({
    initialValues: { name: '', email: '' }, // 初期値をリセット可能に
    onSubmit: async (values) => {
      /*jsの変数を文字列と一緒にconsole.logで表示する方法として、以下の3つ方法があります。
        ➀console.log(`Form submited${values}`)
        ➁console.log("Form submited" + values)
        ➂console.log('Form submited', values) ←今回のコード
        なぜ、➀・➁の方法が採用されず、➂の方法のコード記述が採用されているのか
        それは➀、➁はconsoleに表示される際にvaluesがObjectと表示されるから
        ➂はオブジェクトの中身が確認できる様に表示されるから
      */
      console.log('Form submited', values);


      /*setStoredUsers(values);🌹 
        ローカルストレージを活用前は上記のコード１文で値の更新をしていたが、
        活用後からは以下のコード2行という、値の慎重的な更新の仕方をするコードになった。
        詳細:chatgpt コードに関する質問タブ 以下のワードで検索:ローカルストレージ活用前後の onSubmit の違い 🌟表を参照🌟
        なぜ、ローカルストレージを活用するにしても、😲なぜ、上記の1文での値の更新のコードではなく2行のコードになったのか？😲
        chatgptの解答の表を以下に転記スクロールして内容を熟読内容必ず理解必要
        
        比較項目         |    Ⓐローカルストレージ活用前のコード🌹                |      Ⓑローカルストレージ活用後🌻以下のコード
        ➀データの管理方法  |  1 人のユーザー情報だけを扱うA➀	                   |   複数のユーザー情報をリストとして管理
        ➁状態更新の方法	  |  setStoredUser(values);（ 1行で上書き）A➁           |	   setStoredUsers([...storedUsers, values]); （配列を新しく作って更新）
        ➂データの保存先	  |  メモリ上のみ (useState で管理)A➂                   |   ローカルストレージに永続保存 (localforage.setItem)
        ⓸データの消失リスク|	ページをリロードすると消えるA⓸	                   |  ページをリロードしても保持される    
      */

      /*...storedUsers で既存のユーザー情報を展開。
      valuesで新しい values(ユーザー) を✨追加✨ [...storedUserm, values(💡この部分)]※更新でなく『追加』になる点に注意
      */
      const updatedUsers = [...storedUsers]
      if(values && !storedUsers.some((user) => user.email === values.email)){
        const updatedUsers = [...storedUsers, values]// 新しいユーザーを追加
        /*
          users(複数のユーザデータ→以前入力したデータも含めて複数のユーザのデータとして値の更新) 以下の様な形態で保存される
          [{※userAの情報 name:"UserA", email:"userA・・(省略).com"}, {※UserBの情報 name:"UserB", email:"userB・・(省略).com"}]
        */
        setStoredUsers(updatedUsers)// メモリ上の状態を更新
      }else{
        console.log("同じメールアドレスの登録があります。")
      }
      /*
        ・await は async 関数の中でしか使えない
        ・await は Promise を待つために使う
        ・非同期処理（APIリクエストなど）を書くときに async / await をセットで使うのが一般的

        async と await はセットで使う？→	✅ 基本的にセットで使う
        await だけ書いたらどうなる？→	❌ エラーになる（async の中で使う必要がある）
        useEffect の中で async を使うには？→	✅ 関数を定義して、その中で async / await を使う！
        .then() でも非同期処理は書ける？→	✅ 書けるが async / await のほうが読みやすい！
       */
      try {
        /*以下のlocalforage.setItem()の中は、文字列キー：値 の様なオブジェクト形式で格納される→
          文字列usersがキーで
          値がオブジェクト形式のユーザーの情報ex {name:"sutou", email:"sutou@example.com"}という形式
        */
        await localforage.setItem('users',updatedUsers)  //ローカルストレージに保存
        
      } catch (error) {
        console.error('Error saving data to localforage:', error)
      }
      form.resetForm()
    },
    validate: (values) => {
        //以下のコードにでてくる、UserForm はカスタムフックの UserForm ではなく、上記のinterface の UserForm です！
      const errors:Partial<Record<keyof UserForm, string>> = {};
      if(!values.name) errors.name = '名前を入力してください' //入力値の名前の欄が空欄だった場合のエラー表示
      if(!values.email) errors.email ='メールアドレスを入力してください';//入力値のemailの欄が空欄だった場合エラーを表示
      return errors
    },
  });

  return(
    <div className="custom-hook-demo">
      <section>
        <h2>フォーム</h2>
        <form onSubmit={form.handleSubmit}>
          <div>
            <label>
              名前：
              <input
                type="text"
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
              />
            </label>
            {/* inputのname="name"要素の値が存在する時の()のhtmlを表示させる */}
            {form.errors.name && (
              <span className="error">{form.errors.name}</span>
            )}
          </div>
          <div>
            <label>
              メール:
              <input
                type="email"
                name="email"
                value={form.values.email}
                onChange={form.handleChange}
              />
            </label>
            {form.errors.email && (
              <span className="error">{form.errors.email}</span>
            )}
          </div>
          {/* disabled={form.isSubmitting}の解説
              form.isSubmittingの値は、true or falseをとる
              disabled = true ←非活性化を有効にする
              disabled = false ←非活性化を解除する
              という意味
           */}
          <button type="submit" disabled={form.isSubmitting}>
            {/*以下のコードは3項条件式 */}
            {form.isSubmitting ? '送信中...' : '送信'}
          </button> 
        </form>
      </section>
{}
      <section style={{maxHeight: '400px', overflow: 'auto'}}>
        <h2>保存されたデータ</h2>
        <div>
          {storedUsers.map((user,index) => (
            <div key={index}>
              <p>名前: {user.name}</p>
              <p>メール: {user.email}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 

export default CustomHookDemo;