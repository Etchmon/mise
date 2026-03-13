import React from "react";

const LoadingAnimation = () => {
    return (
        <div role="status" aria-label="Loading" className="flex items-center justify-center h-screen">
            <svg
                className="animate-spin h-10 w-10 text-rose-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                />
            </svg>
        </div>
    );
};

export default LoadingAnimation;