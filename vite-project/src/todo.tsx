import { useState, useEffect } from "react";
import localforage from "localforage";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api";
import type { Todo } from './types';
import TodoItem from "./components/TodoItem";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'//DnD用に追加

//"Todo"型の定義をコンポーネントの外で行います
/*以下のコード Type Todoからinterface Todo
  に変更してます。
  テキストにはその理由として、type指定だとexportできないから
  と言ってるが決してそんな事はない、type指定でもexportできる
  しかし、ここはテキストの指示に従って、interfaceに変更する
  ※注意上記のtype指定ではexportできないとテキストでいってるわけではないので注意
  ⭐️interfaceではextendsを用いて他のインターフェースを拡張（継承）できます。
  (type指定は無理)以下例示
    interface BaseTodo {
      id: number;
      content: string;
    }
      以下の様に継承した上でextendsを用いて拡張できるinterfaceのみ
    interface Todo extends BaseTodo {
      completed_flg: boolean;
      delete_flg: boolean;
    }⭐️まで

 */
/*types.tsで設定してある為以下をコメントアウト
export interface Todo {
  content: string; //プロパティ content は文字列型
  readonly id: number;
  completed_flg: boolean;//タスクの完了/未完了を判定する
  delete_flg: boolean;//削除に関するフラグ
}*/

//以下のコードの詳細はテキストReact_チュートリアル_4参照
type Filter = 'all' | 'completed' | 'unchecked' | 'delete'

