import { Contract } from "ethers";
import { EXCHANGE_ADDRESS, TOKEN_ADDRESS } from "../constants/constants";
import exchangeABI from "../constants/exchangeAbi.json";
import tokenABI from "../constants/tokenABI";

export const getAmountOfTokensReceivedFromSwap = async (
  _swapAmountInWei,
  provider,
  ethSelected,
  ethBalance,
  reservedSF
) => {
  const exchangeContract = new Contract(
    EXCHANGE_ADDRESS,
    exchangeABI,
    provider
  );

  let amountOfTokens;

  if (ethSelected) {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountInWei,
      ethBalance,
      reservedSF
    );
  } else {
    amountOfTokens = await exchangeContract.getAmountOfTokens(
      _swapAmountInWei,
      reservedSF,
      ethBalance
    );
  }
  return amountOfTokens;
};

export const swapTokens = async (
  signer,
  swapAmountInWei,
  tokenToBeReceivedAfterSwap,
  ethSelected
) => {
  const exchangeContract = new Contract(EXCHANGE_ADDRESS, exchangeABI, signer);

  const tokenContract = new Contract(TOKEN_ADDRESS, tokenABI, signer);

  let tx;

  if(ethSelected){
      tx = await exchangeContract.swapEthForSafemoon(
          tokenToBeReceivedAfterSwap,
          {
              value: swapAmountInWei
          }
      )
  }else{

    tx = await tokenContract.approve(
        EXCHANGE_ADDRESS,
        swapAmountInWei.toString()
      );
      await tx.wait();
      tx = await exchangeContract.swapSafemoonForEth(
          swapAmountInWei,
          tokenToBeReceivedAfterSwap
      )
  }
  await tx.wait();
};
