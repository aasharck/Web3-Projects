import './App.css';
import Navbar from './Navbar';
import { gql } from '@apollo/client';
import client from './client';
import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let query = gql`
        query ExploreProfiles {
          exploreProfiles(request: { sortCriteria: MOST_FOLLOWERS }) {
            items {
              id
              name
              handle
              bio
              picture {
                ... on NftImage {
                  uri
                }
                ... on MediaSet {
                  original {
                    url
                    mimeType
                  }
                }
              }
              stats {
                totalFollowers
                totalFollowing
                totalPosts
              }
            }
          }
        }
      `;
      client.query({ query }).then(({ data }) => {
        console.log(data.exploreProfiles);
        setUsers(data.exploreProfiles.items);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='container'>
      {users.map((user) => (
      <div key={user.id} className='card mb-3 mt-5 shadow mx-auto' style={{maxWidth: "540px"}}>
        <div className='row g-0'>
          <div className='col-md-4'>
            <img src={user.picture.original && user.picture.original.url.startsWith('ipfs://') ? `http://lens.infura-ipfs.io/ipfs/` + user.picture.original.url.slice(7) : user.picture?.original?.url || "https://placekitten.com/500/500"} className='img-fluid rounded-start' alt='...' />
          </div>
          <div className='col-md-8'>
            <div className='card-body'>
              <h5 className='card-title'>{user.handle}</h5>
              <p className='card-text'>
                <small className='text-muted'><b>{user.stats.totalFollowers}</b> Followers</small>
                {" / "}<small className='text-muted'><b>{user.stats.totalFollowing}</b> Following</small>
              </p>
              <p className='card-text'>
              {user.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
      ))}
      </div>
    
      
    </div>
  );
}

export default App;
