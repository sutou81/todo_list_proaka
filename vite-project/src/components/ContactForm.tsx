import { useState } from "react";

//フォームの型定義🌟必ず入力が必須🌟だから、以下の💝のところで、初期値を設定してる➀
interface FormData {
  name:string
  email:string
  message:string
}


//？をつけることで、「エラーがないときはundefined(未定義)でもOK」という意味になります。➁
//↑の詳しい説明：以下の型の定義は、(🌸エラーが発生した時だけ🌸)にエラーメッセージを格納するもの
//上記の🌸()の箇所の意味→格納に必要な分を必要な時だけ格納したい
//➁のこの書き方とくらべて上記の➀の設定の書き方をすると、何が何でも格納しないと、→😲javascriptのエラーを吐き出す事になる😲
//以下の➁の書き方をすると、不要なところには、undefindeが「!」がついてると入り、上記の😲の箇所の様な事は起きなくなる
interface FormErrors{
  name?: string //名前のエラーメッセージを格納する場所(エラーがない時は省略可→※➀の書き方は省略できない)
  email?: string //メールアドレスのエラーメッセージを格納する場所(エラーがない時は省略可→※➀の書き方は省略できない)
  message?: string //メッセージのエラーメッセージを格納する場所(エラーがない時は省略可→※➀の書き方は省略できない)
}




