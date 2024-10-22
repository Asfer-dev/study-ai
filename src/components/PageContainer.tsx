import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="pt-16 md:pt-0 flex-1">{children}</div>;
};

export default PageContainer;
