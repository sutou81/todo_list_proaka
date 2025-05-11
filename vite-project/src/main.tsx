import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Timer from './components/Timer'

/*ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Timer />
    <App />
  </React.StrictMode>,
)*/

//ReactDOM.createRoot()は、React 18で追加された新しい描画方法になります。
//document.getElementById('root')!は、id="root"の要素を取得し、そこにAppを描画してます
//as HTMLElementでなく「 ! 」になった→null や undefined ではないと断言
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
