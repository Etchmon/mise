import clientPromise from '../../../../lib/mongodb';
import { getSession } from "next-auth/react";
import { ObjectId } from 'mongodb';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export default async function addComment(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Not Authenticated' });
    }

    if (req.method === 'POST') {
        try {
            const MongoClient = await clientPromise;
            const db = await MongoClient.db("CBD");
            const commentCollection = await db.collection("Comments");
            const recipeCollection = db.collection("Recipes");

            const comment = {
                _id: new ObjectId(),
                text: req.body.text,
                author: session.user.username, // always use authenticated identity, never trust client-supplied author
                date: new Date()
            };

            // Insert comment into Comments collection
            const result = await commentCollection.insertOne(comment);

            // Update the recipe document in the database to include this comment's ID.
            // $push appends to the array field in MongoDB — the JS object above is not the DB document.
            await recipeCollection.updateOne(
                { _id: new ObjectId(req.body.recipeId) },
                { $push: { comments: result.insertedId } }
            );

            return res.json({ msg: 'comment created', comment });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}