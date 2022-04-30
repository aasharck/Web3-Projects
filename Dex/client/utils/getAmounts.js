import { Contract } from "ethers";
import { EXCHANGE_ADDRESS, TOKEN_ADDRESS } from "../constants/constants";
import exchangeABI from '../constants/exchangeAbi.json';
import tokenABI from '../constants/tokenABI';


export const getEtherBalance = async(provider, address ,contract=false) =>{

    try{
        if(contract){
            const balance = await provider.getBalance(EXCHANGE_ADDRESS);
            return balance;
        }else{
            const balance = await provider.getBalance(address);
            return balance;
        }

    }catch(error){
        console.log(error);
        return 0;   
    }

}

export const getSafemoonBalance = async(provider, address) =>{
    try{
        const tokenContract = new Contract(TOKEN_ADDRESS, tokenABI, provider);
        const balance = await tokenContract.balanceOf(address);
        return balance;

    }catch(error){
        console.log(error);
        return 0;
    }
}

export const LPTokenBalance = async(provider, address) =>{
    try{
        const exchangeContract = new Contract(EXCHANGE_ADDRESS, exchangeABI, provider);
        const balance = await exchangeContract.balanceOf(address);
        return balance;

    }catch(error){
        console.log(error);
        return 0;
    }
}

export const getReserveTokens = async(provider) =>{
    try{
        const exchangeContract = new Contract(EXCHANGE_ADDRESS, exchangeABI, provider);
        const balance = await exchangeContract.getReserve();
        return balance;

    }catch(error){
        console.log(error);
        return 0;
    }
}