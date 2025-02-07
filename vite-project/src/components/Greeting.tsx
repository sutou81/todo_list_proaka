const Components = {
  Greeting: (props: { name: string }) => {
    return <h2>こんにちは、{props.name}さん！</h2>;
  },
  Farewell: (props: { name: string }) => {
    return <h2>さようなら、{props.name}さん！</h2>;
  },
  Message:(props:{name:string, condision:string})=>{
    return <div className="greeting">
    <h2 style={{ color: "red", fontSize: "80px" }}>こんにちは、<span style={{color:"blue"}}>{props.name}</span>さん！{props.condision}</h2>
  </div>;
}
};

export default Components;