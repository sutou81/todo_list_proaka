import React from "react";


//Hello コンポーネントの定義
/*コンポーネントの定義の仕方は大きく分けて以下の2つになる
    ①functionを使った関数として定義する方法
    ②constを使った変数として定義する方法
      さらに②の方法として以下の2通りがある。
      ②-1：React.FC を使う方法 テキストはこちらの方法を採用
      ②-2：JSX.Element を使う方法
 */
const Hello: React.FC = () => {
  return <h1>Hellow.</h1>
};

export default Hello