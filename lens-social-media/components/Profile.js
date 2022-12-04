import { gql } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { client } from '../pages/api/api';
import ProfileStyles from '../styles/Profile.module.css';
import { Network, Alchemy } from 'alchemy-sdk';
import axios from 'axios';

const Profile = () => {
  const [handle, setHandle] = useState();
  const [profile, setProfile] = useState();
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

  const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  // axios
  //   .request(options)
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  const getProfile = async () => {
    try {
      const tx = await client.query({ query: defaultProfile });
      console.log(tx);
      console.log(tx.data.profiles.items[0].ownedBy);
      setProfile(tx.data.profiles);

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
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className={ProfileStyles.profileCard}>
        <div className='text-center'>
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
          <img
            width='100'
            src={
              profile?.items[0]?.picture.original &&
              profile?.items[0]?.picture.original.url.startsWith('ipfs://')
                ? `http://lens.infura-ipfs.io/ipfs/` +
                  profile?.items[0]?.picture.original.url.slice(7)
                : profile?.items[0]?.picture?.original?.url ||
                  'https://placekitten.com/500/500'
            }
            className={ProfileStyles.profileImage}
          />
          <div className='mt-2'>{handle}</div>
          <div className='text-muted fs-6'>id: {profile?.items[0]?.id}</div>
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
          <div class="album py-5 mt-5">
          <div class="container">

            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5">
            {nfts?.map((nft, i) => {
                    if (nft.image_preview_url !== null) {
                      return (
              <div class="col" key={i}>
                <div class="card shadow">
                <img src={nft.image_preview_url} className="bd-placeholder-img card-img-top" width="100%" height="100%" alt='...' />
                  <div class="card-body">
                    <p class="card-text text-muted">{nft.name}</p>
                    
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
      </div>
    </div>
  );
};

export default Profile;
