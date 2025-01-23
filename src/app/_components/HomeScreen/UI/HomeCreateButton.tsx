const HomeCreateButton = () => {
  return (
    <button className="bg-blue-500 w-full flex justify-center items-center p-1 rounded gap-4">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="flex-none"
        fill="white"
      >
        <use href="/icons/icons_definitions.svg#Plus"></use>
      </svg>
      <span className="text-white text-sm">Create</span>
    </button>
  )
}

export default HomeCreateButton;