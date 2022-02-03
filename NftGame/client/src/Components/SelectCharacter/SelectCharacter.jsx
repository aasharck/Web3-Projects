import React, {useEffect, useState} from 'react';
import './SelectCharacter.css'
import abi from '../../utils/nftGame.json'
import { ethers } from "ethers";
import { contractAddress, transformNFTData } from '../../Constants/constants'

const SelectCharacter = ({ setCharacterNFT }) => {

  const contractABI = abi.abi;
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  

  useEffect(()=>{
    try{ 

      if(!window.ethereum){
        console.log("No metamask")
      }else{

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const gameContractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setGameContract(gameContractInstance);
    }
    }catch(error){
      console.log(error);
    }


    
  },[])


useEffect(()=>{

  const getCharacters = async () =>{
  try{
  console.log("Getting all character for you to mint");

      const txn = await gameContract.getAllDefaultCharacters();
      console.log(txn);

      const allCharacters = txn.map((characterData) =>
        transformNFTData(characterData)
      );

      setCharacters(allCharacters);

    }catch(error){
  console.log(error)
  }
}

const onCharacterMint = async (sender, tokenId, characterIndex) => {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
    );
    if (gameContract) {
      const charNFT = await gameContract.checkIfUserHasNFT();
      console.log('CharacterNFT: ', charNFT);
      setCharacterNFT(transformNFTData(charNFT));
      console.log("CHARHACTERRR NFT", charNFT)
    }
  };

if(gameContract){
  getCharacters();
  gameContract.on('NFTMinted', onCharacterMint);
}

return () => {
    if (gameContract) {
      gameContract.off('NFTMinted', onCharacterMint);
    }
  };
  },[gameContract])

const mintNFTButton = (i) => async () =>{
  try{
  if(gameContract){
    console.log("Minting in Progress")
    const mintPlayer = await gameContract.mintNFT(i);
    await mintPlayer.wait();
    console.log("Minted the player", mintPlayer);
  }
}catch(error){
  console.log(error)
}
    
  }

  const renderCharacters = () =>{
    return(characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src={character.imageURI} alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
        onClick={mintNFTButton(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  )));
  }

  return(
    <div className="select-character-container">
    <h2>Mint Your Player!</h2>
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
    </div>
  )

}

export default SelectCharacter;