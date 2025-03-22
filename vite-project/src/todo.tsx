import { useState } from "react";

//"Todo"型の定義をコンポーネントの外で行います
type Todo = {
  content: string; //プロパティ content は文字列型
  readonly id: number;
}

//Todo コンポーネントの定義
//React.FC→変数にコンポーネントを格納する時のやりかた
const Todo:React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);//"Todo(typeで設定した)"の配列を保持するステート
  const [text, setText] = useState('');//フォーム入力のためのステート
  const [nextId, setNextId] = useState(1) //次の "Todo" のIDを保持するステート

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

  return (
    <div>
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
          onChange={(e) => setText(e.target.value)} //入力値が変わった時にステートを更新
        />
        <input type="submit" value="追加" /> 
      </form>
      <ul>
        {todos.map((todo) => (
          //key 属性: 各リスト項目に一意の識別子を設定し、React が効率的に変更を追跡できるようにします。
          <li key={todo.id}>
            <input 
              type="text"
              value={todo.content}
              onChange= {(e) => handleEdit(todo.id, e.target.value) }
            />
          </li>//todoのリストを表示
        ))}
      </ul>
    </div>
  )
}

export default Todo;