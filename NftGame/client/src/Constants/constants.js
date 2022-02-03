 const contractAddress = '0xd0e663198989e5B9806C22d14d6a5Fd20E293491';

  const transformNFTData = (characterData) =>{
    console.log("Transforming..")
    return{
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  };

export {contractAddress, transformNFTData};