function ContactForm () {
  //複数の入力値をオブジェクトで管理💝
  //useState<>は、変数が<>野中で設定した構造をしてる
  /*useState<FormData> と型を指定することで、formData ステートが常に FormData インターフェースに準拠したオブジェクトであること
  をTypeScriptコンパイラが保証します。これにより、コードの早期段階で型エラーを検出し、実行時エラーを防ぐことができます。
  例えば、formData.name は常に文字列であることが保証されます。もし数値などを代入しようとすると、コンパイルエラーが発生します。*/
  /*簡単に説明すると、このコードはフォームの情報を保存しておくためのものです。たとえば、名前やメールアドレスなどの情報を入力する
  フォームがあるとします。このコードを使うと、フォームに入力された情報を自動的に保存し、後でそれを使うことができます。
  useStateという部分が、情報を保存する「箱」のような役割を果たします。これで、フォームに入力された情報を簡単に管理できるようになります。*/
  const [formData,setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })//💝

  //エラーメッセージを保存する場所を作る→上記の➁の理由から➀の💝の様に初期値を設定する必要なし、空{}でも大丈夫
  /*useStateは箱 例useState(0)→useStateという箱に「0」を入れる、
  useState<FormErrors>({})→useStateの空箱の💡金型を、FormErrorsという型に沿わせて、その中に様式にあった空箱を設置*/
  const [errors, setErrors] = useState<FormErrors>({})

  //入力内容をチェックする関数
  //以下のコードのconst validateForm = ()✨: boolean✨ => {}の部分✨囲みの部分を除いて、アロー関数
  //↑問題は、✨の部分←は型注釈と言ってtypescriptの書き方→戻り値の型を指定→今回でいうとboolean型(true or falseが戻り値の型に指定する書き方。)
  /*型注釈で書く利点、
  📍「コードを読む人が、そのコードはなにをやってるところか、つまり可読性の為」: これはまさに、型注釈がコードの可読性を向上させるという点に合致します。型注釈があることで、
  関数が何を受け取り、何を返すのかが一目でわかるため、コードの意図を理解しやすくなります。
  📍「実際にコードを書いてる人が、最初に戻り値の型を指定する事で、その中の戻り値がその型になるように意識する事でコードが挫折しない為もある」
  : これは、型安全性の確保と開発効率の向上に繋がります。最初に戻り値の型を指定することで、
  開発者はその型に合うようにコードを書くことを意識します。もし異なる型の値を返そうとすると、コンパイラがエラーを出してくれるため、
  早期に間違いに気づき、修正することができます。これにより、開発中の挫折を防ぎ、スムーズに開発を進めることができます。*/
  //🌟参照、スプレッドシート(フロントエンジニア学習メモ)型注釈について　のタブ
  const validateForm = (): boolean => {
    //新しいエラーを入れる箱、const newErrors:FormErrors = {} 型注釈の書き方 🌟を参照
    //const 定数名:定数の型を決める = 型を決めた定数の中にいれるもの 変数を用意その型はFormErrorsに型を添わせたもの、そのなかに{}を入れる
    const newErrors:FormErrors = {}

    //名前が２文字未満ならエラー
    if (formData.name.length < 2) {
      newErrors.name = "お名前は２文字以上で入力してください"
    }

    //メールアドレスが正しい形式かチェック
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    //emailの正規表現に合致しない時は以下のエラーメッセージに格納する
    if (!emailPattern.test(formData.email)){
      newErrors.email = "正しいメールアドレスを入力してください"
    }

    if (formData.message.length < 10) {
      newErrors.message ="メッセージは１０文字以上で入力してください"
    }

    //エラーメッセージをset関数を活用して、errorsを更新する。
    setErrors(newErrors)//ひとつ一つのエラーを例えば、setErrors(error.name)としてもできた、がまとめて更新するためnewErrorsを作成した
    //最初に型注釈した型エラーがなければ、true、あればfalseを返す
    return Object.keys(newErrors).length === 0


  
  }

  const hanndleSubmit =(e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();//ページの再読み込みを防ぐ
    //バリデーションチェックを実行
    let allError = document.querySelectorAll('.error')
    const newsErrors:FormErrors = {
      name:undefined,
      email:undefined,
      message:undefined
    }
    setErrors(newsErrors)
    console.log(allError.length)
    setTimeout(()=>{
      if(validateForm()) {
        console.log(validateForm)
        //エラーがなければ送信処理
        console.log("送信されたデータ", formData)
        alert('送信しました！')
        //フォームを空に戻す
        setFormData({
          name: '',
          email:'',
          message: '' 
        })
      }
    },2000)
  }

  //入力値の更新をまとめて管理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    const {name,value} =e.target //これは、変更があったform要素のネーム属性と値を格納してる
    /*上記のコードは以下と同意
    これは、以下のコードと等価です。
      JavaScript

      const name = e.target.name;
      const value = e.target.value;*/
    setFormData({
      ...formData,  // 既存の値をコピー
      [name]: value // 変更があった部分だけ更新[name]は、変更があった、input要素または、textarea要素のnme属性をさす。
                    //つまり、[name]: value は、変更があった要素の 属性名:変更された値と、どこのform要素で、どう変更があったかわかる。

    })

    //その項目のエラーメッセージをクリア
    //例え、編集後の内容が、エラー(validateFormでの対象)だったとしても、ここではエラーは発生せず
    //handleSubmitつまり、submitボタンを押した後でなければエラーは認識・表示されない
    if(validateForm()){//変更後もエラーがなければ、
      if(errors[name as keyof FormData]) {
        setErrors({
          ...errors,//errorsの内容をいったんコピーしてから以下のコードで編集して格納する。
          [name]: undefined
        })
      }
    }
  }

  return (
    <div>
      <h1 style={{textAlign: 'center', marginBottom: '20px'}}>お問合せフォーム</h1>
      <form action="" onSubmit={hanndleSubmit} style={{padding: '20px', border: '1px solid #ccc', borderRadius: '10px'}}>
        <div>
          <label htmlFor="">
            お名前:
            <input 
              type="text" 
              name="name"
              value={formData.name}/*formDataも、interfaceのjavascriptオブジェクト形式したから、この様に値を取り出す。*/
              onChange={handleChange}
              required/*入力必須の為に着ける*/
             />
          </label>
          {/*以下は、input要素のname="name"でエラーが表示が存在する際はエラー文言を表示させるコード*/}
          {errors.name && <p className="error" style={{color: 'red'}}>{errors.name}</p>}
          <label htmlFor="">
            メールアドレス:
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
             />
          </label>
          {/*以下は、input要素のname="email"でエラーが表示が存在する際はエラー文言を表示させるコード*/}
          {errors.email && <p className="error" style={{color: 'red'}}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="">
            メッセージ:
            <textarea
              style={{minHeight:'5rem'}}
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
          {/*以下は、input要素のname="message"でエラーが表示が存在する際はエラー文言を表示させるコード*/}
          {errors.message && <p className="error" style={{color: 'red'}}>{errors.message}</p>}
        </div>
        <button type="submit" className="button-submit">送信</button>
      </form>
    </div>
  )
}

export default ContactForm