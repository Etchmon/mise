### Next.js Cookbook

The Next.js Cookbook is a web application that allows users to organize and manage their recipes in a digital format. It provides a user-friendly interface for creating and editing recipes, creating cookbooks, and exploring a wide variety of recipes from other users.

## Live Demo

[View Live Demo](https://nextjs-cookbook-cngdvy0e5-etchmon.vercel.app/)

## Screenshots

<!-- TODO: Replace placeholders with actual screenshots -->
<!-- Instructions: Run the app locally with `npm run dev`, take screenshots, and replace files in /screenshots folder -->

| Homepage | Recipe Detail | Create Recipe |
|:---:|:---:|:---:|
| ![Homepage](./screenshots/homepage.png) | ![Recipe Detail](./screenshots/recipe-detail.png) | ![Create Recipe](./screenshots/create-recipe.png) |

*Replace the placeholder images in `/screenshots` folder with actual screenshots of the application.*

## Technologies Used

- Next.js: A React framework for building server-side rendered and statically generated web applications.
- Tailwind CSS: A utility-first CSS framework that provides a set of pre-defined classes for rapid UI development.
- MongoDB: A popular NoSQL database for storing and managing recipe data.
- NextAuth: A library for authentication in Next.js applications, providing a seamless authentication workflow.
- React: A JavaScript library for building user interfaces.
- API Routes: Next.js API routes are used to handle server-side logic for creating, editing, and fetching data.
- React Hook Form: A lightweight form validation library for handling form input and validation.
- OpenAPI: An API documentation standard used to document the backend API endpoints.

## Features

- Recipe Management: Users can create, edit, and delete their own recipes, including information such as title, description, ingredients, and instructions.
- Cookbook Creation: Users can create cookbooks and add their favorite recipes to them for easy access and organization.
- Discover Recipes: The application provides a curated collection of recipes from other users, allowing users to explore and try new dishes.
- User Authentication: Users can sign up and log in to the application to securely manage their recipes and access additional features.
- Responsive Design: The application is built using Next.js and Tailwind CSS, ensuring a smooth and responsive user experience across various devices and screen sizes.

## Concepts

This project covers the following concepts:

- Server-side rendering with Next.js
- API routes with Next.js
- Dynamic routing in Next.js
- Client-side data fetching with 'getStaticProps' and 'getServerSideProps'
- Form handling in Next.js
- Authentication with Next.js

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas cluster)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Etchmon/nextjs-cookbook.git
cd nextjs-cookbook
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and NextAuth credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions to the Next.js Cookbook project are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the <u>MIT license</u>.