//Todo コンポーネントの定義
//React.FC→変数にコンポーネントを格納する時のやりかた
const Todo:React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);//"Todo(typeで設定した)"の配列を保持するステート
  const [text, setText] = useState('');//フォーム入力のためのステート
  const [nextId, setNextId] = useState(1) //次の "Todo" のIDを保持するステート
  //上記で設定したtype Filterの各々の値が状況に応じて格納される。
  const [filter, setFilter] = useState('all')

  //useEffect フックを使ってコンポーネントのマウント時にデータを取得
  /*
  useEffect(() => {
    localforage.getItem('todo-20250405').then((values) => {
      if(values){
        setTodos(values as Todo[])
      }
    })
  }, []);

  // useEffect フックを使って todos ステートが更新されるたびにデータを保存
  useEffect(() => {
    localforage.setItem('todo-20250405', todos)
  }, [todos])
  */

  //コンポーネントマウント時にRails APIからデータを取得
  /*疑問点、なぜ、localhost:3318(Mysqlのポート)ではなく、localhost:3031にfetchしてるのか
    「MySQL に直接アクセスしてる」のではなく：
        Node.jsなどのバックエンドが、MySQL（3318）にアクセスしてくれている
        そしてその結果を React に返している
        という構成になっています。

   */  
  useEffect(() => {
    fetch("http://localhost:3031/api/v1/todos")
    .then(response => response.json())
    .then(data => setTodos(data))
    /*fetchTodos().then(data => {
      const sorted = [...data].sort((a, b) => b.id - a.id);
      setTodos(sorted);
    }) //全てのタスクを取得*/
  }, [])
  
  const handleLocalForageRemove = () => {
    localforage.removeItem('todo-20250405').then((values) => {
      setTodos([])
    })
  }

  //フィルタリングされたタスクリストを取得する関数
  const getFilteredTodos = () => {
    /*
      const [filter, setFilter] = useState('all')
      でセレクトボックスの選択値が更新されるたびにその値がfilterに格納される
      以下のswitchでは選択された、セレクトボックスの値によって処理を分岐
    */
    switch(filter) {
      case 'completed':
        //完了済み **かつ** 削除されていないタスクを返す
        //filter:配列の中から、条件に合致したデータを抽出して、新しい配列を作る
        /*🎉⭐️filter と map の違い
          💐filter:「ある条件を満たす要素だけを集めたい」場合に使用する
          🩷map:すべての要素に何らかの処理を施したい」場合に使用する

          🎆🎈filterは「選択」、mapは「変換」のためのメソッド 🎈🎆
         */
        return todos.filter((todo) => todo.completed_flg && !todo.delete_flg);
      case 'unchecked':
        //未完了 **かつ** 削除されていないタスクを渡す
        return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg);
      case 'delete': 
        //削除されたタスクを渡す
        return todos.filter((todo) => todo.delete_flg);
      default:
        //削除されていないすべてのタスクを渡す
        return todos.filter((todo) => !todo.delete_flg);
    }
  }

  //セレクタの変化に応じて、filterの値を更新するもの
  const handleFilterChange = (filter:Filter) => {
    setFilter(filter);
  }

  //🚩注目🚩以下のジェネリック関数を使って、handleEdit,handleCheck, handleRmoveを統一する。呼び出し側でも
  /*以下は表は、V extends Todo[K]の解説
  ✨🌹つまり、V extends Todo[K]の意図はTodoがjavascriptオブジェクトなので以下の様な構成のため
  →key:value Todo[K]つまり、Vはvalueの型であること、つまり、型注釈をしていしてる✨🌹
  上記の✨🌹の説明と以下のtype Todoの構成を踏まえて以下の表を参照すること
  ※参照
  type Todo = {
    content: string; //プロパティ content は文字列型
    readonly id: number;
    completed_flg: boolean;//タスクの完了/未完了を判定する
    delete_flg: boolean;//削除に関するフラグ
  }
  ※
    K	          Todo[K]の型	Vの期待される型
   "content"	  string	    string
   "id"	        number	    number
   "delete_flg"	boolean	    boolean
  */


  //🌟のコード
  //Todo配列の中から指定されたidのTodoを探して、指定されたプロパティ（key）の値だけを更新して、新しい配列を返す関数
  /*const updateTodo =<T extends keyof Todo>(todos:Todo[], id:number, key: T, value:Todo[T]): Todo[] => {
    return todos.map((todo) => {
      if(todo.id === id) {
        return {...todo, [key]:value}
      }
      return todo;
    })
  }*/

  //🌕これを上記の//🌟のコードを使い変更→このコード🌕と以下のコード🌕はジェネリック関数上記の🌟を使い簡易化できる
  const handleRemove = (id: number, delete_flg: boolean) => {
    setTodos((todos) => {
      /*mapの以下のコードは
        削除ボタンを押したidと既存のタスクの中のid
        が一致した場合にdelete_flgの値を更新する。
        必要な部分を更新したら、
        更新済みの全要素を作り、更新済みの全オブジェクトをsetTodosに格納する
        ことで、useStateによりtodosが今回の更新を反映されたものへと変更が加味される

       */
      const newTodos = todos.map((todo) => {
        if(todo.id === id) {
          /*以下の[delet_flgの部分は、!delete_flgではないのか？]に関する疑問
            →このhandleRemoveを実行する際に引き渡す引数の時点で
            !todo.delete_flgの様に渡していることで、以下の様に
            delet_flgとして一見変化がない様に見えても、反映される
          */
          return {...todo, delete_flg}
        }
        return todo;
      });

      return newTodos;
    })
  };
  
  //🌕これを上記の//🌟のコードを使い変更→このコード🌕と以下のコード🌕はジェネリック関数上記の🌟を使い簡易化できる
  /*どの todo がチェックされたのかを特定するために id と completed_flg 
    プロパティの値を引数として受け取ります。その後todo 
    オブジェクトの completed_flg プロパティを更新します。
   */
  const handleCheck = (id: number, completed_flg: boolean) => {
    /*setTodos((todos) => { //配列型に格納されたタスクを1つずつ取り出す
      const newTodos = todos.map((todo) => {//一つずつ取り出した各要素を取り出してる
        if (todo.id === id) { //checkboxにチェックしたら、completed_flgの値を変える
          return { ...todo, completed_flg }
        }
        return todo;
      });

      return newTodos
    })*/
   //setTodos((todos) => updateTodo(todos,id, 'completed_flg', completed_flg))
  }

  //🌕これを上記の//🌟のコードを使い変更→このコード🌕と以下のコード🌕はジェネリック関数上記の🌟を使い簡易化できる
  const handleEdit = (id:number, value:string) => {
    /*
     setTodosはuseStateに保存してあるものの中で該当するid
     の値を更新して、useStateの保存状態を更新
     */
    
    setTodos((todos) =>{ 
      /**
       * 引数として渡された todoのidが一致する
       * 更新前の todos ステート内の todo の
       * value プロパティを引数 value(=e.target.value編集した値)に置き換える
       */
      /*次のコードを行うまではtodosをmapでバラす前の状態のもの
       javascriptオブジェクトの状態{content: string, id:number}※🌕
       つまりtodosは、配列に格納されたjavascriptオブジェクトを1つずつばらした状態
       */
      const newTodos = todos.map((todo) => {
        //編集した場所のidと保存してある配列の要素のidが同じだったら、値を更新する
        if (todo.id === id) {
          /*以下の⭐️のコメントアウトの様に直接useState
           を編集するのではなく、🌞の様に新しいオブジェクトを生成して、から修正する
          */
          return {...todo, content:value}//🌞
          //⭐️todo.content = value⭐️
        }
        /*上記の条件文にあてはまれば、contentの値が更新され
         あてはまらなければ、contentの値はそのまま
        */
        return todo;
      });

      console.log('=== Original todos ===')
      todos.map((todo) => {
        console.log(`id:${todo.id}, value:${todo.content}`)
      })
      
      // todosステートを更新
      return newTodos//これをreturnすることで、setTodos(newTodos)でtodosの中身が更新される
    })
  }

  //todos ステートを更新する関数
  //新しいTodoを新規作成する関数
  const handleSubmit = () => {
    //何も入力されていなかったらリターン
    if(!text) return;

    //新しい "Todo" を作成
    //:Todo→型注釈
    //以下のコードをコメントアウトし🌟印の新コードを追加
    /*const newTodo: Todo = {
      content: text, //text ステートの値をcontent プロパティへ
      id:nextId,
      //初期値は false
      completed_flg: false,
      //初期値は false
      delete_flg: false,//タスク作成時点においてはfalse
    };
    /** 
     * 更新前の todos ステートを元に
     * スプレッド構文で展開した要素へ
     * newTodo を加えた新しい配列でステートを更新
    **/
   /*以下のコードの書き方に対する違和感
    React + TypeScript 基礎編では[]の中身の書き方の順序が本コード(以下)と逆だった
     [...prevTodos, newTodo]);
    書き方①[newTodo, ...prevTodos])と② [...prevTodos, newTodo]);の書き方の違い
    ⭐️どちらも書き方としては有効⭐️ただし以下の違いが生じる
    例：例えば prevTodos = ['A', 'B', 'C'] のとき、newTodo = 'X' を追加する場合
    ①[newTodo, ...prevTodos])→(結果)['X', 'A', 'B', 'C'] 新しいものを 上に追加（最近のを先に）
    ②[...prevTodos, newTodo])→(結果)['A', 'B', 'C', 'X'] 新しいものを 下に追加（古い順に並ぶ）
    */
    //setTodos((prevTodos) => [newTodo, ...prevTodos]);

    //localforageをやめてrails のmysqlと連携するために追加
    //Rails API に新しいTodoを送信し、レスポンスをステートに追加する
    /*以下のfetchを使った書き方とasync/awaitを使った書き方
      await後の処理、.thenの処理は、非同期の処理の完了をもってから
      実行される
    */
    /*fetch("http://localhost:3031/api/v1/todos", {
      method:"POST",
      headers: {
        //サーバーへ送るファイルはJSONファイルであることを宣言
        "Content-Type": "application/json"
      },
      //送るデータをJSON形式に変換
      body:JSON.stringify(newTodo),
    })
    .then(response => response.json())
    .then(data => setTodos([data, ...todos]))


    setNextId(nextId+1);//次の ID を更新

    //フォームへの入力をクリアする
    setText('');*/
    //新規コード🌟
    const newTodo: Omit<Todo, 'id'> ={
      content: text,//useStateでフォームの入力値が取得されてる
      completed_flg: false,
      delete_flg: false,
      sort:0,
    };

    createTodo(newTodo).then(data => {
      setTodos((prevTodos) => [data, ...prevTodos]);//今回追加したTodoを先頭に追加する事で、配列の中身が新しいものが先にくる
      setNextId(nextId+1)//次のTodoIDをインクリメント
      setText('')//フォームの入力をクリア
    });
  };

  const handleDragEnd  = (result: DropResult) => {
    //result.destination:ドラッグしたアイテムが「どこにドロップされたか」を表す情報です。
    //result.destination …ドラッグ先の情報（どのリストの何番目に置いたか）
    /*!result.destination→ドラッグ先の情報がない
      →ドラッグがキャンセルした場合のこと？
     */
    if (!result.destination) {
      console.log("ドラッグがキャンセルされました");
      //処理を終わらす
      return;
    }
    //もとの todos 配列をそのままコピーして新しい配列を作り、newTodos に格納します。
    /*「todos と同じ要素を持つ別の配列」が作られます（浅いコピー）。
      この新しい配列を操作しても、元の todos はそのまま残るので、
      React の不変性（イミュータブル）なステート管理にも適しています。
      🔰eact でステートを扱うときは、必ず「新しい配列／オブジェクト」を作って更新するのがベスト🔰
      ⛳️Array.from やスプレッド構文（[...todos]）でコピーを取った上で操作します⛳️
      🌼💡const newTodos = Array.from(todos)の代わりに
        🎀const newTodos=[...todos]🎀
        でも良い💡🌼
    */
    const newTodos = Array.from(todos);
    /*const [movedTodo] = newTodos.splice(result.source.index, 1);//①
      newTodos.splice(result.destination.index, 0, movedTodo);//②
      のコードについて、
      概略は、並び替え作業をやってる、
      ①のコード：元の位置のtodoを削除して
      ②のコード：並び替えとして、新しい位置に追加挿入してる
    */
    
    /*newTodos.splice(result.source.index, 1);について
      ✅spliceについて、以下のurlを参照して、spliceの基本的な使い方の項を熟読
        🟢https://pikawaka.com/javascript/splice 参照 spliceの基本的な使い方の項
        🟡spliceメソッドは配列に対して使うことができるメソッドです。
          配列の要素を追加、削除、または置換するために使用されます。
        🔵配列.splice(start, deleteCount, item1, item2, ..., itemN)の様に書く
        🟣spliceの実行後のtodoは削除要素を除いた配列となる、破壊的になる以下の実行例の🌕の場所参照
          const array = [1, 2, 3, 4, 5];
          const removed = array.splice(2, 1);

          console.log(array); // [1, 2, 4, 5]//破壊的になる🌕
          console.log(removed); // [3]
      result.source …ドラッグ元の情報（どのリストの何番目から持ってきたか）を表す
    */
    /*🌼const [movedTodo] について🌼🎉重要
      1.splice で削除されたタスクを「要素１つの✨配列✨」として受け取り
       tdos= [{name:"suzuki",age:18}, {name:"tanaka", age:25},・・・・]
       toodosが上記の様であった場合、
       spliceの実行結果 は、[ {name:"kondou", age:30} ]//🟠と配列になる
      2.const [movedTodo] = … でその配列の中身（タスクオブジェクト
        上記の🟠の状態から、[movedTodo]の様に変数指定することで、
        ⭐️💎🌙{name:"kondou", age:30}の様なオブジェクトだけを取り出せる🌙💎⭐️
        🩷movedTodo に直接オブジェクトそのものが入る🟠の様な状態から、配列が
         除去された状態が格納🩷
    */
    //参照 https://codepen.io/sutou81/pen/ByydYvJ
    //移動元のindexから1つ削除する。移動元の情報を削除
    const [movedTodo] = newTodos.splice(result.source.index,1)
    //上記を実行後のnewTodosは上記の要素を削除した殘りの要素のみで構成されることになる
    //↑つまり、newTodosには削除された要素は含まれてない
    //↑以下のコードは削除要素以外で構成された配列に、並び替えの順番通りに挿入してる。
    newTodos.splice(result.destination.index, 0, movedTodo)

    //並び替え後のUIを即時更新
    setTodos(newTodos);
    console.log('並び替え後のTodos:', newTodos)

    //サーバー側に並び替え結果を非同期で送信
    /*以下のコードの解説※丸数時は以下のコードの//丸数字の箇所の説明内容
      ①forEach を使っている理由
        全ての並び替え済みアイテムに対して「順序情報をサーバーに送る」という副作用（API 通信）
        を発生させたいので map ではなく forEach を使います。map は「新しい配列を返す」
        ためのメソッドなので、ここでは不要です。

      ②todo.sort = index + 1; の意味
        UI 上のリスト順とサーバー側で持つ「並び順」を一致させるために、各項目に番号を
        振り直しています。これをサーバーに送り返すことで、次回ページを読み込んだときにも
        同じ順番で表示できます。

      ③updateTodo(todo.id, todo)
        これは先ほどまで使っていた Rails API の PATCH エンドポイントを叩く関数です。
        第１引数で更新対象の ID、第２引数で更新内容（ここでは sort を含む todo オブジェクト全体）
        を送信します。
        .catch(...) をつけているのは、もし通信に失敗したときに理由がわかるように
        エラーメッセージを出力するためです。UI にもエラーを通知したい場合は、
        ここでトースト表示を出したり、別のステート管理をしたりするとよいでしょう。

      ――まとめると、あなたの理解は正しく、あとは「サーバーとフロントの並び順を同期する」
      「非同期処理なのでエラーは必ずキャッチしておく」
    */
    newTodos.forEach((todo, index) => {//①
      todo.sort = index +1;//sort番号を1から順に割り振ってる
      updateTodo(todo.id, todo).catch((error) => {
        console.error(`Todo ${todo.id} の更新に失敗しました:`,error);
      })
    })
  }

  //物理的に削除する関数
  const handleEmpty = () => {
    /*「!todo.delete_flg」のfilterの意味
     つまり、delete_flgの値がtrueでないものを集めて新しい配列にしている
     →⭐️削除対処のタスク(delete_flgがtrue)のものを✨除いて✨⭐️新しい配列を作成して
     setTodosを用い更新している。
    */
    //setTodos((todos) => todos.filter((todo) => !todo.delete_flg))

    //上記の変わりに以下のコードにて対処する
    //物理的に削除する関数

    //以下のコードを①とする
    //①の意味としては→filter 元の配列から条件に合致するものだけを抽出して新しい配列を作る
    /*①のやってる事:todos(元のタスクが入った配列)から、delete_flgがtrueでないもの、
      つまり、delte_flg:falseのものを抽出して新しい配列として、filteredTodsに格納する
    */
    const filteredTodos = todos.filter(todo => !todo.delete_flg)//①

    //以下のコードを②とする。
    /*今回のコードは、const deletePromises〜.mapの処理の終わりまで。
      上記のコードは2つに大まかに分析できる
      (1)todo.filter(...)の処理
        →元のtodosから、格納されているjavascriptオブジェクトの
        delete_flgがtrueのものを抜き出し、新しい配列を作ってる。
      (2).map(todo =>.....)の処理
        →(1)で新しい配列を作成したのを受けて
          その配列要素をひとつひとつ取り出しapi(当タスクの箇所→todos/${todos})
          にアクセスしする、しかも、アクセスする形式として、'DELETE'だから
          当apiにアクセスし当タスクを削除要求をしている
    */
    const deletePromises = 
      todos.filter(todo => todo.delete_flg)
           .map(todo =>  deleteTodo(todo.id));//②
    
    //上記の②の処理が全てできれば、resove()として、.then以降の処理をする
    //Promise.all は並列非同期処理の待機に使われる関数
    Promise.all(deletePromises).then(() => setTodos(filteredTodos))
                        
  }

  const isFormDisabled = filter === 'completed' || filter === 'delete'
  return (
    <div className="todo-container">
      {/* localforageをリセットするボタン */}
      <button onClick={handleLocalForageRemove}>localforage消去</button>
      <section className="display-select">
        {/* 下記のonChangeのコードについて
          「as」を使う意味
          本来は as型 を使わずに、「値:型（型注釈）」で自然に型が合うように書く のがベスト
          asは、値 as 型
          「値と型が多少違くても型として一致してることにしてという、
          型注釈よりもゆるい設定の仕方」
         */}
        <select defaultValue="all" onChange={(e) => handleFilterChange(e.target.value as Filter)}>
          <option value="all">すべてのタスク</option>
          <option value="completed">完了したタスク</option>
          <option value="unchecked">現在のタスク</option>
          <option value="delete">ごみ箱</option>
        </select>
      </section>
      {/* フィルターが、'delete' の時は「ごみ箱を空にする」ボタンを表示*/}
      {filter === 'delete' && (
        <button onClick={handleEmpty}>
          ごみ箱を空にする
        </button>
      )} 
        {//フィルターが’completed'でなければ Todo 入力フォームを表示
        filter !== 'completed' && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();//フォームのデフォルト動作を防ぐ
              handleSubmit();//handleSubmit 関数を呼び出す。
            }} 
            className="especial"
          >
            <input 
              type="text" 
              value={text} //フォームの入力値をステートにバインド
              disabled={isFormDisabled}
              onChange={(e) => setText(e.target.value)} //入力値が変わった時にステートを更新
            />
            <button type="submit" disabled={isFormDisabled}>追加</button>
          </form>
        )}
        {/*まずは DragDropContext, Droppable, Draggable という3つのコンポーネントを
         import します。それぞれ Draggable はドラッグ対象のコンポーネント、 
         Droppable はドラッグ＆ドロップできる領域のコンポーネントになります。
         それらを DragDropContext で囲むことでドラッグ＆ドロップが可能になります
         ⭐️Droppable⭐️以下詳細
          説明: ドラッグしてアイテムを落とせる領域（ドロップできる場所）を定義します。
          例えば、Todoリスト全体がドロップできる領域になります
          使い方: Droppable の中に、実際にドラッグされる要素を配置します。provided から渡される 
          props で領域の設定をします
        */}
        {/*💥🩷テキストの解説も熟読必須🩷💥 */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {/*provided はあくまで「引数につけられた変数名」であって、
            JSX の中で Droppable が渡してくれるオブジェクト
            （innerRef や droppableProps、placeholder など）を受け取るためのラベルです
           */}
           {/*{...provided.droppableProps} は「provided 
            というオブジェクトにまとめて入っている属性をまとめて展開して、
            この要素に付与する」ための記法
           */}
           {/*ref={provided.innerRef} は「ライブラリがその <ul> 
           要素を直接触れるように、その実体（DOM ノード）を渡す」ための
           特別な属性
           */}
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {getFilteredTodos().map((todo, index) => (
                <Draggable
                  key= {todo.id}
                  draggableId={String(todo.id)}//todo.idを文字列化したもの
                  index ={index}
                >
                  {(provided, snapshot) => (
                    /*
                      * provided
                      役割：ライブラリが「この要素をドラッグ／ドロップ可能にするために
                      必要な情報」をまとめて渡してくれるオブジェクト
                      * snapshot
                        役割：ドラッグ／ドロップの「現在の状態」を表すオブジェクト
                    */
                    
                    <TodoItem
                      todo={todo}
                      updateTodo={updateTodo}
                      setTodos={setTodos}
                      todos={todos}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Todo;