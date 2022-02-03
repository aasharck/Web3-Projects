import React, {useEffect, useState} from 'react';
import './Arena.css'
import abi from '../../utils/nftGame.json'
import { ethers } from "ethers";
import { contractAddress, transformNFTData } from '../../Constants/constants'

const Arena = ({ characterNFT, setCharacterNFT }) => {

const contractABI = abi.abi;
const [gameContract, setGameContract] = useState(null);
const [boss, setBoss] = useState(null)

const [attackState, setAttackState] = useState('');
const [isLoading, setIsLoading] = useState(false);


useEffect(() =>{
  try{
  if(!window.ethereum){
      console.log("No Ethereum Object Detected");
      }
  else{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContractInstance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

  console.log("HERE HERE HERE", characterNFT);
    setGameContract(gameContractInstance);
  }
  }catch(error){
    console.log("ERRORRRRRRR", error)
  }
},[]);


useEffect(() => {

  const fetchBoss = async () =>{
    const bossTxn = await gameContract.getBigBoss();
    console.log("===================BOSSS")
    console.log("boss:", bossTxn);
    setBoss(transformNFTData(bossTxn))
  }

const onAttackComplete = (newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber();
            const playerHp = newPlayerHp.toNumber();

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            setBoss((prevState) => {
                return { ...prevState, hp: bossHp };
            });

            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp };
            });
        };

  if (gameContract) {
    fetchBoss();
    gameContract.on('UpdatedHps', onAttackComplete);
  }
  
return () => {
            if (gameContract) {
                gameContract.off('UpdatedHps', onAttackComplete);
            }
        }
},[gameContract])


const runAttackAction = async () => {
  try {
    if (gameContract) {
      setAttackState('attacking');
      console.log('Attacking boss...');
      const attackTxn = await gameContract.attackBoss();
      await attackTxn.wait();
      console.log('attackTxn:', attackTxn);
      setAttackState('hit');
    }
  } catch (error) {
    console.error('Error attacking boss:', error);
    setAttackState('');
  }
};




return(
  <div className="arena-container">
{`${boss.name}`}
      {boss && (
      <div className="boss-container">
        <div className={`boss-content ${attackState}`}>
          <h2> 
          {`${boss.name}`}
          </h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={runAttackAction}>
            {`Attack ${boss.name}`}
          </button>
        </div>
      </div>
    )}

      {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{`${characterNFT.name}`}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
)
}

export default Arena;