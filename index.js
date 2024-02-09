// In front end javascript we can't use "require" keyword to import packages
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("I see Metamask");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    console.log("connected");
    connectButton.innerHTML = "Connected!";
  } else {
    console.log("no metamask");
    connectButton.innerHTML = "Please Install Metamask";
  }
}

async function fund() {
  const ethAmount = "0.01";
  console.log(`Funding ... ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    //we provider for connection to blockchain
    //wallet
    //contract and its ABI and address
    const provider = new ethers.providers.Web3Provider(window.ethereum); //it is an objetc from ethers
    const signer = await provider.getSigner(); //gets the accounted which is connected to the site
    console.log(`Signer : ${await signer.getAddress()}`);
    const address = await signer.getAddress();
    // console.log(`Connected Account Address: ${address}`);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
