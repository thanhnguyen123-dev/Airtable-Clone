type HomeSideBarItemProps = {
  title: string;
  imagePath: string;
}

const HomeSideBarItem = ({title, imagePath} : HomeSideBarItemProps) => {
  return (
    <div className="flex flex-row gap-2 w-full">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="flex-none"
      >
        <use href={imagePath}></use>
      </svg>
      <p className="text-xs">{title}</p>
    </div>
  )
}

export default HomeSideBarItem;