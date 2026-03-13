import React from 'react';

const CookbookList = (props) => {
    const { cookbooks, setActiveCookbook, setActiveComponent } = props;

    const handleView = (cookbook) => {
        setActiveCookbook(cookbook);
        setActiveComponent('cookbookView');
    };

    const handleEdit = (cookbook) => {
        setActiveCookbook(cookbook);
        setActiveComponent('cookbookEdit');
    };

    const handleDelete = async (cookbookId) => {
        if (!window.confirm('Are you sure you want to delete this cookbook?')) return;
        const res = await fetch('/api/cookbook/delete', {
            method: 'DELETE',
            header: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: cookbookId }),
        });
        await res.json();
        props.updateData();
    };

    if (cookbooks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-stone-500 gap-2">
                <p className="text-lg">You have no cookbooks yet.</p>
                <p className="text-sm">Create a cookbook to organise your recipes into collections.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start pb-4">
            {cookbooks.map((cookbook) => (
                <div
                    key={cookbook._id}
                    className="bg-stone-900 border border-stone-800 rounded-lg p-5 flex flex-col gap-3 hover:border-stone-600 transition-colors"
                >
                    <div>
                        <h2 className="text-lg font-semibold text-stone-100 mb-1">{cookbook.title}</h2>
                        <p className="text-stone-400 text-sm">{cookbook.description}</p>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2 border-t border-stone-800">
                        <button
                            className="bg-rose-600 text-white py-1.5 px-3 rounded hover:bg-rose-500 text-sm font-medium transition-colors"
                            onClick={() => handleView(cookbook)}
                        >
                            View
                        </button>
                        <button
                            className="bg-stone-800 text-stone-300 py-1.5 px-3 rounded hover:bg-stone-700 text-sm transition-colors"
                            onClick={() => handleEdit(cookbook)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-stone-800 text-stone-300 py-1.5 px-3 rounded hover:bg-red-700 hover:text-white text-sm transition-colors ml-auto"
                            onClick={() => handleDelete(cookbook._id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CookbookList;
