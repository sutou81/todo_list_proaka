import { useState } from "react";
import localforage from 'localforage';
/* 💝💎🌞codepenのReactジェネリックのコードと実行結果を参照して、熟慮する💝💎🌞
  ジェネリックのイメージ詳細熟読必要https://www.commte.co.jp/learn-nextjs/generics 
  上記のurlの概略から一部抜粋
  Genericsは、型の再利用性を高めるための強力なツールです。型が一部未定の汎用的な関数やクラスを作成し、
  それを具体的な型で再利用することができます。これにより、安全性と再利用性を保ちつつ、さまざまな型に
  対応するコードを作成できます。→自分の解釈🌟
  🌟使いまわしのできるコードの書き方ができるのがジェネリック
  🌟どう使うかを決めるのも自由だし、どの様に使ってもいい便利なもの

  まとめます。Generics（ジェネリックス）は、TypeScript で提供される機能で、型の汎用性と再利用性を向上させるためのものです。
  Generics を使用することで、関数やクラス、インターフェースに対して、型をパラメータとして渡すことができます。
  これにより、コードの繰り返しを減らし、一貫性を保つことができます。
  →🌟interfaceや関数を型にしばられず、書く事ができて、ジェネリックを使用時にその時にあった型注釈を設定する事もできる
  🌟型とかにしばられず、使いまわす事ができるもの　参照codepenのジェネリック効果のコードと実行結果を良くみる

*/
//ジェネリックを使用したコンポーネント
interface UserListProps<T> {
  items:T[];
  //以下の(item:T)は本来であれば、UserCard.tsxのonEdit: (id:number) => void;の様(関数を指定)にTの所には型の種類を指定すべき
  //なのに、ジェネリックを採用し、特定の型の指定をするのではなく「T」として、ジェネリックを採用してる
  //ReactNodeは、Reactコンポーネントがレンダリングできるものを表現する型
  renderItem: (item:T) => React.ReactNode;
  //keyExtractorには、引数の型が決まってない、itemという引数を持ち(型注釈付き)、戻り値が文字列か数字の関数を格納する
  keyExtractor:(item: T, index: number) => string |number //localforageによりインデックスを追加
  isLoading?: boolean;
  errorMessage?: string;
  onDelete: (index: number) => void;//削除ボタンの処理を追加
  onUpdate: () => void;//更新ボタンの処理を追加
}

type User = {
  id:number;
  name:string;
  email:string;
}

//上記のジェネリック型のコンポーネントを元に、決まった処理を行う関数(ジェネリック)
//function 関数名<T(関数名の型がジェネリックである印)>({変数名3つ}:型注釈){関数の中身}という構成になってる
//ジェネリックな型を使用する関数でも、特定の型に対してのみ処理を行う場合は、ジェネリックにする必要はありません。→下続き
//ジェネリック型関数にするのは、🌟複数の型に対して同じ処理を適用したい場合🌟に限ります。
function UserList<T>({
  items,
  renderItem,
  keyExtractor,
  isLoading = false,
  errorMessage = '',
  onDelete,//削除関数を受ける
  onUpdate//アップデート関数を受ける
}:UserListProps<T>){
  const [beforeUsers, setAfterUsers] =useState<User[]>([])
  //isLoadingがtrueの場合の条件
  if(isLoading) {
    return <p>データを読み込み中です...</p>;
  }
  //errorMessageが存在する時
  if(errorMessage) {
    return <p className="error">{errorMessage}</p>
  }

  if(items.length === 0){
    return <p>データがありません</p>
  }

  const handleDelete = (value: number) => {
    
    const fetchDelete = async () => {
      const localBefore =  await localforage.getItem<User[]>('users')
      const trueValue = localBefore || []
      if(trueValue[value]){
        trueValue.splice(value, 1)
      }
      await localforage.setItem('users', trueValue)
      setAfterUsers(trueValue)
    }
    fetchDelete()
  }
  return(
    <>
      <button onClick={() => onUpdate()}>更新</button>
      <div className="data-list" style={{maxHeight: '400px', overflow: 'auto'}}>
        {items.map((item, index) => (
          /* keyExtractor: リストの項目を区別する
              リストを効率的に管理するために、各項目にユニークな key を付ける必要があります。これがないと、項目を更新・削除するときにエラーが出たり動作が遅くなります。
              「この項目はどのようにユニークな値（IDなど）を持つか」を教える関数を作ります。
          */
          <div key={keyExtractor(item,index)} className="list-item">
            <button onClick={() => onDelete(index)}>削除</button>
            {/* renderItem: 項目の見た目を作る
              リストの各項目が画面にどのように表示されるか（見た目）を決める役割を持ちます。
              この関数は項目を受け取り、その項目をどのように表示するかを定義します。 🌒実行の際のコードと関連
            */}
            {renderItem(item)}
          </div>
        ))}
      </div>
    </>
  ) 
}

export default UserList;