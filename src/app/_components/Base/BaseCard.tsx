"use client";
import { useRouter } from "next/navigation";

type BaseCardProps = {
  name: string;
  baseId: string;
}

const BaseCard = ({name, baseId} : BaseCardProps) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/${baseId}`);
  }
  
  const initials = name.slice(0, 2).charAt(0).toUpperCase() + name.slice(1, 2);

  return (
    <div
      role="button"
      className="home-card-style"
      onClick={handleClick}
    >
      <div className="flex gap-4">
        <div 
          style={{backgroundColor: "var(--pale-teal-green"}}
          className="flex items-center justify-center w-14 h-14 text-white rounded-lg">
          <span className="text-2xl">{initials}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="text-[0.8rem] font-medium mt-3">{name}</p>
          <p className="text-[0.7rem] text-gray-500">Base</p>
        </div>
      
      </div>
    </div>
  );
}

export default BaseCard;