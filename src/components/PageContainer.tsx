import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="mt-16 md:mt-0 flex-1">{children}</div>;
};

export default PageContainer;
