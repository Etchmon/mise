import clientPromise from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export default async function myRecipes(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    if (req.method === "GET") {
        try {
            const MongoClient = await clientPromise;
            const db = await MongoClient.db("CBD");
            const collection = await db.collection("Recipes");
            const userData = await db.collection("Users").findOne({ email: session.user.email });
            const userRecipes = userData.cookbooks.allRecipes;

            // Fetch all recipes in a single query using $in, instead of one query per recipe ID
            const objectIds = userRecipes.map((id) => new ObjectId(id));
            const myRecipes = await collection.find({ _id: { $in: objectIds } }).toArray();

            res.status(200).json(myRecipes);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
}
