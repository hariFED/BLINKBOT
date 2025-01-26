import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div>
      <Image
        src="/pagenotfound.png"
        alt="pgnf404"
        className="h-screen w-max mx-auto flex justify-center items-center"
        width={1200}
        height={720}
      />
    </div>
  );
};

export default page;
