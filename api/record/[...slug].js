import { MongoClient, ObjectId } from 'mongodb';
import { corsHeaders } from '../_utils/auth.js';

const uri = process.env.ATLAS_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db();
  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.set(corsHeaders());
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await connectToDatabase();
  const { method } = req;
  const urlParts = req.url.split('/').filter(part => part && part !== 'record');
  const id = urlParts[0];

  try {
    const collection = db.collection("records");

    if (method === 'GET' && !id) {
      // Get all records
      const results = await collection.find({}).toArray();
      return res.status(200).json(results);
    } 
    else if (method === 'GET' && id) {
      // Get single record by id
      const query = { _id: new ObjectId(id) };
      const result = await collection.findOne(query);
      
      if (!result) {
        return res.status(404).json({ error: "Record not found" });
      }
      return res.status(200).json(result);
    }
    else if (method === 'POST') {
      // Create new record
      const newDocument = {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      };
      
      const result = await collection.insertOne(newDocument);
      return res.status(201).json(result);
    }
    else if (method === 'PATCH' && id) {
      // Update record by id
      const query = { _id: new ObjectId(id) };
      const updates = {
        $set: {
          name: req.body.name,
          position: req.body.position,
          level: req.body.level,
        }
      };
      
      const result = await collection.updateOne(query, updates);
      return res.status(200).json(result);
    }
    else if (method === 'DELETE' && id) {
      // Delete record by id
      const query = { _id: new ObjectId(id) };
      const result = await collection.deleteOne(query);
      return res.status(200).json(result);
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Record API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}