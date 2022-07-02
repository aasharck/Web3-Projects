import React, { useEffect, useState } from "react";
import axios from 'axios';
import RelativeTime from '@yaireo/relative-time'
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [acc, setAcc] = useState('')
  const relativeTime = new RelativeTime();
  // let Cname;
  // const [name, setName] = useState([]);
      // https://api.rarible.org/v0.1/activities/byUser?user=ETHEREUM:0x726CDC837384a7Deb8bbea64beba2E7b4d7346c0&type=BUY&size=5&sort=LATEST_FIRST


  const getData = (account) => {
    const options = { method: "GET", headers: { Accept: "application/json" } };

  fetch(
      `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${account}&page=1&offset=5&sort=desc&apikey=YN3F6GBMISV6F4MEQQY7JUKFYR5UPKBJ7C`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setData(response.result);
        console.log(response.result);
        // let d = new Date.now(0);
        // console.log(d);
        console.log(   relativeTime.from(new Date(1650075140))  )
      })
      .catch((err) => console.error(err));
  };


  const getImage = (collectionAddress) =>{
    const options = { method: "GET", headers: { Accept: "application/json" } };

  let res = fetch(
      `https://api.rarible.org/v0.1/collections/ETHEREUM:${collectionAddress}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log(response.meta.content[0].url);
        // let d = new Date.now(0);
        // console.log(d);
        return response.meta.content[0].url
      })
      .catch((err) => console.error(err));

      console.log(res)
      return res;
  }

  const testingButton = async (contAddress) =>{

    let response = await axios.get(`https://api.rarible.org/v0.1/collections/ETHEREUM:${contAddress}`)
      .then(res => {
        const images = res.data.meta.content[0].url;
        // console.log(images);
        return images;
        
      })
      // console.log(response);
      return response;
  }



  return (
    <div className="container">
      <input type='text' value={acc} onChange={(e) => {setAcc(e.target.value)}} />
      <button className="btn btn-primary" onClick={() => {getData(acc)}}>
        Get Data
      </button>
      {/* <button className="btn btn-info" onClick={() => {getImgURL}}>Test</button> */}
      <div>
        {data.map((nft, i) => {
          // let xyz = getCollectionName(nft.nft.type.contract,nft.nft.type.tokenId);
          return (
            <div key={i}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-11">
                      {nft.timeStamp}: {nft.from === "0x0000000000000000000000000000000000000000"?"MINT": ( nft.from.toUpperCase() === acc.toUpperCase() ? "SOLD" : "BOUGHT" )} - {nft.tokenName} of TokenId #{nft.tokenID}
                    </div>
                    {/* <div className="col-1"><img src={a} /></div> */}
                    <div className="col-1"><a href={`https://etherscan.io/tx/${nft.hash}`}>LINK</a></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}


      </div>
    </div>
  );
}

export default App;
