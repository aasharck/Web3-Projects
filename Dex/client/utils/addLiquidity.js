import { Contract, utils } from "ethers";
import { EXCHANGE_ADDRESS, TOKEN_ADDRESS } from "../constants/constants";
import exchangeABI from "../constants/exchangeAbi.json";
import tokenABI from "../constants/tokenABI";

export const addLiquidity = async (signer, addSFAmountWei, addEthAmountWei) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_ADDRESS,
      exchangeABI,
      signer
    );
    const tokenContract = new Contract(TOKEN_ADDRESS, tokenABI, signer);

    let tx = await tokenContract.approve(
      EXCHANGE_ADDRESS,
      addSFAmountWei.toString()
    );
    await tx.wait();

    tx = await exchangeContract.addLiquidity(addSFAmountWei, {
      value: addEthAmountWei,
    });
    await tx.wait();
  } catch (error) {
    console.log(error);
  }
};

export const calculateSF = async (
  _addEth = 0,
  etherBalanceContract,
  sfTokenReserve
) => {
  try {
    const _addEthAmountWei = utils.parseEther(_addEth);
    const safemoonAmount = _addEthAmountWei
      .mul(sfTokenReserve)
      .div(etherBalanceContract);
    return safemoonAmount;
  } catch (error) {
    console.log(error);
  }
};
