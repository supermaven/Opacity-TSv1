import Web3 from "web3";
import BN from "bn.js";

import OPQTokenABI from "./contracts/OPQToken.abi.json";
import OPCTSwapABI from "./contracts/OPCTSwap.abi.json";

const OPQ_TOKEN_CONTRACT_ADDRESS = "0x77599D2C6DB170224243e255e6669280F11F1473";
const OPCT_SWAP_CONTRACT_ADDRESS = "0x5A1067A32015EFaD8E96F7f85e784FFC0e6a28Fe";

declare global {
interface Window {
  ethereum: any;
  web3: any;
}
}

const isInstalled = !!window.ethereum;

const web3 = new Web3(window.ethereum);

const OPQToken = new web3.eth.Contract(OPQTokenABI, OPQ_TOKEN_CONTRACT_ADDRESS);
const OPCTSwap = new web3.eth.Contract(OPCTSwapABI, OPCT_SWAP_CONTRACT_ADDRESS);

const gasPrice = web3.utils.toWei(new BN(50), "gwei");

const getTokenBalance = async () => (
  new BN(
    await OPQToken.methods
      .balanceOf(
        (await web3.eth.requestAccounts())[0]
      )
      .call({
        gasPrice
      })
  ).div(new BN(1 + "0".repeat(18), 10))
);

const approveTokens = async () => (
  OPQToken.methods
    .approve(
      OPCT_SWAP_CONTRACT_ADDRESS,
      // should be able to do up to 32 bytes, but it wasn't working. 16 is sufficient
      new BN("0x" + "F".repeat(32), "hex")
    )
    .send({
      from: (await web3.eth.requestAccounts())[0],
      gasPrice
    })
);

const swapTokens = async () => (
  OPCTSwap.methods
    .swap()
    .send({
      from: (await web3.eth.requestAccounts())[0],
      gasPrice
    })
);

export {
  isInstalled,
  getTokenBalance,
  approveTokens,
  swapTokens,
  OPQ_TOKEN_CONTRACT_ADDRESS,
  OPCT_SWAP_CONTRACT_ADDRESS
};
