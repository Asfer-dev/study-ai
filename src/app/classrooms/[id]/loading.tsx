import React from "react";

interface ClassroomLayoutProps {
  children: React.ReactNode;
}

const ClassroomLayout = ({ children }: ClassroomLayoutProps) => {
  return <div>{children}</div>;
};

export default ClassroomLayout;
