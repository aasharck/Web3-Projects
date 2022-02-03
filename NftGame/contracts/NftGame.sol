// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./libraries/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract NftGame is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NFTMinted(address _sender, uint _tokenId, uint _charId);
    event UpdatedHps(uint _bossHp, uint playerHp);

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    BigBoss public boss;

    struct characterAttributes {
        uint256 characterId;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    characterAttributes[] characters;

    mapping(address => uint256) public nftHolders;
    mapping(uint256 => characterAttributes) public nftHolderAttributes;

    constructor(
        string[] memory _characterNames,
        string[] memory _imageURIs,
        uint256[] memory _characterHps,
        uint256[] memory _characterAD,
        string memory _bossName,
        string memory _bossImage,
        uint256 _bossHp,
        uint256 _bossAD
    ) ERC721("FOOTWARS", "FTW") {
        console.log("Better than Axie Infinity");

        boss = BigBoss({
            name: _bossName,
            imageURI: _bossImage,
            hp: _bossHp,
            maxHp: _bossHp,
            attackDamage: _bossAD
        });

        console.log("%s Has been Created with HP %d", boss.name, boss.hp);

        for (uint256 i = 0; i < _characterNames.length; i++) {
            characters.push(
                characterAttributes({
                    characterId: i,
                    name: _characterNames[i],
                    imageURI: _imageURIs[i],
                    hp: _characterHps[i],
                    maxHp: _characterHps[i],
                    attackDamage: _characterAD[i]
                })
            );

            characterAttributes memory c = characters[i];
            console.log(
                "The characters are %s -- %s -- %d",
                c.name,
                c.imageURI,
                c.maxHp
            );
        }
        _tokenIds.increment();
    }

    function checkIfUserHasNFT() public view returns (characterAttributes memory){

        uint nftUserTokenId = nftHolders[msg.sender];

        if(nftUserTokenId > 0){
            return nftHolderAttributes[nftUserTokenId];
        } else{
            characterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllDefaultCharacters() public view returns(characterAttributes[] memory){
        return characters;
    }

    function getBigBoss() public view returns(BigBoss memory){
        return boss;
    }

    function mintNFT(uint256 _id) public {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = characterAttributes({
            characterId: _id,
            name: characters[_id].name,
            imageURI: characters[_id].imageURI,
            hp: characters[_id].hp,
            maxHp: characters[_id].maxHp,
            attackDamage: characters[_id].attackDamage
        });

        console.log(
            "Minted the NFT -- %s with tokenId -- %d and ID --- %d",
            characters[_id].name,
            newItemId,
            _id
        );

        nftHolders[msg.sender] = newItemId;
        _tokenIds.increment();

        emit NFTMinted(msg.sender, newItemId, _id);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        characterAttributes memory charAttributes = nftHolderAttributes[
            _tokenId
        ];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(
            charAttributes.attackDamage
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "NFT that lets you battle with your favorite footballers", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function attackBoss() public{

        uint nftTokenIdPlayer = nftHolders[msg.sender];
        characterAttributes storage player = nftHolderAttributes[nftTokenIdPlayer];
        console.log("%s is ready to attack with %d HP and %d AD", player.name,player.hp, player.attackDamage);
        console.log("%s has %d HP and %d AD", boss.name, boss.hp, boss.attackDamage);

        require(player.hp>0, "ALERTT! Your player cannot attack because you do not have enough HP");
        require(boss.hp>0, "ALERTT! Boss is already DEAD");

        if(boss.hp <= player.attackDamage){
            boss.hp = 0;
        } else{
            boss.hp -= player.attackDamage;
        }
    
        if(player.hp <= boss.attackDamage){
            player.hp = 0;
        } else{
            player.hp -= boss.attackDamage;
        }

        console.log("%s has attacked the boss. Boss now has %d", player.name, boss.hp);
        console.log("%s has attacked %s. Player now has %d", boss.name,player.name, player.hp);

        emit UpdatedHps(boss.hp, player.hp);
    }

}
