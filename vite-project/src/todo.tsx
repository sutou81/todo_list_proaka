import { useState, useEffect } from "react";
import localforage from "localforage";


//"Todo"型の定義をコンポーネントの外で行います
type Todo = {
  content: string; //プロパティ content は文字列型
  readonly id: number;
  completed_flg: boolean;//タスクの完了/未完了を判定する
  delete_flg: boolean;//削除に関するフラグ
}

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
  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id:number,
    key:K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, [key]:value};
        }else{
          return todo;
        }
      })

      return newTodos;
    })
  }

  //🌟のコード
  //Todo配列の中から指定されたidのTodoを探して、指定されたプロパティ（key）の値だけを更新して、新しい配列を返す関数
  const updateTodo =<T extends keyof Todo>(todos:Todo[], id:number, key: T, value:Todo[T]): Todo[] => {
    return todos.map((todo) => {
      if(todo.id === id) {
        return {...todo, [key]:value}
      }
      return todo;
    })
  }

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
   setTodos((todos) => updateTodo(todos,id, 'completed_flg', completed_flg))
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
  const handleSubmit = () => {
    //何も入力されていなかったらリターン
    if(!text) return;

    //新しい "Todo" を作成
    //:Todo→型注釈
    const newTodo: Todo = {
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
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setNextId(nextId+1);//次の ID を更新

    //フォームへの入力をクリアする
    setText('');
  };

  //物理的に削除する関数
  const handleEmpty = () => {
    /*「!todo.delete_flg」のfilterの意味
     つまり、delete_flgの値がtrueでないものを集めて新しい配列にしている
     →⭐️削除対処のタスク(delete_flgがtrue)のものを✨除いて✨⭐️新しい配列を作成して
     setTodosを用い更新している。
    */
    setTodos((todos) => todos.filter((todo) => !todo.delete_flg))
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
      {filter === 'delete' ? (
        <button onClick={handleEmpty}>
          ごみ箱を空にする
        </button>
      ) : (
        //フィルターが’completed'でなければ Todo 入力フォームを表示
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
        )
      )}
      <ul>
        {getFilteredTodos().map((todo) => {
          return(
          //key 属性: 各リスト項目に一意の識別子を設定し、React が効率的に変更を追跡できるようにします。
            <li key={todo.id}>
              <input 
                type="checkbox" 
                checked={todo.completed_flg}
                disabled={isFormDisabled}
                // 呼び出し側で checked フラグを反転させる
                onChange={() => handleTodo(todo.id,  'completed_flg', !todo.completed_flg)}
              />
              <input 
                type="text"
                value={todo.content}
                disabled={todo.completed_flg}
                onChange= {(e) => handleTodo(todo.id, 'content', e.target.value) }
              />
              <button onClick={() => handleTodo(todo.id, 'delete_flg', !todo.delete_flg)}>
                {todo.delete_flg ? '復元' : '削除'}
              </button>
            </li>//todoのリストを表示
          )
        })}
      </ul>
    </div>
  )
}

export default Todo;