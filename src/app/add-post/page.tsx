'use client';
import { signIn, useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { getSignedURL } from '@/app/_actions/postAction';
import { addPost } from '@/app/_actions/userAction';

const AddPost = () => {
  const { data: session } = useSession();
  const [postData, setPostData] = useState({
    caption: '',
    media: null,
  });

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postData.media) {
      console.log('no file attached');

      return;
    }

    try {
      const signedUrlResult = await getSignedURL({
        filename: postData.media.name,
        filesize: postData.media.size,
        filetype: postData.media.type,
        checksum: await computeSHA256(postData.media),
      });
      if (signedUrlResult.failure !== undefined) {
        console.log('error getting signed url');
        return;
      }

      const url = signedUrlResult.success.url;
      console.log({ url });
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': postData.media.type,
        },
        body: postData.media,
      });
      addPost(session?.user?._id, { ...postData, media: url });
    } catch (error) {
      console.log(error);
    }
  };

  if (session) {
    return (
      <div>
        <h2>Add Post</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder='post text'
            name='text'
            type='text'
            value={postData.caption}
            onChange={(e) =>
              setPostData((prev) => {
                return { ...prev, caption: e.target.value };
              })
            }
          />
          <input
            onChange={(e) =>
              setPostData((prev) => {
                const file = e.target.files ? e.target.files[0] : null;
                return { ...prev, media: file };
              })
            }
            type='file'
            name='media'
            accept='image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm'
          />
          <button type='submit'>Post</button>
        </form>
      </div>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
};

export default AddPost;
