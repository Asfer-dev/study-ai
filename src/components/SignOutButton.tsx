'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

import { Button } from '@/components/ui/button';

const SignOutButton = () => {
  return <Button onClick={async () => await signOut()}>Sign Out</Button>;
};

export default SignOutButton;
