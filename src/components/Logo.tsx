import { appMetadata } from "@/constants/appMetaData";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  width: number;
  height: number;
  displayTitle?: boolean;
}

const Logo = ({ width = 32, height = 32, displayTitle = false }: Props) => {
  return (
    <Link href={appMetadata.url} className="flex items-center gap-2">
      <Image
        src={appMetadata.logoUrl}
        width={width}
        height={height}
        className="max-h-8"
        alt={appMetadata.alt}
      />
      <span
        className={`text-lg font-semibold tracking-tighter ${!displayTitle ? "hidden" : ""}`}
      >
        {appMetadata.title}
      </span>
    </Link>
  );
};

export default Logo;
