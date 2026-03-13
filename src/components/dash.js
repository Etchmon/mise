import React, { useState, useEffect } from 'react';
import Loading from '../components/loading';

const DashboardContent = ({ session, recipes, cookbooks, onClick }) => {

    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
    }, []);

    if (!session) {
        return <Loading />;
    };

    return (
        <div className={`md:p-8 rounded shadow flex-1 md:mb-2 text-stone-200 ${load ? 'opacity-100 transition-opacity duration-500 ease-in-out' : 'opacity-0'
            }`}>
            <h1 className="text-4xl font-bold mb-4 text-rose-400">Welcome, {session.user.username}!</h1>
            <p className="text-lg mb-8 text-stone-400">We hope you&#39;re having a great day.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <button className="bg-stone-800 border border-stone-700 p-6 rounded-lg shadow hover:border-rose-600 hover:bg-stone-700 cursor-pointer text-left transition-colors" onClick={() => onClick('recipeAdd')}>
                    <h2 className="font-semibold mb-2 text-rose-400">Create Recipe</h2>
                    <p className="text-stone-400 text-sm">You have {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
                </button>
                <button className="bg-stone-800 border border-stone-700 p-6 rounded-lg shadow hover:border-rose-600 hover:bg-stone-700 cursor-pointer text-left transition-colors" onClick={() => onClick('recipes')}>
                    <h2 className="font-semibold mb-2 text-rose-400">View Recipes →</h2>
                    <p className="text-stone-400 text-sm">Browse and manage your saved recipes.</p>
                </button>
                <button className="bg-stone-800 border border-stone-700 p-6 rounded-lg shadow hover:border-rose-600 hover:bg-stone-700 cursor-pointer text-left transition-colors" onClick={() => onClick('cookbookAdd')}>
                    <h2 className="font-semibold mb-2 text-rose-400">Create Cookbook</h2>
                    <p className="text-stone-400 text-sm">You have {cookbooks.length} cookbook{cookbooks.length !== 1 ? 's' : ''}</p>
                </button>
                <button className="bg-stone-800 border border-stone-700 p-6 rounded-lg shadow hover:border-rose-600 hover:bg-stone-700 cursor-pointer text-left transition-colors" onClick={() => onClick('cookbooks')}>
                    <h2 className="font-semibold mb-2 text-rose-400">View Cookbooks →</h2>
                    <p className="text-stone-400 text-sm">Browse and manage your collections.</p>
                </button>
            </div>
        </div>
    );
};

export default DashboardContent;
