import { useState, ChangeEvent, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'

import Components from './components/Greeting'
import ContactForm from './components/ContactForm'
import ProductList from './components/ProductList'
import UserProfile from './components/UserProfile';
import UserCard from './components/UserCard';
import UserList from './components/UserList';
import StatusButton, { ButtonStatus } from './components/StatusButton'; // `ButtonStatus` もインポート
import CounterDemo from './components/CouterDemo';
import CustomHookDemo from './components/CustomHookDemo';
import localforage from 'localforage';



/*🚩UserList関連でUserList関数を実行する前段階の型注釈を設定(type User)
  UserList関連の設定のUserListPropsのitem:T[]に格納するuser(※🚢)のjavascriptオブジェクト型のひな形設定(型注釈みたいなもの)
*/
type User = {
  id:number;
  name:string;
  email:string;
}


function App() {
  const info = {name:"山田",condision:"好調"};
  // countという状態を作成。初期値は0
  const [count, setCount] = useState(0)
  const [choice,setSelct] = useState(1)
  let new_count = 1

  //localforageを活用する上でのuseState
  /*以下で設定してある<User[]>のUserは上部で設定してある type Userのこと
    users は User 型の配列で、初期値として空の配列 ([]) をセットする」という意味になります。
   */
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true)


  //StatusButton.tsxの関数の関連の設定
  //※今回独自で、StatusButton.tsxの type ButtonStatusをexportしたから以下のコードの記述ができる
  //テキストでは、以下のコードconst [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>('idle');
  const fetchUsers = async () => {
    try {
      //ユーザーリストを取得
      const storedUsers = await localforage.getItem<User[]>('users');
      /*上記のusersをキーとするオブジェクト以外に
        userをキーとするフォームの入力ほぞんされた値のオブジェクトが存在し、それを取得してる
      */
      const storedUserForm = await localforage.getItem<User>('user')
      //combinedの意味:複数の要素を1つにまとめた状態
      let combinedUsers = storedUsers || []; // 初期値は空リスト
      
      // フォームで保存されたユーザーをリストに追加
      /* some()は、配列内に特定の条件を満たす要素が一つでも存在するかを確認するメソッドです。
        戻り値は真偽値（trueまたはfalse）となります。
        つまりフォームで新しく保存された1人のユーザー）がすでに combinedUsers（ユーザーリスト
        に含まれているかどうかを確認する ためのチェックです。
        ※なぜ、以下でlocalforageの値を更新せず、combineUsersの値を更新の処理をしてるのか？
        ⭐️→ ①まとめて localforage に保存するため→すぐに 
        localforage.setItem('users', combinedUsers);
        を実行すると、無駄な書き込みが増える
        ⭐️→すべてのユーザーリストを更新し終えた後に localforage に書き込むほうが効率的
      */
      console.log('ここだよ')
      console.log(storedUserForm)
      if (storedUserForm && !combinedUsers.some((user) => user.email === storedUserForm.email)) {
      //✨(※1)一時保存のcombinedUsersに入力したUserの情報(storedUserFormの値)を追加してる
      /*
        ✅ 目的:
        「重複を避けながら、フォームで追加されたユーザーをリストに追加する」
       */
      combinedUsers= [...combinedUsers, storedUserForm]
     }

     //✨(※2)上記の一時保存を受けて、localforage保存前段階の値の更新
     /*
      setUsers(combinedUsers); をしないと、画面に即座に反映されない
      ✅ 目的:
      「React の useState を使って users の状態を更新し、⭐️UI に即座に反映する⭐️」
     */
      setUsers(combinedUsers)

      /*✨※1:で、フォーム入力値をまとめて一旦別枠として保存
        ✨※2:で、view(UI/画面表示)更新する為、setUsersを更新
        ✨※1と※2の手順を受けて、改めて満を持して、localforageの値を更新
        更新されたユーザーリストをローカルストレージに保存
      */
      await localforage.setItem('users', combinedUsers)

      console.log('Fetched and combined users:', combinedUsers)
    } catch(error){
      console.error('Error fetching users from localforage:', error)
    } finally {
      setLoading(false)
    }
  };
  //localforageの仕組みを以下に組み込む
  useEffect(() => {
    

    fetchUsers()
  }, []);


  //StatusButton.tsxの関数の関連の設定
  const handlButtonClick = async () => {
    setButtonStatus('loading');
    //擬似的な非同期処理 1秒後に擬似的に成功したとする処理→await以下の処理
    await new Promise(resolve => setTimeout(resolve, 1000))
    setButtonStatus('success');
  }

  /*上記の🚢の箇所の続き、上記のtype Userの型注釈に沿って情報を格納
    ユーザーデータリスト(UserListProps(UserList.tsx)のジェネリックを活用して表示する前段階:情報の設定)
  */
  /*const users:User[] = [
    {id:1, name:"山田太郎", email:"taro@example.com"},
    {id:2, name:"佐藤花子", email:"hanako@example.com"},
    {id:3, name:"西野二郎", email:"nisino@example.com"},
    {id:4, name:"加藤三郎", email:"kato@example.com"}
  ];*/

  //UserCardの為の仕組み
  const dummyUser = {
    id:1,
    name: '山田太郎',
    email:'taro@example.com',
    age:25,
  }

  //UserCardの編集ボタンがクリックされたときの動作(親から子コンポーネントへデータを引き渡す仕組み)
  //この下の方のコードで、実際に子コンポーネントにデータを引き渡す処理あり→🌟
  const handleEdit = (id:number) => {
    alert(`ユーザーID${id}を編集します`)
  }

  //ボタンをクリックしたときの動作
  const handleIncrement = (value:number) => {
    setCount(count + value);
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) =>{
    setSelct(Number(event.target.value))
     
  }

  //UserList.tsxでの削除ボタン投下でlocalforageから削除してviewも削除を受けて更新する為のメソッド
  const handleDelete = async (index: number) => {
    try{
      /*array.filter((要素, インデックス) => 条件) 🌟filterメソッドの定型文
        要素 → 配列の各要素（今回の users の場合、{name, email} のオブジェクト）
        インデックス (i) → 各要素の配列内の位置（0, 1, 2...）

        const numbers = [1, 2, 3, 4, 5];
        const filteredNumbers = numbers.filter((num) => num !== 3);
        console.log(filteredNumbers); // [1, 2, 4, 5] ← 3 が削除された！

        🌕(_, i) とは？

        🌞_ は「この値は使わない」ことを意味する 慣習的な記号 です。（変数名に _ を使うことで「値を無視する」ことを明示）🌞
        i は「現在の要素が配列の何番目にあるか」を示す インデックス。
      */
      const updatedUsers = users.filter((_, i) => i !== index)//iがindexと同じものでないものだけを残し新しい配列を作る

      //上記で削除要素を削除後の配列でlocalforageの値を更新する
      await localforage.setItem('users', updatedUsers)

      //useStateのusersの値を更新する。
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Error deleting user', error)
    }
  }

  const handleNew = async () => {
    try {
      const updatedUsers = await localforage.getItem<User[]>('users')
      const update = updatedUsers || []
      setUsers(update)
      

    } catch (error) {
      console.error('Error updateing user', error)
    }

  }
  
  return (
    <Router>
      <Routes>
        {/* ホームページ */}
        <Route
        path="/"
        element={
          <div className="app">
            <h1>はじめてのReactコンポーネント</h1>
            <Components.Greeting name="太郎" />
            <Components.Farewell name="花子" />
            <Components.Message {...info}/>
            <div className="counter">
              <p>現在のカウント: {count}</p>
              <label htmlFor="">いくつ増やす</label>
              <select name="" id="upNum" onChange={handleSelect}>
                <option value="1">1</option>
                <option value="10">10</option>
                <option value="100">100</option>
              </select>
              <button onClick={() => handleIncrement(choice)}>
                +{choice} 増やす
              </button> 
            </div>
            <Link to="/contact">
              <button>お問合せフォーム</button>
            </Link>
            {/*商品リストページに切替*/}
            <Link to="/productList">
              <button>商品リスト</button>
            </Link>
            <Link to="/userprofile">
              <button>ユーザープロフィール</button>
            </Link>
            <Link to="/usercard">
              <button>ユーザープロフィールカード</button>
            </Link>
            <Link to="/userList">
              <button>ユーザーリスト</button>
            </Link>
            <Link to="/status_btn">
              <button>ステータスボタン</button>
            </Link>
            <Link to="/counter-demo">
              <button>カウンターデモ</button>
            </Link>
            <Link to="/custom-hook-demo">
              <button>カスタムフックデモ</button>
            </Link>
          </div>
        }
      />
        <Route path="/contact" element={
          /*問い合わせフォームのコンポーネントをここに設置する*/
          <ContactForm />
        } />
        {/* 商品リスト */}
        <Route path="/productList" element={<ProductList />} />
        {/* ユーザープロフィール */}
        <Route path="/userprofile" element={<UserProfile/>} />
        {/* ユーザーリスト */}
        <Route 
          path="usercard"
          element= {
            <UserCard 
              user={dummyUser}
              onEdit={handleEdit}
              isSelected={true}
            />
          }
        />
        {/* ユーザーリストUserListProps(UserList.tsx)の実行の為 */}
        <Route 
          path="userList"
          element= {
            //UserList<User>：ここでジェネリクスを使って、「このリストはユーザー情報を扱います」と教えています。
            <UserList<User> //ジェネリックスの型のパラメータを指定items renderItem keyExtractor
            /*以下のitemsに設定しているusersは上記のコード const [users, setUsers] = useState<User[]>([]);のusers
              つまり、上記のuseEffect(() => {
                const fetchUsers = async () => {}のコード内で、今までのuserのに入力した情報が以下のコードで更新せれ
                てusersの値が更新される
                combinedUsers= [...combinedUsers, storedUserForm]
                setUsers(combinedUsers)

             */
              items = {users}
              /*✨注目コメントアウト💐localforageの影響を受けて
               自前で用意して以下のusersから
               const users:User[] = [
                {id:1, name:"山田太郎", email:"taro@example.com"},
                {id:2, name:"佐藤花子", email:"hanako@example.com"},
                {id:3, name:"西野二郎", email:"nisino@example.com"},
                {id:4, name:"加藤三郎", email:"kato@example.com"}
              ];
                combiedUsers(combined:複数の要素を1つにまとめた状態
                つまり、combiedUsers:複数のユーザーの情報がまとまった状態のもの という意味)
                combiedUsersの中身は、今までに入力したuserの情報(オブジェクト)が、各々[]配列に格納されてる 以下参照
                combiedUsersの中身の例:[{name:"userA", email:"userA@email.com"}, {name:"userB", email:"userB@email.com"}]
                の様な状態のものが入ってる
              */
              /* user という名前の引数を定義しており、その型注釈として User 型(上記🚩の箇所)を指定しています。
                つまり、「user という名前の変数は User 型である」ということを明示的に宣言しています。型注釈してるだけ */
              renderItem={(user: User) => ( //userにUser型を指定
                <>
                <div>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
                
                </>
              )}



              //以下はkey={keyExtractor(item)}でkeyに設定する値を設定→key設定の為、効率的安全的値の更新の為
              keyExtractor={(user: User) => user.id}//userにUser型を指定
              isLoading={loading}
              onDelete={handleDelete}
              onUpdate={handleNew}
            />
          }
        />
        {/* ステータスボタン */}
        <Route 
          path="/status_btn"
          element={
            <div>
              <h2>状態を持つボタン</h2>
              <StatusButton
                status={buttonStatus}
                label="Click Me"
                onClick={handlButtonClick}
              />
            </div>
          }
        />
        <Route path="/counter-demo" element={<CounterDemo />} />
        <Route path="/custom-hook-demo" element={<CustomHookDemo />} />
      </Routes>
    </Router>
    
  )
}

export default App