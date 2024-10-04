'use client ';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

const SignInButton = () => {
  return (
    <Link href="/login">
      <Button>Sign In</Button>
    </Link>
  );
};

export default SignInButton;
