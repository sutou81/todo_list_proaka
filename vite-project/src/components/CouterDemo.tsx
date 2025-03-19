import React from 'react';
import { useCounter } from '../hooks/useCounter';//カスタムフックをインポート

const CounterDemo = () => {
  /*
    もし return の変数名と異なる名前で使いたい場合は、エイリアス（別名）を指定できる。


    const { count, increment: add, decrement: subtract, reset } = useCounter({
      initialValue: 0,
      min: 0,
      max: 10,
    });

    この場合：
      increment は add という変数名で使える
      decrement は subtract という変数名で使える
      count と reset はそのままの名前

  */
  const {count,increment, decrement, reset} = useCounter({
    initialValue:0,
    min:0,
    max:10,
  });

  return (
    <div>
      <h2>カウンターデモ</h2>
      <p>現在のカウント: {count}</p>
      <button onClick={decrement}>減らす</button>
      <button onClick={increment}>増やす</button>
      <button onClick={reset}>リセット</button>
    </div>
  );
};

export default CounterDemo;