import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 bg-stone-950 border-b border-stone-800 py-3 px-4 md:px-8 flex justify-between items-center w-full z-20">
            <Link href="/" className='text-stone-100 font-semibold tracking-tight'>Mise</Link>
            {!session ? (
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-stone-400 hover:text-stone-100 text-sm transition-colors">
                        Log in
                    </Link>
                    <Link href="/signup" className="bg-rose-600 text-white py-1.5 px-4 rounded hover:bg-rose-500 text-sm font-medium transition-colors">
                        Sign up
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-stone-400 hover:text-stone-100 text-sm transition-colors">Dashboard</Link>
                    <button className="bg-stone-800 text-stone-300 py-1.5 px-4 rounded hover:bg-stone-700 text-sm transition-colors" onClick={() => signOut()}>
                        Sign out
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
