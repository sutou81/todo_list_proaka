import React from "react";
import { Todo } from "../types";// Todo 型をインポート(type.tsxより)
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";

/*Props（＝プロパティ）は
「親コンポーネント → 子コンポーネント」に値や関数を渡すための仕組みです。
 */
interface TodoItemProps {
  todo:Todo;
  index: number;// ドラッグアンドドロップのために必要なインデックス
  // handleTodo: <K extends keyof Todo, V extends Todo[K]>
  // (id: number, key: K, value: V) => void; // handleTodo を追加
  /*🎶🩷extendsの使い方 2種類ある 以下
        用途       |            文法例            |        役割
    ジェネリック制約 | <T extends SomeType>        | 型パラメータ T を SomeType をベースに制限する
    継承／拡張      | interface B extends A { … } | 型定義 A のプロパティを受け継いで拡張する
  */

  // updateTodoで更新のidと更新した内容(Todo)を引数にして更新する 以下の🌌の注釈参照(voidに関すること)
  updateTodo: (id: number, todo: Todo) => void //親コンポーネントに通知する関数を追加
  setTodos: (todos: Todo[]) => void //親のステート更新用の関数
  todos: Todo[];//親のステートを渡す
  provided: DraggableProvided;// ドラッグ用に提供されたプロパティ
  snapshot: DraggableStateSnapshot;// ドラッグ状態情報
}

/*const TodoItem: React.FC<TodoItemProps> = ({ todo, updateTodo, setTodos, todos }) =>
  の解説→以下の様に分解して解説
  ①const TodoItem
‣   変数宣言です。この名前でコンポーネントを呼び出せるようになります。

  ②: React.FC
    ‣ 「この変数には React の Function Component（関数コンポーネント）が入りますよ」
      という型注釈です。
    ‣ React.FC を使うと、子要素を children プロパティで受け取れるようになるほか、
      戻り値が JSX.Element であることも保証してくれます。

  ③<TodoItemProps>
  ‣ その React.FC が受け取る props の型を指定しています。
  ‣ ここで TodoItemProps を渡すことで、todo や updateTodo といったプロパティの存在
    や型チェックが働くようになります。

  ④({ todo, updateTodo, setTodos, todos })
  ‣ 実際にコンポーネントが受け取る props を分割代入（destructuring）しています。
  ‣ props.todo → 直接 todo、props.updateTodo → updateTodo… と書けるようになる、
    というイメージです。
 */
/*💥⭐️📣重要⭐️🩷🌞
  React.FC<TodoItemProps> の <TodoItemProps> 
  は「このコンポーネントが受け取る props の形」を TypeScript に伝える型注釈です。
  これがあることで、todo や updateTodo を呼び出す際に「正しい型で渡されているか」
  を型チェックしてくれます。
 */
