import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="container flex-1">{children}</div>;
};

export default PageContainer;
