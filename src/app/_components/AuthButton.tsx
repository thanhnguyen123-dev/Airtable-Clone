import Link from "next/link";

export const CreateAccountButton = () => {
    return (
      <Link href="/signup">
        <button className="p-2 bg-transparent text-purple-600 border-2 border-purple-600 rounded-md hover:bg-purple-600 hover:text-white hover:underline transition-colors">
          Create account
        </button>
      </Link>
    );
};


export const SignInButton = () => {
    return (
      <Link href="/signin">
        <button className="p-2 text-black rounded-md hover:bg-blue-100 hover:text-blue-600 hover:underline transition-colors">
          Log in
        </button>
      </Link>
    )
}

export function OAuthButton({ handleClick, action, providerName,  icon}: { handleClick: () => void, action: string, providerName: string, icon: React.ReactNode }) {
    return (
      <button onClick={handleClick} className="relative flex justify-center items-center border-gray-200 border-[1px] py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
        {icon}
        {action} {providerName}
      </button>
    )
}