const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  updateTodo, 
  setTodos, 
  todos,
  provided,
  snapshot
}) => {
  //🌌voidとは「何も返さない」ことを表す型です。

  /*<K extends keyof Todo, V extends Todo[K]>の解説
    全体解説→上記のコードは以下の①②とも以下の点で共通する
     A：引数の型を制限すること。
     B：どの様に制限するか→制限、つまり、型を特定のものには固定指定できない
        だが、「ある範囲の中のいずれかの型であること」の様に型を制限してる
     C：型注釈、💡引数に対する制約💡であること

    ①K extends keyof Todo
     K(引数)の型は、extends keyof Todoの範囲内に制限される
      →🌞keyof Todoの説明、💐Todoはjavascriptオブジェクト、つまり
       key:valueの構成になっている。つまり、その構成のなかから
       キーのみを取り出し、"key1" | "key2" | "key3" (注：キーを文字列の集合体として取り出せる)
       ユニオン型として取り出す。💐
      →extendsの説明；〜の範囲のなかの一つ
    🔴まとめ：Kは、Todoオブジェクトから、キーの部分をユニオン型としてとりだし、その範囲の
             中のひとつであることの様に制限してる。

    ②V extends Todo[K]
      Vは、キーから取得できる値であればいい。ただし、Kは範囲、よってVも範囲のなかからの
      ひとつであることによって制限される
  */
  const handleTodoChang = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    const updatedTodos = todos.map(todo => 
      /*[key]とする理由
        keyは K つまり、ユニオン型である、つまり、Kは文字列である。
        [key]とすることで、文字列ではなく、オブジェクトのキーとすることができる
       */
      todo.id === id ? { ...todo, [key]: value  } : todo
    );

    setTodos(updatedTodos) //親のステートを更新

    //todo.id と引数のidが一致しているtodoをみつけている
    const updatedTodo = updatedTodos.find(todo => todo.id === id);
    if (updatedTodo) {
      updateTodo(id, updatedTodo); // 親コンポーネントから渡された関数でサーバー更新
    }
  };

  return (
    <li
      ref = {provided.innerRef}
      /*
      * {...provided.draggableProps} （①）
        ・ドラッグ対象の要素（この場合は <li>）に必要な「ドラッグ開始・移動・リリース」
        のためのイベントハンドラや属性を一括で渡しています。
        ・これがないとそもそも要素をドラッグできません。
      */
      {...provided.draggableProps}
      /*
      * {...provided.dragHandleProps} （②）
        ・ユーザーが「つかんで動かせる部分（ハンドル）」に必要なプロパティ
        （マウス／タッチ操作の制御など）を渡します。
        ・①と同じ要素に付ける場合もありますが、別のハンドル用要素にだけ
          付けることもできます。
      */
      {...provided.dragHandleProps}
      /*
      * style={{ ...provided.draggableProps.style, … }} （③）
        ・provided.draggableProps.style にはドラッグ中の移動位置を反映する
         transform やアニメーション設定が入っています。
        ・それを展開（...）しつつ、backgroundColor を snapshot.isDragging の真偽
          に応じて上書きしています。
        ・こうすることで「見た目を変えつつ、ドラッグの動きには支障を出さない」
          スタイルになります。
      */
      style = {{
        ...provided.draggableProps.style,
        //ドラッグ状態なら背景色を薄い緑色、そうでなければ背景色を白色にする
        backgroundColor: snapshot.isDragging ? 'lightgreen' : 'white'
      }}
    >
      <input 
        type="checkbox" 
        disabled={todo.delete_flg}
        checked={todo.completed_flg}
        onChange={() => handleTodoChang(todo.id, 'completed_flg', !todo.completed_flg)}
      />
      <input 
        type="text" 
        disabled={todo.completed_flg || todo.delete_flg}
        value={todo.content}
        onChange={(e) => handleTodoChang(todo.id, 'content', e.target.value)}
      />
      <button onClick={() => handleTodoChang(todo.id, 'delete_flg', !todo.delete_flg)}>
        { todo.delete_flg ? "復元" : "削除" }
      </button>
    </li>
  );
};

export default TodoItem

/*最後にここは子コンポーネント
  つまり、何処かの親コンポーネントで以下の様に実行される(この当子コンポーネントが)
  <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          updateTodo={updateTodo}
        />
    ※updateTodoの関数も親コンポーネントで設定する→chatgpt コードに関する質問タブにて [updateTodo(id, updatedTodo) を「呼び出している」]で検索
  それとは別にTodoの型を設定してる、type.tsxも親コンポーネントに近いものもある
  →というようりも、🎉💡type.tsxで設定してるTodoはTodoItem.tsxでTodoという部品を使う為に
    部品を作っているという、使いまわしのできる部品を作っている下請け工場みたいなもの💡🎉

    🎉💡で囲われた文章を踏まえた上で、ここで設定している  interface TodoItemPropsは
    type.tsxの部品工場で汎用性のある部品を活用して、新しい製品をつくってる様なもの
    その上で親コンポーネントでその作った製品を展示してる様なイメージ

*/