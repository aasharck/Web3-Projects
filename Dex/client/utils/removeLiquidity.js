import { Contract, providers, BigNumber, utils } from "ethers";
import { EXCHANGE_ADDRESS } from "../constants/constants";
import exchangeABI from "../constants/exchangeAbi.json";

export const removeLiquidity = async (signer, removeLPTokensWei) => {
  const exchangeContract = new Contract(EXCHANGE_ADDRESS, exchangeABI, signer);

  const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
  await tx.wait();
};

export const getTokensAfterRemove = async (
  provider,
  removeLPTokensWei,
  _ethBalance,
  safemoonTokenReserve
) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_ADDRESS,
      exchangeABI,
      provider
    );

    const totalSupply = await exchangeContract.totalSupply();
    const removeEth = _ethBalance.mul(removeLPTokensWei).div(totalSupply);
    const removeSF = safemoonTokenReserve
      .mul(removeLPTokensWei)
      .div(totalSupply);
    return { removeEth, removeSF };
  } catch (error) {
    console.log(error);
  }
};
