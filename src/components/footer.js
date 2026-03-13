import React from 'react';

const Footer = () => {
    return (
        <footer className="py-4 px-8 w-full bg-stone-950 bg-opacity-80">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-center items-center">
                    <p className="text-sm text-stone-400">&copy; {new Date().getFullYear()} Mise. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;