// In front end javascript we can't use "require" keyword to import packages
import { ethers, providers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalanceofContract;
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

async function getBalanceofContract() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(
      `Balance of the Contract: ${ethers.utils.formatEther(balance)}`
    );
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
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
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash} ...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `Completed with  ${transactionReciept.confirmations} confirmations`
      );
    });
    resolve();
  });
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing ...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
