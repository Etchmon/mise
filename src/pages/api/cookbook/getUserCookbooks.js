import clientPromise from "../../../../lib/mongodb";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export default async function myCookbooks(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    if (req.method === "GET") {
        // Process a GET request
        const sessionCookbooks = session.user.cookbooks.myBooks;

        try {
            const MongoClient = await clientPromise;
            const db = await MongoClient.db("CBD");
            const collection = await db.collection("Cookbooks");

            // Fetch all cookbooks in a single query using $in, instead of one query per cookbook ID
            const objectIds = sessionCookbooks.map((id) => new ObjectId(id));
            const myCookbooks = await collection.find({ _id: { $in: objectIds } }).toArray();

            res.status(200).json(myCookbooks);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
}
