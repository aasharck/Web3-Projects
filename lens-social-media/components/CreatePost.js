import React from 'react';
import { gql } from '@apollo/client';

const CreatePost = () => {
  const createPost = gql`
    mutation CreatePostViaDispatcher {
      createPostViaDispatcher(
        request: {
          profileId: "0x01"
          contentURI: "ipfs://QmYER5CedMpKv7wTVfyT6Dgogp38BQDsLLg5axwnj1DZ7L"
          collectModule: { freeCollectModule: { followerOnly: true } }
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

  return (
    <div>
      <button className='btn btn-success'>Create Post</button>
    </div>
  );
};

export default CreatePost;
