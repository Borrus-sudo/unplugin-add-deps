import { useEffect, useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App({ hello }) {
  const [count, setCount] = useState(0);
  const memoed = useMemo(() => count, []);
  useEffect(() => {
    console.log(hello);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
