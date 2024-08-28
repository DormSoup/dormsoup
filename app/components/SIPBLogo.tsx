import Image from "next/image";
import Link from "next/link";

export default function SIPBLogo() {
  return (
    <a
      className="flex flex-row items-center justify-center rounded-md bg-white px-4 py-1 text-lg font-bold"
      target="_blank"
      href="https://sipb.mit.edu/"
    >
      Maintained by SIPB
      <Image
        src="/fuzzball.png"
        alt="SIPB Logo"
        width={24}
        height={24}
        className="ml-3 object-contain"
      />
    </a>
  );
}
