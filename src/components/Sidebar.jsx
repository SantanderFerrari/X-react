import { FaXTwitter } from "react-icons/fa6";
import { BiSolidHome } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import Link from "next/link";


export default function Sidebar() {
    return (
        <div className="flex flex-col gap-5 p-6">
            <Link href="/">
                <FaXTwitter className="w-16 h-16 cursor-pointer
                p-3 hover:bg-gray-100 rounded-full transition-all
                duration-200" />


            </Link>
            <Link href="/" className="flex items-center p-3 hover:bg-slate-200 rounded-full transition-all
            duration-400 gap-2 w-fit">
                <HiHome className="w-10 h-10 cursor-pointer" />
                <span className="font-bold hidden xl:inline">
                    Home
                </span>
            </Link>
            <button className="bg-blue-500 text-white
            font-bold rounded-full px-4 py-2 mt-4 hover:bg-blue-600
            transition-all duration-200 w-48 h-9 hidden xl:inline">
                Sign In
            </button>


        </div>
    )
}
