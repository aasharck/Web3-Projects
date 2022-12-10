import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { client } from '../pages/api/api';
import ProfileStyles from '../styles/Profile.module.css';
import axios from 'axios';

const Profile = () => {
  const [handle, setHandle] = useState();
  const [profile, setProfile] = useState(null);
  const [nfts, setNfts] = useState([]);

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
       
    } catch (error) {
      console.log(error);
    }
  };

  const test = async () => {
    try {
      const options = {
        method: 'GET',
        url: `https://deep-index.moralis.io/api/v2/erc20/${tx.data.profiles.items[0].ownedBy}/price`,
        params: {chain: 'eth'},
        headers: {accept: 'application/json', 'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API}
      };
      const tx = await axios.request(options)

      console.log(tx)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className={ProfileStyles.profileCard}>
        <div className='text-center'>
          <form onSubmit={(e) => getProfile(e)}>
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
          </form>
          <button className='btn btn-danger' onClick={test}>Test</button>
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
            <div className='col'>
              {profile?.items[0]?.stats.totalFollowers} <b>Followers</b>
            </div>
            <div className='col'>
              {profile?.items[0]?.stats.totalFollowing} <b>Following</b>
            </div>
            <div className='col'>
              {profile?.items[0]?.stats.totalPosts} <b>Posts</b>
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
