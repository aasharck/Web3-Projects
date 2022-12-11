import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { client } from '../pages/api/api';
import ProfileStyles from '../styles/Profile.module.css';
import axios from 'axios';
import { ethers } from 'ethers';

const Profile = () => {
  const [handle, setHandle] = useState();
  const [profile, setProfile] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [totalNetworth, setTotalNetWorth] = useState();

  const defaultProfile = gql`query Profiles {
        profiles(request: { handles: ["${handle}"], limit: 1 }) {
          items {
            id
            name
            bio
            attributes {
              displayType
              traitType
              key
              value
            }
            followNftAddress
            metadata
            isDefault
            picture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
              __typename
            }
            handle
            coverPicture {
              ... on NftImage {
                contractAddress
                tokenId
                uri
                verified
              }
              ... on MediaSet {
                original {
                  url
                  mimeType
                }
              }
              __typename
            }
            ownedBy
            dispatcher {
              address
              canUseRelay
            }
            stats {
              totalFollowers
              totalFollowing
              totalPosts
              totalComments
              totalMirrors
              totalPublications
              totalCollects
            }
            followModule {
              ... on FeeFollowModuleSettings {
                type
                amount {
                  asset {
                    symbol
                    name
                    decimals
                    address
                  }
                  value
                }
                recipient
              }
              ... on ProfileFollowModuleSettings {
               type
              }
              ... on RevertFollowModuleSettings {
               type
              }
            }
          }
          pageInfo {
            prev
            next
            totalCount
          }
        }
      }`;

  const getProfile = async (e) => {
    try {
      e.preventDefault();
      const tx = await client.query({ query: defaultProfile });
      console.log(tx);
      console.log(tx.data.profiles.items[0].ownedBy);
      setProfile(tx.data.profiles);

      // const metadata = await axios.get(tx.data.profiles.items[0].metadata)
      const options = {
        method: 'GET',
        url: 'https://api.opensea.io/api/v1/assets',
        params: {
          owner: tx.data.profiles.items[0].ownedBy,
          order_direction: 'desc',
          limit: '200',
          include_orders: 'false',
        },
        headers: { accept: 'application/json' },
      };
      // let fetchURL = ''
      // const nftsForOwner = await alchemy.nft.getNftsForOwner("0xdA86780f3902EbE7A92204D939CF1e03009ecf18");
      // console.log(nftsForOwner)
      const res = await axios.request(options);
      // const res2 = await res.json();
      console.log(res.data);
      setNfts(res.data.assets);


      //Tokens
      const ethTokenOptions = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/${tx.data.profiles.items[0].ownedBy}/erc20`,
        params: {chain: 'eth'},
        headers: {accept: 'application/json', 'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API}
      };

      const polygonTokenOptions = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/${tx.data.profiles.items[0].ownedBy}/erc20`,
        params: {chain: 'polygon'},
        headers: {accept: 'application/json', 'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API}
      };

      const ethTokenRes = await axios.request(ethTokenOptions);
      console.log(ethTokenRes.data)

      const polygonTokenRes = await axios.request(polygonTokenOptions);
      console.log(polygonTokenRes.data)

      const allEthTokens = ethTokenRes.data;
      const allPolTokens = polygonTokenRes.data;

      let netWorthETH=0;
      for(let i=0; i<allEthTokens.length; i++){
        if(allEthTokens[i].symbol != null){
          if(allEthTokens[i].symbol == 'USDT'){
            netWorthETH = netWorthETH + (allEthTokens[i].balance/10**(allEthTokens[i].decimals));
          }else if(allEthTokens[i].symbol == 'WMATIC'){
            const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`)
            const tokenValue = (allEthTokens[i].balance/10**(allEthTokens[i].decimals)) * priceOfEachToken.data.price;
            netWorthETH = netWorthETH + tokenValue;
          }else if(allEthTokens[i].symbol == 'WETH'){
            const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`)
            const tokenValue = (allEthTokens[i].balance/10**(allEthTokens[i].decimals)) * priceOfEachToken.data.price;
            netWorthETH = netWorthETH + tokenValue;
          }else if(allEthTokens[i].symbol == 'WBTC'){
            const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=WBTCUSDT`)
            const tokenValue = (allEthTokens[i].balance/10**(allEthTokens[i].decimals)) * priceOfEachToken.data.price;
            netWorthETH = netWorthETH + tokenValue;
          }else{
            if(allEthTokens[i].logo != null){
              const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${allEthTokens[i].symbol}USDT`)
              const tokenValue = (allEthTokens[i].balance/10**(allEthTokens[i].decimals)) * priceOfEachToken.data.price;
              netWorthETH = netWorthETH + tokenValue;
            }
          }
        }
      }
      console.log(netWorthETH);


      let netWorthPol=0;

      for(let i=0; i<allPolTokens.length; i++){
        if(allPolTokens[i].symbol != null){
          if(allPolTokens[i].symbol == 'USDT'){
            netWorthPol = netWorthPol + (allPolTokens[i].balance/10**(allPolTokens[i].decimals));
          }else if(allPolTokens[i].symbol == 'WMATIC'){
            const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`)
            const tokenValue = (allPolTokens[i].balance/10**(allPolTokens[i].decimals)) * priceOfEachToken.data.price;
            netWorthPol = netWorthPol + tokenValue;
          }else if(allPolTokens[i].symbol == 'WETH'){
            const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`)
            const tokenValue = (allPolTokens[i].balance/10**(allPolTokens[i].decimals)) * priceOfEachToken.data.price;
            netWorthPol = netWorthPol + tokenValue;
          }else if(allPolTokens[i].symbol == 'WBTC'){
            const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=WBTCUSDT`)
            const tokenValue = (allPolTokens[i].balance/10**(allPolTokens[i].decimals)) * priceOfEachToken.data.price;
            netWorthPol = netWorthPol + tokenValue;
          }else if(allPolTokens[i].symbol == 'USDC'){
            const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=USDCUSDT`)
            const tokenValue = (allPolTokens[i].balance/10**(allPolTokens[i].decimals)) * priceOfEachToken.data.price;
            netWorthPol = netWorthPol + tokenValue;
          }else{
            if(allPolTokens[i].logo != null){
              const priceOfEachToken = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${allPolTokens[i].symbol}USDT`)
              const tokenValue = (allPolTokens[i].balance/10**(allPolTokens[i].decimals)) * priceOfEachToken.data.price;
              netWorthPol = netWorthPol + tokenValue;
            }
          }
        }
      }
      console.log(netWorthPol)

      const options2 = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/${tx.data.profiles.items[0].ownedBy}/balance`,
        params: {chain: 'eth'},
        headers: {accept: 'application/json', 'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API}
      };

      const options3 = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/${tx.data.profiles.items[0].ownedBy}/balance`,
        params: {chain: 'polygon'},
        headers: {accept: 'application/json', 'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API}
      };

      const ethBalance = await axios.request(options2)
      const maticBalance = await axios.request(options3)



      const ethPrice = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`)
      const maticPrice = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=MATICUSDT`)

      
      const ethBalanceInUSD = (ethBalance.data.balance/10**18)*ethPrice.data.price
      const maticBalanceInUSD = (maticBalance.data.balance/10**18)*maticPrice.data.price

      console.log(ethBalanceInUSD)
      console.log(maticBalanceInUSD)

      setTotalNetWorth(netWorthETH + netWorthPol + ethBalanceInUSD + maticBalanceInUSD)
       
    } catch (error) {
      console.log(error);
    }
  };

  const test = async () => {
    try {
      const maticPrice = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`)
      // const tx = await axios.request(options)

      console.log(maticPrice)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className={ProfileStyles.profileCard}>
        <div className='text-center'>
          <div className='row'>
            <div className='col'></div>
            <div className={`col ${ProfileStyles.inputBox}`}><form onSubmit={(e) => getProfile(e)}>
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              onChange={(e) => setHandle(e.target.value)}
              placeholder='Lens Handle'
              aria-label='Lens Handle'
              aria-describedby='button-addon2'
            />
            <button
              className='btn btn-primary'
              type='button'
              id='button-addon2'
              onClick={getProfile}
            >
              Submit
            </button>
          </div>
          </form></div>
            <div className='col'></div>
          </div>
          
          {/* <button className='btn btn-danger' onClick={test}>Test</button> */}
          {profile !== null && <div className='mt-5'><img
            width='100'
            src={
              profile?.items[0]?.picture.uri != null ? profile?.items[0]?.picture.uri : (profile?.items[0]?.picture.original &&
              profile?.items[0]?.picture.original.url.startsWith('ipfs://')
                ? `http://lens.infura-ipfs.io/ipfs/` +
                  profile?.items[0]?.picture.original.url.slice(7)
                : profile?.items[0]?.picture?.original?.url ||
                  'https://placekitten.com/500/500')
            }
            className={ProfileStyles.profileImage}
          />
          <div className='mt-2'>{profile?.items[0]?.handle}</div>
          <div className='text-muted fs-6'>{profile?.items[0]?.bio}</div>
          <div className='row mt-4'>
            <div className={`col-lg-4`} >
            </div>
            <div className={`col-lg-4`}>
              <div className='row'>
                <div className={`col ${ProfileStyles.statCard}`}><b>{profile?.items[0]?.stats.totalFollowers.toLocaleString()} </b><div><span className='small text-muted'>Followers</span></div></div>
                <div className={`col ${ProfileStyles.statCard}`}><b>{profile?.items[0]?.stats.totalFollowing.toLocaleString()} </b><div><span className='small text-muted'>Following</span></div></div>
                <div className={`col ${ProfileStyles.statCard}`}><b>{profile?.items[0]?.stats.totalPosts.toLocaleString()} </b><div><span className='small text-muted'>Posts</span></div></div>
              </div>
            </div>
            <div className={`col-lg-4`}>
            </div>
          </div>
          <div className='row mt-4'>
            <div className={`col-lg-4`} >
            </div>
            <div className={`col-lg-4`}>
              <div className='row'>
                <div className={`col ${ProfileStyles.balanceCard}`}><b>${totalNetworth?.toLocaleString()} </b><div><span className='small text-muted'>Total Balance</span></div></div>
                <div className={`col ${ProfileStyles.balanceCard}`}><b>{nfts?.length}{nfts?.length == 200 && '+'} </b><div><span className='small text-muted'>NFTs</span></div></div>
              </div>
            </div>
            <div className={`col-lg-4`}>
            </div>
          </div>
          <div className='album py-5 mt-5'>
            <div className='container'>
              <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 g-lg-5'>
                {nfts?.map((nft, i) => {
                  if (nft.image_preview_url !== null) {
                    return (
                      <div className='col' key={i}>
                        <div className='card shadow'>
                          {nft.image_preview_url.endsWith('webm') ||
                          nft.image_preview_url.endsWith('mp4') || nft.image_preview_url.endsWith('mov') ? (
                            <video
                              src={nft.image_preview_url}
                              className='bd-placeholder-img card-img-top'
                              width='100%'
                              height='100%'
                              autoPlay
                            ></video>
                          ) : (
                            <img
                              src={nft.image_preview_url}
                              className='bd-placeholder-img card-img-top'
                              width='100%'
                              height='100%'
                              alt='...'
                            />
                          )}
                          <div className='card-body'>
                            <p className='card-text text-muted'>{nft.name}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          </div>
}
        </div>
      </div>
    </div>
  );
};

export default Profile;
