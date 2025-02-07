/*Union Types（合併型）とは、1つ以上の異なる型を持つ可能性があるデータ型を表現する方法です。
TypeScript では、データが複数の型を取る場合にこの仕組みを利用します。
テキスト　React + TypeScript 基礎編_6 Union Tipesの活用 参照
*/
export type ButtonStatus ='idle' | 'loading' | 'success' | 'error';
type ButtonSize = 'small' | 'medium' | 'large';

interface StatusButtonProps {
  status: ButtonStatus;
  size?: ButtonSize;//空白でもOk
  label:string;
  onClick: () => void; //関数を格納、戻り値なしの関数
}

function StatusButton({status, size='medium',label, onClick }:StatusButtonProps){
  //ステータスに応じたスタイルを設定
  //(status:ButtonStatus)
  const getStatusClass = (status:ButtonStatus): string => {
    switch (status) {
      case 'loading':return 'btn-loading';
      case 'success' :return 'btn-success';
      case 'error' : return 'btn-error';
      default :return ''
    }
  }

  return (
    <button
      className={`btn ${getStatusClass(status)} btn-${size}`}
      /* onClick は StatusButton コンポーネントの props で渡される関数 (onClick: () => void;) です。
        StatusButton を使う側で onClick に実際の関数を渡すことで、クリック時の処理が決まります。 */
      onClick={onClick}
      /* status が 'loading' のとき、ボタンをクリック不可 (disabled={true}) にする。 */
      disabled={status === 'loading'}
    >
      {
        /*
        {status === 'loading' ? 'Loading...' : label} → status が 'loading' なら 'Loading...' を表示、それ以外は label を表示する。
        例示
          <StatusButton status="idle" label="Click Me" onClick={() => {}} />
          status="idle" のとき → label は "Click Me" なので、ボタンには "Click Me" と表示される。
      */
      }
      {status === 'loading' ? 'Loading...' : label}
    </button>
  )
}

export default StatusButton;
