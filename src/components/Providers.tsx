"use client";

import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" reverseOrder={true} />
          {children}
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default Providers;
