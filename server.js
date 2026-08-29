import 'dotenv/config';
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('m7_frontend');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongoDB();

// API Routes

// GET all livros
app.get('/api/livros', async (req, res) => {
  try {
    const collection = db.collection('livros');
    const livros = await collection.find({}).toArray();
    res.json(livros);
  } catch (error) {
    console.error('Error fetching livros:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET livro by ID
app.get('/api/livros/:id', async (req, res) => {
  try {
    const collection = db.collection('livros');
    const livro = await collection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!livro) {
      return res.status(404).json({ error: 'Livro not found' });
    }
    
    res.json(livro);
  } catch (error) {
    console.error('Error fetching livro:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new livro
app.post('/api/livros', async (req, res) => {
  try {
    const { titulo, autor, categoria, ano, status, descricao } = req.body;
    
    // Validation
    if (!titulo || !autor || !categoria || !ano || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const collection = db.collection('livros');
    const novoLivro = {
      titulo,
      autor,
      categoria,
      ano: parseInt(ano),
      status,
      descricao: descricao || '',
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(novoLivro);
    const livroCriado = await collection.findOne({ _id: result.insertedId });
    
    res.status(201).json(livroCriado);
  } catch (error) {
    console.error('Error creating livro:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update livro
app.put('/api/livros/:id', async (req, res) => {
  try {
    const { titulo, autor, categoria, ano, status, descricao } = req.body;
    
    // Validation
    if (!titulo || !autor || !categoria || !ano || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const collection = db.collection('livros');
    const updateData = {
      titulo,
      autor,
      categoria,
      ano: parseInt(ano),
      status,
      descricao: descricao || '',
      updatedAt: new Date()
    };
    
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Livro not found' });
    }
    
    const livroAtualizado = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.json(livroAtualizado);
  } catch (error) {
    console.error('Error updating livro:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE livro
app.delete('/api/livros/:id', async (req, res) => {
  try {
    const collection = db.collection('livros');
    const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Livro not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting livro:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
