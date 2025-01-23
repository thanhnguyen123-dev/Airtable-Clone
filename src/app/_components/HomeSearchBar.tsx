import Home from "../page";

const HomeSearchBar = () => {
  return (
    <div className="">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-md px-4 py-2 border rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
          ctrl K
        </span>
      </div>
    </div>
  );
}

export default HomeSearchBar;