
import { useEffect, useState, useRef} from "react";
import getWeb3 from "./getWeb3";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";

function App() {
  const accounts = useRef()
  const itemManager = useRef()
  const item = useRef()
  const [itemPrice, setItemPrice] = useState()
  const [itemIdentifier, setItemIdentifier] = useState()
  const [itemAddress, setItemAddress] = useState()

  useEffect(()=>{
    try {
      (async () =>{
        const web3 = await getWeb3();
        accounts.current = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        itemManager.current = new web3.eth.Contract(
          ItemManagerContract.abi, 
          ItemManagerContract.networks[networkId] && ItemManagerContract.networks[networkId].address
        )
        item.current = new web3.eth.Contract(
          ItemContract.abi,
          ItemContract.networks[networkId] && ItemContract.networks[networkId].address
        )
        paymentListener()
      })() 
    } catch (err) {
      console.log(err)
    }
  },[])

  async function handleCreateitem() {
    const result = await itemManager.current.methods.crateItem(itemIdentifier, parseInt(itemPrice, 10)).send({from: accounts.current[0]}, (err, hash)=>{
      console.log(err)
      console.log(`Transaction hash: ${hash}`)
    })
    setItemAddress(result.events.supplyChainStep.returnValues._itemAddress)
    alert(`The item address is ${result.events.supplyChainStep.returnValues._itemAddress}\nAsk customer to pay.`)
  }

  function paymentListener() {
    itemManager.current.events.supplyChainStep().on("data", async (data)=>{
      if (data.returnValues._step == 1){
        const itemObj = await itemManager.current.methods.items(data.returnValues._itemIndex).call()
        alert(`Item # ${data.returnValues._itemIndex} - ${itemObj._identifier} has been paid, will deliver soon`)
      }      
    })
  }

  return (
    <div className="App">
      <h1>Event Trigger/ supply chain example</h1>
      <h2>Items</h2>
      <h2>Add item</h2>
        <div>
          Item price
          <input onChange={(evt)=>{setItemPrice(evt.target.value)}} />  
          Item identifier
          <input onChange={(evt)=>{setItemIdentifier(evt.target.value)}} /> 
          <button onClick={handleCreateitem}>Create</button>
          {itemAddress && <p>New Item created, ask customer to pay to: {itemAddress}</p> }
        </div>
    </div>
  );
}

export default App;
