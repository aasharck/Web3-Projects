import logo from "./logo.svg";
import "./App.css";
import abi from "./utils/contractABI.json";

const App = () => {
  const contract_address = 0xb50d31eb90eabf833314a828edf19392a427e266;
  const contractABI = abi.abi;
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
};

export default App;
