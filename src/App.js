
import { useEffect, useState} from "react";
import getWeb3 from "./getWeb3";

function App() {
  const [networkId, setNetworkId] = useState()
  const [accounts, setAccounts] = useState()

  useEffect(()=>{
    (async () =>{
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      setNetworkId(networkId)
      setAccounts(accounts)
    })()    
  },[])

  return (
    <div className="App">
      <div>NetworkID: {networkId}</div>
      <div>Accounts: {accounts}</div>
    </div>
  );
}

export default App;
