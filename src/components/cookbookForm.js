import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Loading from '../components/loading';

const CookbookForm = (props) => {
    const { data: session, status } = useSession();
    const { setActiveComponent, updateData } = props;

    const [recipes, setRecipes] = useState([]);
    const [myRecipes, setMyRecipes] = useState([]);

    const [load, setLoad] = useState(false);

    useEffect(() => {
        (async () => {
            const results = await fetch('/api/recipe/getUserRecipes');
            const resultsJson = await results.json();
            setMyRecipes(resultsJson);
            setLoad(true);
        })();
    }, []);

    const [value, setValue] = useState({
        title: '',
        description: ''
    });

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        recipes: [],
    });


    const handleChange = (event) => {
        setValue({ ...value, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { title } = value;
        const { description } = value;

        // Perform input validation
        let validationErrors = {};
        let isValid = true;

        if (title.trim() === "") {
            validationErrors.title = "Title is required";
            isValid = false;
        } else if (title.trim().length < 3) {
            validationErrors.title = "Title must be at least 3 characters long";
            isValid = false;
        }

        if (description.trim() === "") {
            validationErrors.description = "Description is required";
            isValid = false;
        }

        if (recipes.length === 0) {
            validationErrors.recipes = "At least 1 recipe is required";
            isValid = false;
        }


        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        const res = await fetch('/api/cookbook/add', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: value.title,
                description: value.description,
                recipes: recipes
            }),
        });
        const result = await res.json();
        updateData();
        setActiveComponent('cookbooks');
    }

    const addToBook = (event, recipe) => {
        event.preventDefault();
        if (recipes.includes(recipe)) {
            return;
        }
        setRecipes([...recipes, recipe]);
    };

    const removeFromBook = (event, recipe) => {
        event.preventDefault();
        const filteredArray = recipes.filter(item => item !== recipe)
        setRecipes([...filteredArray]);
    };

    if (!recipes) {
        return <Loading />;
    }

    if (!session) {
        return (
            <div>
                <p>You are not logged in to an account. To create a recipe please log in or create an account.</p>
                <button onClick={() => signIn()}>Sign In</button>
            </div>
        )
    } else {

        return (
            <div className={`bg-stone-950 h-full mx-auto text-stone-200 grid grid-cols-1 lg:mt-10 lg:grid-cols-2 ${load ? 'opacity-100 transition-opacity duration-500 ease-in-out' : 'opacity-0'
                }`}>
                <div className="flex-1 flex flex-col justify-center lg:justify-start items-center lg:items-start px-4 sm:px-0 mt-2 md:mt-10 w-full">
                    <form className="w-full" noValidate>
                        <h1 className="text-3xl font-bold mb-4 text-red-400">Create a Cookbook</h1>

                        <label className="block mb-4">
                            <span className="text-lg font-semibold text-stone-200">Cookbook name:</span>
                            <input
                                type="text"
                                name="title"
                                className="block w-full bg-stone-800 border-stone-600 border-2 py-2 px-4 rounded-lg mt-2 text-stone-100"
                                value={value.title}
                                onChange={handleChange}
                                aria-required="true"
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? "title-error" : undefined}
                            />
                            {errors.title && <p id="title-error" role="alert" className="text-red-400 text-sm mt-1">{errors.title}</p>}
                        </label>

                        <label className="block mb-4">
                            <span className="text-lg font-semibold text-stone-200">Description:</span>
                            <textarea
                                name="description"
                                className="block w-full bg-stone-800 border-stone-600 border-2 py-2 px-4 rounded-lg mt-2 text-stone-100"
                                value={value.description}
                                onChange={handleChange}
                                aria-required="true"
                                aria-invalid={!!errors.description}
                                aria-describedby={errors.description ? "description-error" : undefined}
                            />
                            {errors.description && <p id="description-error" role="alert" className="text-red-400 text-sm mt-1">{errors.description}</p>}
                        </label>

                        <button className="bg-rose-600 text-white p-4 rounded-lg hover:bg-rose-500 w-full font-semibold" onClick={handleSubmit}>Save Cookbook</button>
                    </form>
                </div>

                <div className="flex-1 flex flex-wrap grid grid-cols-2 mt-8 justify-center items-center">
                    <div className="h-full w-full overflow-y-auto pr-4 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-400">Your Recipes</h2>
                        <ul className="inline-block max-width-content items-center">
                            {myRecipes.map(recipe => (
                                <li key={recipe._id} id={recipe._id} className='text-start mb-2 whitespace-nowrap flex items-center gap-2'>
                                    <button
                                        aria-label={`Add ${recipe.title} to cookbook`}
                                        className="p-2 min-w-[2rem] min-h-[2rem] rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center"
                                        onClick={(e) => addToBook(e, recipe)}
                                    >+</button>
                                    {recipe.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="h-full w-full overflow-y-auto pr-4 text-center">
                        <h2 className="text-2xl font-bold mb-4 text-red-400">In this Cookbook</h2>
                        <ul className="inline-block max-width-content items-center">
                            {recipes.map((recipe) => (
                                <li key={recipe._id} className="text-start mb-2 whitespace-nowrap flex items-center gap-2">
                                    <button
                                        aria-label={`Remove ${recipe.title} from cookbook`}
                                        className="p-2 min-w-[2rem] min-h-[2rem] rounded-lg bg-red-700 hover:bg-red-600 text-white flex items-center justify-center"
                                        onClick={(e) => removeFromBook(e, recipe)}
                                    >-</button>
                                    {recipe.title}
                                </li>
                            ))}
                        </ul>
                        {errors.recipes && <p role="alert" className="text-red-400 text-sm mt-2">{errors.recipes}</p>}
                    </div>
                </div>
            </div>



        )
    }
};

export default CookbookForm;