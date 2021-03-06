import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import './App.css';

// Update with the contract address logged out to the CLI when it was deployed 
const greeterAddress = 'CONTRACT_ADDRESS';

function App() {

  // store greeting in local state
  const [greeting, setGreetingValue] = useState('default')
  const [string, setString] = useState('');

  // request access to the user's MetaMask account
  async function requestAccount() {
    console.log('request accounts')
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }  
  
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('red2');
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet();
        setString(data);
      } catch (err) {
        console.log("Error: ", err)
      }
    } else {
      console.log('window.ethereum not defined')
    }
  }  
  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="greeting">{string}</div>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;