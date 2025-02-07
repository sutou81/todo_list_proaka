//基本的な定義　以下の解説を熟読するべし
/*💡typw Userとして設定する意味
🌟type User は、interface UserCardProps で使用される「型の部品」として機能🌟しています。

interface UserCardProps は、UserCard コンポーネントに渡される props の型を定義しています。その props の中に 
user というプロパティがあり、その型を User としています。
ここで、type User がなければ、interface UserCardProps の中で user の型を直接記述する必要がありました。

例：

TypeScript

interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    age?: number;
  };
  onEdit: (id: number) => void;
  isSelected?: boolean;
}
この書き方でも機能的には問題ありませんが、User の型が他の場所でも使用される場合、同じ型定義を何度も記述する必要が出てきてしまい、
コードの重複が発生します。また、User の型を変更する場合、すべての場所で変更する必要があり、保守性が低下します。

type User を事前に定義しておくことで、

コードの重複を避けることができます。
型の変更が容易になります（🌟type User の定義を変更するだけで、User を使用しているすべての場所に変更が反映されます🌟）。
コードの可読性が向上します（User という名前で型を表すことで、コードの意味が分かりやすくなります）。
まさに、ご認識の通り、type User は「型の部品」として機能し、interface UserCardProps はその部品を組み合わせてより
複雑な型を定義している、つまりネストされた構造になっていると捉えて問題ありません。
*/
type User = {
  id:number;
  name:string;
  email:string;
  age?:number; // ?は省略可能なプロパティを表す
}

//Propsの型の定義→上記で設定してUserを型の設定する部品として採用する。上記の💡の箇所を熟読必須
interface UserCardProps {
  user: User;//上記で設定したtype Userの型部品をここで組み込む
  //下記のコードの全体的説明+voidの説明
  /*
    void は、「関数が何も返さない」という制約を型定義に加えることで、
    onEdit に💡💝渡される関数が正しい形（number 型の引数を1つ受け取り、何も返さない）💝💡
    であることをTypeScriptがチェックできるようにしています。もし、異なる型の関数を渡そうとすると、
    TypeScriptが型エラーを報告し、バグを未然に防ぐことができます。これが「型安全性が保たれる」ということです。

    つまり、void があることで、「onEdit に渡される関数は、number を受け取って、
    何も返さない関数(端的にreturnで戻り値を指定してない関数)でなければならない」というルールが強制され、
    そのルールに違反するコードはTypeScriptによって検出される、
    という仕組みです。 

    自分の解釈
    ➀onEditには関数をひきわたさなけばならない
    ➁その関数は、引数がnumberの型である関数である事、戻り値(return)の指定がない関数である事
    ※➀の説明→関数を引き渡す必要があると、どこからどう理解すればどうなるか 以下具体的説明 必読
       ご推察の通り、onEdit: (id: number) => void というアロー関数形式の書き方になっているから、onEdit には関数を
       渡さなければならないと認識できます。
        詳しく説明いたします。💡🔶以下の説明の端的ポイント🔶💡→🌕で囲われた文、🌞で囲われた文

        インターフェースにおけるプロパティの型定義
        (interfaceで設定できるものは、string numberといった型だけでなく、🌕オブジェクト型🌕、
        🌞関数型(onEdit: (id:number) => void(関数の型は、(引数: 型) => 戻り値の型 という形式で記述)(今回の例))🌞も設定可能)

        インターフェースは、オブジェクトの形状（プロパティとその型）を定義するものです。例えば、name: string は、
        「name というプロパティは文字列型である」ということを意味します。
        同様に、user: User は、「user というプロパティは User 型のオブジェクトである」ということを意味します。

        関数型の定義：(引数: 型) => 戻り値の型

        🌟TypeScript では、関数も型として表現することができます🌟。関数の型は、(引数: 型) => 戻り値の型 という形式で記述します。

        (引数: 型): 関数の引数とその型を表します。引数が複数ある場合は、(引数1: 型1, 引数2: 型2, ...) のように記述します。
        =>: アロー（矢印）は、「〜を返す」という意味を表します。
        戻り値の型: 関数の戻り値の型を表します。戻り値がない場合は void を使用します。
        onEdit: (id: number) => void の解釈

        onEdit: (id: number) => void は、onEdit プロパティの型を定義しており、「onEdit は関数であり、
        number 型の引数 id を1つ受け取り、何も返さない」ということを意味します。

        つまり、この型定義を見ただけで、

        onEdit は関数である必要がある。
        その関数は number 型の引数を1つ受け取る。
        その関数は何も返さない（void）retrunが無いって事➡🛫以下の文参照。
        (🛫→つまり、逆を言えば、returnがある関数や、引数が数字でなかったり、引数がない関数をonEditに設定するとエラーが出る)
        ということが分かります。
        
  */
  onEdit: (id:number) => void;
  isSelected?:boolean; //?が設定してある事は、省略可能な型であるという事
}

//コンポーネントに型を指定
function UserCard({user, onEdit, isSelected = false}: UserCardProps) {
  return (
    <div className={`user-card ${isSelected ? 'selected' : ''}`}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      {/* 省略可能な値の安全な表示の仕方(存在を確かめて(user.age &&の部分)から表示) */}
      {user.age && <p>Age: {user.age}</p>}
      <button onClick={() => onEdit(user.id)}>編集</button>
    </div>
  ); 
}

export default UserCard;