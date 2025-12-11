import clsx from 'clsx';
import React from 'react'

type MaxWidthContainerProps = {
  className?: string;
  children: React.ReactNode;
}
const MaxWidthContainer: React.FC<MaxWidthContainerProps> = ({ className = "", children }) => {
  return (
    <div className={clsx(className, "max-w-7xl mx-auto p-2")}>
      {children}
    </div>
  );
}

export default MaxWidthContainer;
