import { useState, ChangeEvent } from 'react'

//フォームの値の型を定義
/*
  以下のinterface FormValues { [key: string]: string }
  の様な書き方の説明としては
  この構文は インデックスシグネチャ と呼ばれ、TypeScript でオブジェクトのプロパティ名（キー）が
  事前に確定していない場合や、動的にプロパティが追加される可能性がある場合に使用されます。
  インデックスシグネチャを使用することで、オブジェクトが特定の型のプロパティを複数持つことを 
  TypeScript に伝えることができます。
  構文の詳細：
  key: string：オブジェクトのプロパティ名が文字列であることを示しています。
  : string：各プロパティの値が文字列型であることを示しています。
  つまり、💎FormValues インターフェースは、任意の数の文字列型のキーと、それに対応する文字列型の値を持つオブジェクトを表しています。💎
 */
interface FormValues {
  //FormValues インターフェースは、任意の数の文字列型のキーと、それに対応する文字列型の値を持つオブジェクトを表しています
  [key:string]: string
}
//型をジェネリックにて設定
//おそらく、initialValuesに指定し多変数(T)は、その下段のvaluesという名の変数にinitialValuesに指定した変数が使われる
interface UserFormProps<T>{
  initialValues: T;
  //onSubiitには関数が定義できる(returnなしの関数)
  onSubmit: (values: T) => void;
  /*
   keyof:オブジェクト型のプロパティ名(key名)を取得 します。
        そして、 「型」に対して使用 します
        type SomeType = {
          foo: string;
          bar: string;
          baz: number;
        }

        const someKey: keyof SomeType; // someKey: 'foo' | 'bar' | 'baz'
    ※typeof:実際の値を型に変換 します。
    以下のコードの全体要約
      🌟validate は 受け取ったデータをチェックし、エラーがある場合のみエラーメッセージを返す仕組み を作っている！
    各部分の詳細
      Partialの働きについて
       →この部分の中身がなくても問題ない、値が省略可能 以下💎の説明参照
   *
  /*validate?: (values: T) => Partial<Record<keyof T, string>>の解説ここを読む🌸🌈
    💎 Partial<Record<keyof T, string>>;の説明
    上記のコードは以下の2つにおおまかに分解できる
    ➀Partial
      (1)型で設定したinterface丸ごとPartialした
      https://qiita.com/NOMURA_keibyou38/items/0771efb6661bfa4f5178  参照(※)
      ※のページで用いてるpartialは、interfaceで設定した型のオブジェクト(interface digitalMonsters)を丸ごと
        に対しPartialを設定して、別変数へ格納してある状態→これは以下のコードと同義
        name?: string;
        nextGrade?: string;
        level?: number
        つまり、🌟どの要素を盛関数実行時変数の指定を省く事ができる。変数そのものを省く事ができる🌟
      (2)今回の Partial<Record<keyof T, string>>のPartial
       これは上記とは違い、関数実行時にはvalidateの値は設定する必要がある(ただし、🚙の箇所参照)
       ただ、上記のコードを用いた🌕関数内での戻り値として、当戻り値を省く事ができる事を意味してる🌕

       補足
       (1)のPartialの設定と(2)のPartialの設定の共通点は、省略できる事
       (1)と(2)の違いは、💡省略できるタイミングと、省略できるものの内容が異なる💡
        →Ⓐ：タイミング：関数の引数を渡す時点（呼び出し側）省略できるもの：渡す引数自体
        →Ⓑ：タイミング：関数の戻り値を作る時点（関数内）省略できるもの：戻り値自体
    ➁Record<K, T>型の部分 参照 https://yminamiyama.com/typescript-record/
      Record<K, T>型は、キーKの型と値Tの型を指定し、それらを持つオブジェクトを作成するための型です。
       具体例 type UserRecord = Record<number, string>;
            const users: UserRecord = {
              1: "Alice",
              2: "Bob",
              3: "Charlie"
            };
      補足2：<Record<keyof T, string>> の『keyof』の部分の解説
       参考サイト https://gizanbeak.com/post/typescript-typeof-keyof
            keyof は、オブジェクト型のキーを取得するTypeScriptの型演算子です。
            オブジェクト型に対して使うことで、その オブジェクトのすべてのキーを文字列リテラル型のUnion型として取得 できます。
            実際のコードを見てみましょう。

            type Person = {
              name: string;
              age: number;
            };

            type PersonKeys = keyof Person;
            この例では PersonKeys は "name" | "age" という型になります。
            このようにオブジェクトからキーの型を取得できるわけですね。
    ✨以上➀➁の説明から、まとめると、 Partial<Record<keyof T, string>>の意味は
      型注釈をオブジェクト型(Tに指定した変数オブジェクト型から、オブジェクトのキーから抽出した部分をキーとし
      値をstring型とした）にしていし、、不要なら、値に空のオブジェクト(partialの効果)にも設定をできる様にしたもの
    
  🌸🌸🌺validate?: (values: T) => Partial<Record<keyof T, string>>の簡単な説明
   validate?とした事により関数実行じこの初期値を必ずしも引き渡す必要のないものとし、
   validateの型注釈はオブジェク型と、かりに戻り値を省略する事もできる

   🌸🌈*/
  validate?: (values: T) =>  Partial<Record<keyof T, string>>;
}
/*
✅ T extends FormValues により、T は [key: string]: string の形に制約される！
✅ UserFormProps<T> の T も、この型制約を受ける！
✅ つまり、関数の引数 initialValues や onSubmit に渡せるデータも、[key: string]: string の形になる！ 🎯
*/
export function UserForm<T extends FormValues>({ 
  initialValues, 
  onSubmit, 
  validate 
}: UserFormProps<T>) {
  //初期値、値変更後の値もStateで管理
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] =  useState(false)

  //textarea又はinput要素の値に変更があった場合に以下の値の更新を実行し、エラーを解除する
  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    //「分割代入（Destructuring Assignment）」 と呼ばれる JavaScript の機能
    const { name, value } = e.target
    console.log(name)
    setValues(prev => ({
      ...prev, //変更の前の値を一端コピーする
      [name]: value //値の更新
    }))
    //入力時そのフィールドのエラーをクリア
    /*以下の条件は上記のconst { name, value } = e.targetから
      変更があった場所のnameを特定してその箇所にエラー表示があるかどうかを
      チェックして、エラー表示があったら、エラーを解除する
    */
    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  //Formの値をまっさらにする。
  const resetForm = () => {
    //初期値に戻す
    setValues(initialValues)
    //エラーを初期化
    setErrors({})
  }
  
    // async:非同期関数を定義する関数宣言のこと。
    //参照 https://qiita.com/soarflat/items/1a9613e023200bbebcb3

  const handleSubmit =async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validate) {
      /*以下のコードの説明
        ➀const newErrors = validate(values);
        はvalidate?: (values: T) => Partial<Record<keyof T, string>>
        で設定した関数にvaluesを引き渡し、えらーの内容を以下の形式で格納されます
        "name":"名前は必須です",(※🌟)
        ※keyofを使う事によりオブジェクトのkeyが文字列でなくても、文字列キー:値という形式でかえってくる
        これが、newErrorsにオブジェクト形式で格納される

        ➁(Object.keys(newErrors).length > 0)
        ➀で{"name":"名前は必須です"}で格納された、変数newErrorsに格納されたのを受けて
          Object.keys(newErrors)をする事で、
          ["name"]という配列形式 で格納される→
          newErrorsにはエラーがある場合だけ、その該当の箇所とエラーメッセージがオブジェクト形式で格納される
          つまり、(Object.keys(newErrors).length > 0でエラーがある箇所があるかどうかチェックしてる
          エラーがあれば、setErrorsにnewErrors(🌟の箇所)格納される


        */
      const newErrors = validate(values)
      if (Object.keys(newErrors).length > 0){
        setErrors(newErrors)
        return;//処理から抜ける
      }
    } 
    
    setIsSubmitting(true)
    resetForm()
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }

  }
  
  
  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm
  }
}