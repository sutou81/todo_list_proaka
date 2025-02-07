import { useState, ChangeEvent } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'

import Components from './components/Greeting'
import ContactForm from './components/ContactForm'
import ProductList from './components/ProductList'
import UserProfile from './components/UserProfile';
import UserCard from './components/UserCard';
import UserList from './components/UserList';
import StatusButton, { ButtonStatus } from './components/StatusButton'; // `ButtonStatus` もインポート



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

  //StatusButton.tsxの関数の関連の設定
  //※今回独自で、StatusButton.tsxの type ButtonStatusをexportしたから以下のコードの記述ができる
  //テキストでは、以下のコードconst [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>('idle');

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
  const users:User[] = [
    {id:1, name:"山田太郎", email:"taro@example.com"},
    {id:2, name:"佐藤花子", email:"hanako@example.com"},
    {id:3, name:"西野二郎", email:"nisino@example.com"},
    {id:4, name:"加藤三郎", email:"kato@example.com"}
  ];

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
              items = {users}
              /* user という名前の引数を定義しており、その型注釈として User 型(上記🚩の箇所)を指定しています。
                つまり、「user という名前の変数は User 型である」ということを明示的に宣言しています。 */
              renderItem={(user: User) => ( //userにUser型を指定
                <div>
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                </div>
              )}

              //以下はkey={keyExtractor(item)}でkeyに設定する値を設定→key設定の為、効率的安全的値の更新の為
              keyExtractor={(user: User) => user.id}//userにUser型を指定
            />
          }
        />
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
      </Routes>
    </Router>
    
  )
}

export default App