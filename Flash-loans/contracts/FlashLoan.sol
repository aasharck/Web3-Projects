// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICurve{
  function exchange(int128 i, int128 j, uint256 _dx, uint256 _min_dy) external returns(uint256);
}


contract SimpleFlashLoan is FlashLoanSimpleReceiverBase {
  using SafeMath for uint;
  event Log(address asset, uint val);

  ICurve public curveContract;
  address public CurvePool = 0xe4ae3Ee65bb687045e401827b404FeE34BE4BA53; //for 4Pool - Polygon

  constructor(IPoolAddressesProvider provider) FlashLoanSimpleReceiverBase(provider) {
    curveContract = ICurve(CurvePool);
  }

  function swapFromCurve(int128 i, int128 j, uint256 _dx, uint256 _min_dy) public returns(uint256){
    IERC20(0xE6469Ba6D2fD6130788E0eA9C0a0515900563b59).approve(CurvePool,1 ether);
    uint256 hehe = curveContract.exchange(i,j,_dx,_min_dy);
    return hehe;
  }

  function createFlashLoan(address asset, uint amount) external {
    address receiver = address(this);
    bytes memory params = "";
    uint16 referralCode = 0;

    emit Log(asset, IERC20(asset).balanceOf(address(this)));

    POOL.flashLoanSimple(
      receiver,
      asset,
      amount,
      params,
      referralCode
    );
  }

  function executeOperation(
    address asset,
    uint256 amount,
    uint256 premium,
    address initiator,
    bytes calldata params
  ) external returns (bool){
    // run arbitrage or liquidations here
    // abi.decode(params) to decode params
    
    emit Log(asset, IERC20(asset).balanceOf(address(this)));
    
    uint amountOwing = amount.add(premium);
    IERC20(asset).approve(address(POOL), amountOwing);

    return true;
  }
}