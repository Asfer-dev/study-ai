"use client";

import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <Toaster position="top-center" reverseOrder={true} />
        {children}
      </SessionProvider>
    </>
  );
};

export default Providers;
