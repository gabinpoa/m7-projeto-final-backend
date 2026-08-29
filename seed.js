import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'm7_frontend';
const collectionName = 'livros';

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing data');

    // Sample data
    const livros = [
      {
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
        categoria: 'Tecnologia',
        ano: 2008,
        status: 'disponivel',
        descricao: 'Livro sobre boas práticas de desenvolvimento de software.',
        createdAt: new Date()
      },
      {
        titulo: 'O Senhor dos Anéis',
        autor: 'J.R.R. Tolkien',
        categoria: 'Ficção',
        ano: 1954,
        status: 'disponivel',
        descricao: 'Uma épica fantasia sobre a jornada para destruir o Um Anel.',
        createdAt: new Date()
      },
      {
        titulo: 'Sapiens',
        autor: 'Yuval Noah Harari',
        categoria: 'Não-ficção',
        ano: 2011,
        status: 'emprestado',
        descricao: 'Uma breve história da humanidade.',
        createdAt: new Date()
      },
      {
        titulo: '1984',
        autor: 'George Orwell',
        categoria: 'Ficção',
        ano: 1949,
        status: 'disponivel',
        descricao: 'Distopia sobre um regime totalitário.',
        createdAt: new Date()
      },
      {
        titulo: 'Design Patterns',
        autor: 'Erich Gamma et al.',
        categoria: 'Tecnologia',
        ano: 1994,
        status: 'reservado',
        descricao: 'Elementos de software orientado a objetos reutilizável.',
        createdAt: new Date()
      },
      {
        titulo: 'Orgulho e Preconceito',
        autor: 'Jane Austen',
        categoria: 'Romance',
        ano: 1813,
        status: 'disponivel',
        descricao: 'Romance clássico sobre Elizabeth Bennet e Mr. Darcy.',
        createdAt: new Date()
      },
      {
        titulo: 'Uma Breve História do Tempo',
        autor: 'Stephen Hawking',
        categoria: 'Não-ficção',
        ano: 1988,
        status: 'disponivel',
        descricao: 'Exploração dos mistérios do universo.',
        createdAt: new Date()
      },
      {
        titulo: 'JavaScript: The Good Parts',
        autor: 'Douglas Crockford',
        categoria: 'Tecnologia',
        ano: 2008,
        status: 'disponivel',
        descricao: 'Foco nas partes boas da linguagem JavaScript.',
        createdAt: new Date()
      }
    ];

    // Insert sample data
    const result = await collection.insertMany(livros);
    console.log(`Inserted ${result.insertedCount} documents`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

seedDatabase();
