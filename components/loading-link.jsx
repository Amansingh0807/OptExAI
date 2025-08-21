"use client";

import Link from "next/link";
import { useLoading } from "./loading-provider";

const LoadingLink = ({ href, children, className, ...props }) => {
  const { startLoading } = useLoading();

  const handleClick = () => {
    startLoading();
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default LoadingLink;
