const BaseCardSkeleton = () => {
  return (
    <div className="home-card-style animate-pulse">
      <div className="flex gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-slate-100 animate-pulse">
          <span></span>
        </div>
        
        <div className="flex flex-col gap-1">
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  )
}

export default BaseCardSkeleton;