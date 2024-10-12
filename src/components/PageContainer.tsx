import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="container max-w-[1150px] mx-auto ml-72 flex-1">
      {children}
    </div>
  );
};

export default PageContainer;
