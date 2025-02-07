import {useState} from 'react'
import eCompanyLogo from '../assets/e_company_412.png';
import redIcon from '../assets/red_icon.png'

//商品の型を定義
interface Product {
  id: number
  name: string
  price: number
  stock: number
  isFavorite: boolean
}

function ProductList() {
  
  //買い物籠の数のカウント
  const [zero, setCounts] =useState(0)
  //商品リストの状態を管理
  const [products, setProducts] =useState<Product[]>([
    {id: 1, name: 'コーヒー', price: 400, stock: 5, isFavorite: false},
    {id: 2, name: '紅茶', price: 300, stock: 3, isFavorite: false},
    {id: 3, name: '緑茶', price: 350, stock: 0, isFavorite: false}
  ])

  //お気に入り切替え
  const toggleFavorite = (id:number) => {
    //以下のコードのprosuctsは🌸const [products, setProducts] =useState<Product[]>🌸の設定してる変数
    //🌸のコードで、productsの中には配列に格納した、javascriptオブジェクトの商品リストが入ってる
    //その商品リストを.mapで一ずつとりだして該当のisFavoriteの値を更新してる。
    setProducts(products.map(product =>
      //以下は3項式、条件 ? 正の時: 負の時
      //お気に入りを登録削除する処理、まずは、条件：引数の値(商品id)と合致するかそれぞれの要素と比較
      //正の時:➀まず、productの中身を更新するのでなく、コピー要素を作る(...product)➁isFavoriteの値の更新
      //💡正の時の書き方になぜ、{}で囲む必要があるのか→以下🌟
      //🌟typescriptは直接ステート（状態）を変更するのではなく、新しいオブジェクトを作成してステートを更新することが推奨されています。そして、
      //上記の続き:その新しいオブジェクトを作成するために {}（オブジェクトリテラル）が使用されます。
      //💡の結論:{}で囲んでるのは新しいオブジェクトを生成してるから
      //負の時:そのまま更新せず、スルー
      product.id === id ? {...product, isFavorite: !product.isFavorite} : product
    ))
  }

  const buy = (id: number) => {
    setCounts(prevCount => { // コールバック関数を使用
      const newCount = prevCount + 1;
      console.log(newCount); // 正しい値（更新後の値）が出力される
      return newCount;
    });
    setProducts(products.map(product =>
      product.id === id ? product.stock >0 ? {...product, stock: product.stock-1} : {...product, stock:product.stock} : product
    ))
  }

  return(
    <>
    <nav style={{textAlign:"right"}} className='navs'>
      <img src={eCompanyLogo} alt="" className='mr-auto first'/>
      {zero >0 && (<><img src={redIcon} alt="" className="icon-style"/><span className='buy-count'>{zero}</span></>)}
    </nav>
    <div className="product-list">
      <h2>商品一覧</h2>

      {/*商品がない場合の表示 returnの中の{}のコードはjavascriptのコードを書く為に囲む*/}
      {products.length === 0 && (
        <p>商品がありません</p>
      )}

      {/*商品リストの表示 */}
      {/*keyの重要性について詳細→スプレッドシート(フロントエンジニア学習メモ)備忘記録タブ参照 */}
      {products.map(product => (
        <div key={product.id} className="product-item">
          <div className="product-info">
            <h3>{product.name}</h3>
            <p>価格: ￥{product.price}</p>
            <button onClick={() => buy(product.id)} className={product.stock ? "stock" : "stock non"}>購入する</button>
            {/*在庫の条件付表示　以下は３項式の条件分岐*/}
            {/* 3項式の解説→在庫の数が０以上 ? 在庫数を表示させる*/}
            {product.stock >0 ? (
              <p className="in-stock">
                在庫:{product.stock}個
              </p>
            ) : (
              <p className="out-of-stock">
                在庫切れ
              </p>
            )}
          </div>

          {/*お気に入りボタン 以下も３項式　お気に入りをオンにすると、該当のスタイルが追加*/}
          <button className={product.isFavorite ? "favorite active" : "favorite"}
            onClick={() => 
            toggleFavorite(product.id)
            }>
            {product.isFavorite ? "★" : "☆"}
          </button>
        </div>
      ))}
      {/* お気に入りの数を表示 */}
      {/*以下のコード詳細説明googleスプレッドシートのフロントエンジニア学習メモの備忘記録タブ */}
      {products.filter(product => product.isFavorite).length > 0 && (
        <div className="favorite-count">
          お気に入りの商品: {products.filter(product => product.isFavorite).length}点
        </div>
      )}
    </div>
    </>
  )
}

export default ProductList
