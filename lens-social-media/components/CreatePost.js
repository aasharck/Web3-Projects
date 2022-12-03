import React, {useContext} from 'react';
import { gql } from '@apollo/client';
import { client } from '../pages/api/api';
import AppContext from '../AppContext';

const CreatePost = () => {

  const value = useContext(AppContext);
  let { token } = value.state;

  const createPostTypedData = gql`
    mutation CreatePostViaDispatcher {
      createPostViaDispatcher(
        request: {
          profileId: "0x58c3"
          contentURI: "ipfs://QmYER5CedMpKv7wTVfyT6Dgogp38BQDsLLg5axwnj1DZ7L"
          collectModule: { freeCollectModule: { followerOnly: false } }
          referenceModule: { followerOnlyReferenceModule: false }
        }
      ) {
        ... on RelayerResult {
          txHash
          txId
        }
        ... on RelayError {
          reason
        }
      }
    }
  `;

  const create = async () => {
    try {
        const tx = await client.mutate({
            mutation: createPostTypedData,
            context: {
                headers: {
                  Authorization: `${token}`
                }
            }
        })
        console.log(tx);
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div>
      <button onClick={create} className='btn btn-success'>Create Post</button>
    </div>
  );
};

export default CreatePost;
