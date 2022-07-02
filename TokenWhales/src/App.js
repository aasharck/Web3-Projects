import React, { useEffect, useState } from "react";
import axios from "axios";
// import RelativeTime from '@yaireo/relative-time'
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [contAddress, setContAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [usdPrice, setUsdPrice] = useState(0);
  const [network, setNetwork] = useState("ethereum");
  const [scan, setScan] = useState("");
  const [api, setApi] = useState("");
  const [limit, setLimit] = useState("");
  // const [acc, setAcc] = useState('')
  // const relativeTime = new RelativeTime();
  // let Cname;
  // const [name, setName] = useState([]);
  // https://api.rarible.org/v0.1/activities/byUser?user=ETHEREUM:0x726CDC837384a7Deb8bbea64beba2E7b4d7346c0&type=BUY&size=5&sort=LATEST_FIRST

  // const getData = (account) => {
  //   const options = { method: "GET", headers: { Accept: "application/json" } };

  // fetch(
  //     `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${account}&page=1&offset=5&sort=desc&apikey=YN3F6GBMISV6F4MEQQY7JUKFYR5UPKBJ7C`,
  //     options
  //   )
  //     .then((response) => response.json())
  //     .then((response) => {
  //       setData(response.result);
  //       console.log(response.result);
  //       // let d = new Date.now(0);
  //       // console.log(d);
  //       console.log(   relativeTime.from(new Date(1650075140))  )
  //     })
  //     .catch((err) => console.error(err));
  // };

  useEffect(() => {
    if (network === "ethereum") {
      setScan("etherscan.io");
      setApi("YN3F6GBMISV6F4MEQQY7JUKFYR5UPKBJ7C");
    } else {
      setScan("bscscan.com");
      setApi("GFURI4QSFM292JNWRWJRTCV7PBHVC8MI7D");
    }
  }, [network]);


  const getScammers = (contAddress) => {
    try {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/token_price/${network}?contract_addresses=${contAddress}&vs_currencies=usd`
        )
        .then((res) => {
          let abcd = contAddress.toLowerCase();
          let b = res.data[abcd].usd;
          setUsdPrice(b);
        });

      axios
        .get(
          `https://api.${scan}/api?module=account&action=tokentx&contractaddress=${contAddress}&page=1&offset=1000&sort=desc&apikey=${api}`
        )
        .then((res) => {
          setTokenName(res.data.result[0].tokenName);
          setData(res.data.result);
          console.log(res.data.result);
          console.log(res.data.result[0].tokenName);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const changeNetwork = (net) => {
    setNetwork(net);
  };

  // 0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce - ShibaInu
  // 0xba2ae424d960c26247dd6c32edc70b295c744c43 - Doge
  // 0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b - cronos
  // https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5&vs_currencies=usd

  return (
    <div className="container">
      <input
        placeholder="Token Contract Address"
        type="text"
        value={contAddress}
        onChange={(e) => {
          setContAddress(e.target.value);
        }}
      />
      <input
        placeholder="Limit in Native Token Value"
        type="text"
        value={limit}
        onChange={(e) => {
          setLimit(e.target.value);
        }}
      />
      <button
        className="btn btn-primary"
        onClick={() => {
          getScammers(contAddress);
        }}
      >
        Get erc20 txs
      </button>
      <select
        className="form-select"
        onChange={(e) => changeNetwork(e.target.value)}
        value={network}
      >
        <option value="ethereum">Ethereum</option>
        <option value="binance-smart-chain">Binance Smart Chain</option>
      </select>
      {/* <button className="btn btn-info" onClick={getPrice}>Test</button> */}
      <h1>Token Name Selected : {tokenName}</h1>
      <div>
        {data.map((tx, i) => {
          if (tx.value / 10 ** tx.tokenDecimal >= limit) {
            // let xyz = getCollectionName(nft.nft.type.contract,nft.nft.type.tokenId);
            return (
              <div key={i}>
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-11">
                        {Date(tx.timeStamp)}
                        {tx.from} to {tx.to} with value of{" "}
                        {(tx.value / 10 ** tx.tokenDecimal).toLocaleString()}{" "}
                        (USD AMOUNT - $
                        {(
                          (tx.value / 10 ** tx.tokenDecimal) *
                          usdPrice
                        ).toLocaleString()}
                        )
                      </div>
                      {/* <div className="col-1"><img src={a} /></div> */}
                      <div className="col-1">
                        <a href={`https://${scan}/tx/${tx.hash}`}>LINK</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default App;
