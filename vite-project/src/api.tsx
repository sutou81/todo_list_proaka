import type { Todo } from './types';

/*Promise<Todo[]> は、「非同期関数 fetchTodos が（正常終了時に）Todo の
 配列を返す Promise である」ことを示す型注釈になります。*/
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch("http://localhost:3031/api/v1/todos");
  return response.json();
}

/*以下のurl参照Omit(Pick)のことについてわかりやすく説明してある
  https://zenn.dev/tm35/articles/b21aafdadae04c
  上記のurlでの内容を加味した上での自分の解釈
  interfaceやtypeの中で指定した要素の型は、型名に「?」がつく要素以外は必ず指定する型で
  値を指定する必要がある（前提）
  上記の前提を覆すことができる、省略できる要素を指定(Omit)、指定する要素のみを抽出(Pick)することができる
  今回の事例todo: Omit<Todo, 'id'>)は、
  todoという変数に、interface Todoで指定した型からidの要素を省略した型を指定するということ
  つまり、todoという変数には以下の要素をもった型であることを指定している
   interface Todo {
      content: string; //プロパティ content は文字列型
      (readonly id: number;今回このidはOmitの指定により、指定しなくてOKになる)
      completed_flg: boolean;//タスクの完了/未完了を判定する
      delete_flg: boolean;//削除に関するフラグ
   }
  💐これは、タスクを新規作成するとき、サーバー側で id が自動付与されるため、
  事前に id を渡す必要がないという目的です。💐
 */
/*上記の説明とは異なり、ここは以下のコードの概略を説明する箇所
  引数todoにinterface Todoからidを除いたものを指定し、当interface
  のタスクをapiにPOSTでアクセスし、interfaceで指定した値をもつタスクを新規作成させ、
  apiにアクセスしてタスクの新規作成が成功したら、そのタスクの内容を返り値として、Promiseに渡す
  
  💥✨(todo: Omit<Todo, 'id'>):Promise<Todo>✨の解釈
  💡引数(todo)の型注釈としてinterface Todoからidを除いた型を指定し、
  関数の戻り値の型の型注釈として、Promise型、本来はresolveかrejectだけど、interface Todo
  の型として戻り値の型を指定している💡

  */

export const createTodo = async (todo: Omit<Todo, 'id'>):Promise<Todo> => {
  const response = await fetch("http://localhost:3031/api/v1/todos", {
    method: "POST",
    //サーバーに「これから送るデータは JSON 形式です」と伝える
    headers: {
      "Content-type": "application/json"
    },
    /*todo は JavaScript のオブジェクトです。HTTPリクエストの body には文字列が必要なため、
      JSON.stringify(todo) を使って、todo を JSON 形式の文字列に変換しています。
      サーバーは受け取った文字列データを JSON としてパース（解析）し、オブジェクトとして処理します。
     */
    body:JSON.stringify(todo),
  })
  return response.json();//上記のurlにアクセスして新規作成のタスク込みのタスク一覧が格納される
}
/*Partial<Todo>の説明
  本来型で指定したことにより、各要素の指定を必ず指定する必要があるが、
  Partialを指定することにより、各要素全部にに?をつける様なもの(省略可能にさせる)要素の指定
  を省略しても問題ない様にする意図のもの
  つまり、①値の更新のあった該当するタスクがわかるもの→idの指定と
  ②更新のあった値のみでOK(🎉id以外、
  content,completed_flg, delte_flg全てを指定する必要がない)
  つまり、②の更新があった要素のみの指定で更新できる様にする為に、Partial<Todo>としている
*/
/*以下のコード全体の説明
  更新があった場合の処理をしている、
  更新のあったタスクの特定(id)、更新があった値(Partial<Todo>)を引数として渡し
  更新があったタスクのapi(todos/${id})にアクセスし、PATCH更新を要求
  更新したタスクを戻り値として取得する(戻り値の型はPromiseに<Todo>を指定
  することにより、更新のあった更新後のタスクを戻り値として取得してる)
 */
export const updateTodo = async(id:number, updateTodo:Partial<Todo>):Promise<Todo> => {
  const response = await fetch(`http://localhost:3031/api/v1/todos/${id}`,{
    method: "PATCH",
    headers:{
      "content-type": "application/json",
    },
    body: JSON.stringify(updateTodo),
  })
  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  await fetch(`http://localhost:3031/api/v1/todos/${id}`, {
    method: "DELETE",
  });
}