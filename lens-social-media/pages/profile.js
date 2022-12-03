import { gql } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Navbar from '../components/Navbar'
import { client } from './api/api'
import ProfileStyles from '../styles/Profile.module.css'

const profile = () => {
    const {address} = useAccount()
    const [profile, setProfile] = useState()
    useEffect(() => {
        getProfile()
    },[])

    const defaultProfile = gql`query DefaultProfile {
        defaultProfile(request: { ethereumAddress: "${address}"}) {
          id
          name
          bio
          isDefault
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          handle
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              chainId
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
          }
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              chainId
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
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
              contractAddress
              amount {
                asset {
                  name
                  symbol
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
      }`

    const getProfile = async () => {
        try {
            const tx = await client.query({query: defaultProfile});
            console.log(tx.data.defaultProfile);
            setProfile(tx.data.defaultProfile)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div>
        <Navbar />
        <div className={ProfileStyles.profileCard}>
            <div className='text-center'>
                <img width='100' src={profile?.picture.original.url} className={ProfileStyles.profileImage}/>
                <div className='mt-2'>{profile?.handle}</div>
                <div className='text-muted fs-6'>id: {profile?.id}</div>
                <div className='row mt-4'>
                    <div className='col'>{profile?.stats.totalFollowers} <b>Followers</b></div>
                    <div className='col'>{profile?.stats.totalFollowing} <b>Following</b></div>
                    <div className='col'>{profile?.stats.totalPosts} <b>Posts</b></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default profile