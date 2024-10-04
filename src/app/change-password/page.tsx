'use client';
import { signIn, useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { changePassword } from '@/app/_actions/userAction';

const ChangePassword = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  if (session) {
    return (
      <div>
        <h2>Your Posts</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePassword(session.user._id, formData);
          }}
        >
          <input
            type='password'
            name='oldPassword'
            placeholder='old password'
            value={formData.oldPassword}
            onChange={(e) =>
              setFormData((prev) => {
                return { ...prev, oldPassword: e.target.value };
              })
            }
          />
          <input
            type='password'
            name='newPassword'
            placeholder='new password'
            value={formData.newPassword}
            onChange={(e) =>
              setFormData((prev) => {
                return { ...prev, newPassword: e.target.value };
              })
            }
          />
          <input
            type='password'
            name='confirmPassword'
            placeholder='confirm password'
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => {
                return { ...prev, confirmPassword: e.target.value };
              })
            }
          />
          <button type='submit'>Sign up</button>
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

export default ChangePassword;
