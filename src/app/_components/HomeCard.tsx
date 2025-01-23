type HomeCardProps = {
  children: React.ReactNode;
  title: string;
  description: string;
}

const HomeCard = ({children, title, description} : HomeCardProps) => {
  return (
    <div role="button" className="home-card-style">
      <div className="flex items-center gap-2">
        {children}
        <h2 className="font-medium">{title}</h2>
      </div>
      <p className="home-card-p-style">{description}</p>
  </div>
  )
}

export default HomeCard;