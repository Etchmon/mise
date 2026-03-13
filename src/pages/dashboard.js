import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, getSession, useSession } from "next-auth/react";
import Dash from '../components/dash';
import RecipeList from '../components/recipes';
import CookbooksList from '../components/cookbooks';
import Stream from '../components/stream';
import RecipeForm from '../components/recipeForm';
import CookbookForm from '../components/cookbookForm';
import RecipeView from '../components/recipeView';
import CookbookView from '../components/cookbookView'
import CookbookEdit from '../components/cookbookEdit';
import Loading from '../components/loading';

// Views that can be restored from the URL on page load.
// Detail views (recipeView, cookbookView, cookbookEdit) require an active object
// that can't be encoded in the URL, so they are excluded.
const RESTORABLE_VIEWS = new Set(['dashboard', 'stream', 'recipes', 'cookbooks', 'recipeAdd', 'cookbookAdd']);

const Dashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const [recipesFull, setRecipesFull] = useState([]);
    const [cookbooksFull, setCookbooksFull] = useState([]);
    const [streamRecipes, setStreamRecipes] = useState([]);
    const [activeRecipe, setActiveRecipe] = useState(null);
    const [activeCookbook, setActiveCookbook] = useState(null);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const fetchUserRecipes = async () => {
        const response = await fetch('/api/recipe/getUserRecipes');
        const data = await response.json();
        setRecipesFull(data);
    };

    const fetchUserCookbooks = async () => {
        const response = await fetch('/api/cookbook/getUserCookbooks');
        const data = await response.json();
        setCookbooksFull(data);
    };

    const fetchStreamRecipes = async () => {
        const response = await fetch('/api/recipe/getAll');
        const data = await response.json();
        setStreamRecipes(shuffleArray(data));
    };

    const fetchData = async () => {
        await Promise.all([
            fetchStreamRecipes(),
            fetchUserRecipes(),
            fetchUserCookbooks(),
        ]);
    };

    // Restore view from URL on mount, then fetch data.
    useEffect(() => {
        const view = router.query.view;
        if (view && RESTORABLE_VIEWS.has(view)) {
            setActiveComponent(view);
        }
        fetchData();
    }, []);

    // Navigate to a view and sync the URL (shallow — no server round-trip).
    const navigateTo = (view) => {
        setActiveComponent(view);
        if (RESTORABLE_VIEWS.has(view)) {
            router.push({ pathname: '/dashboard', query: { view } }, undefined, { shallow: true });
        }
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'recipeView':
                return <RecipeView recipeObj={activeRecipe} setActiveComponent={navigateTo} />
            case 'cookbookView':
                return <CookbookView cookbook={activeCookbook} setActiveComponent={navigateTo} setActiveRecipe={setActiveRecipe} />
            case 'cookbookEdit':
                return <CookbookEdit cookbook={activeCookbook} myRecipes={recipesFull} />
            case 'recipeAdd':
                return <RecipeForm setActiveComponent={navigateTo} updateData={fetchUserRecipes} />
            case 'cookbookAdd':
                return <CookbookForm setActiveComponent={navigateTo} updateData={fetchUserCookbooks} />
            case 'dashboard':
                return <Dash session={session} recipes={recipesFull} cookbooks={cookbooksFull} onClick={navigateTo} />;
            case 'stream':
                return <Stream recipes={streamRecipes} showAddButton={true} updateData={fetchUserRecipes} setActiveComponent={navigateTo} setActiveRecipe={setActiveRecipe} />;
            case 'recipes':
                return <RecipeList recipes={recipesFull} showAddButton={false} setActiveComponent={navigateTo} setActiveRecipe={setActiveRecipe} updateData={fetchUserRecipes} />;
            case 'cookbooks':
                return <CookbooksList cookbooks={cookbooksFull} updateData={fetchUserCookbooks} setActiveCookbook={setActiveCookbook} setActiveComponent={navigateTo} />;
            default:
                return null;
        }
    };

    if (!session) {
        return <Loading />;
    }

    return (
        <div className="grid grid-cols-1 grid-rows-6 lg:grid-cols-6 h-screen w-full bg-stone-950 text-stone-200">
            <Head>
                <title>Mise</title>
                <meta name="description" content="Mise — save recipes, build cookbooks, and discover new dishes." />
            </Head>
            {/* Sidebar */}
            <nav aria-label="Main navigation" className="bg-stone-950 border-b lg:border-b-0 lg:border-r border-stone-800 lg:top-0 grid-row-1 lg:grid-col-1 lg:row-span-6 pb-4">
                <Link href="/" className="flex justify-center text-lg text-rose-400 font-semibold pt-4 lg:p-4 lg:justify-start">Menu</Link>
                <ul className="mt-2 lg:p-4 space-y-2 flex flex-wrap justify-evenly lg:flex-col">
                    <li>
                        <button
                            aria-current={activeComponent === 'dashboard' ? 'page' : undefined}
                            className={`text-stone-300 block py-2 px-4 mt-2 lg:mt-0 hover:bg-rose-700 hover:text-white rounded lg:w-3/4 text-left ${activeComponent === 'dashboard' ? 'bg-rose-700 text-white' : ''}`}
                            onClick={() => navigateTo('dashboard')}
                        >
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            aria-current={activeComponent === 'stream' ? 'page' : undefined}
                            className={`text-stone-300 block py-2 px-4 hover:bg-rose-700 hover:text-white rounded lg:w-3/4 text-left ${activeComponent === 'stream' ? 'bg-rose-700 text-white' : ''}`}
                            onClick={() => navigateTo('stream')}
                        >
                            Stream
                        </button>
                    </li>
                    <li>
                        <button
                            aria-current={activeComponent === 'recipes' ? 'page' : undefined}
                            className={`text-stone-300 block py-2 px-4 hover:bg-rose-700 hover:text-white rounded lg:w-3/4 text-left ${activeComponent === 'recipes' ? 'bg-rose-700 text-white' : ''}`}
                            onClick={() => navigateTo('recipes')}
                        >
                            Recipes
                        </button>
                    </li>
                    <li>
                        <button
                            aria-current={activeComponent === 'cookbooks' ? 'page' : undefined}
                            className={`text-stone-300 block py-2 px-4 hover:bg-rose-700 hover:text-white rounded lg:w-3/4 text-left ${activeComponent === 'cookbooks' ? 'bg-rose-700 text-white' : ''}`}
                            onClick={() => navigateTo('cookbooks')}
                        >
                            Cookbooks
                        </button>
                    </li>
                    <li>
                        <Link href="/" onClick={() => signOut()} className="text-stone-300 block py-2 px-4 hover:bg-rose-700 hover:text-white rounded lg:w-3/4">
                            Sign Out
                        </Link>
                    </li>
                </ul>
            </nav>
            {/* Content */}
            <main id="main-content" className="h-full w-full mx-auto pb-4 lg:col-span-4 row-start-3 lg:py-10 row-span-6 lg:row-span-6 container px-4 lg:py-6 overflow-y-scroll lg:overflow-hidden">
                {renderComponent()}
            </main>
        </div>
    );
};

export default Dashboard;

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/'
            }
        };
    }

    return {
        props: { ...session }
    };
};
