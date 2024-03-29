"use client"

import { useState, useEffect, useRef } from 'react'
import SocialLogin from '@biconomy/web3-auth'
import { ChainId } from '@biconomy/core-types'
import { ethers } from 'ethers'
import SmartAccount from '@biconomy/smart-account'
import { css } from '@emotion/css'

export default function Auth() {
    const [smartAccount, setSmartAccount] = useState(null)
    const [interval, enableInterval] = useState(false)
    const sdkRef = useRef(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let configureLogin
        if (interval) {
          configureLogin = setInterval(() => {
            if (!!sdkRef.current?.provider) {
              setupSmartAccount()
              clearInterval(configureLogin)
            }
          }, 1000)
        }
      }, [interval])


    async function login() {
        if (!sdkRef.current) {
            const socialLoginSDK = new SocialLogin()
            const signature1 = await socialLoginSDK.whitelistUrl('https://biconomy-social-auth.vercel.app')
            await socialLoginSDK.init({
                chainId: ethers.utils.hexValue(ChainId.POLYGON_MAINNET),
                whitelistUrls: {
                    'https://biconomy-social-auth.vercel.app': signature1,
                }
            })
            sdkRef.current = socialLoginSDK
        }
        if (!sdkRef.current.provider) {
            // sdkRef.current.showConnectModal()
            sdkRef.current.showWallet()
            enableInterval(true)
        } else {
            setupSmartAccount()
        }
    }

    async function setupSmartAccount() {
        if (!sdkRef?.current?.provider) return
        sdkRef.current.hideWallet()
        setLoading(true)
        const web3Provider = new ethers.providers.Web3Provider(
            sdkRef.current.provider
        )
        try {
            const smartAccount = new SmartAccount(web3Provider, {
                activeNetworkId: ChainId.POLYGON_MAINNET,
                supportedNetworksIds: [ChainId.POLYGON_MAINNET],
            })
            await smartAccount.init()
            setSmartAccount(smartAccount)
            setLoading(false)
        } catch (err) {
            console.log('error setting up smart account... ', err)
        }
    }

    const logout = async () => {
        if (!sdkRef.current) {
          console.error('Web3Modal not initialized.')
          return
        }
        await sdkRef.current.logout()
        sdkRef.current.hideWallet()
        setSmartAccount(null)
        enableInterval(false)
      }


      return (
        <div className={containerStyle}>
          <h1 className={headerStyle}>BICONOMY AUTH</h1>
          {
            !smartAccount && !loading && <button className={buttonStyle} onClick={login}>Login</button>
          }
          {
            loading && <p>Loading account details...</p>
          }
          {
            !!smartAccount && (
              <div className={detailsContainerStyle}>
                <h3>Smart account address:</h3>
                <p>{smartAccount.address}</p>
                <button className={buttonStyle} onClick={logout}>Logout</button>
              </div>
            )
          }
        </div>
      )
}


const detailsContainerStyle = css`
  margin-top: 10px;
`

const buttonStyle = css`
  padding: 14px;
  width: 300px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  outline: none;
  margin-top: 20px;
  transition: all .25s;
  &:hover {
    background-color: rgba(0, 0, 0, .2); 
  }
`

const headerStyle = css`
  font-size: 44px;
`

const containerStyle = css`
  width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 100px;
`