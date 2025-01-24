"use client";
import { useRouter } from "next/navigation";

type BaseCardProps = {
  name: string;
  baseId: string;
}

const BaseCard = ({name, baseId} : BaseCardProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`${baseId}`);
  }

  return (
    <div
      role="button"
      className="home-card-style"
      onClick={handleClick}
    >
      <div className="flex flex-col gap-2 justify-center">
        <p className="text-sm">{name}</p>
        <p className="text-xs">Base</p>
      </div>
    </div>
  );
}

export default BaseCard;