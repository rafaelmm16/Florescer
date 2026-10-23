const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// Load environment variables (supports .env and atlas-credentials.env)
const envFilePaths = [
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', 'atlas-credentials.env'),
];

for (const p of envFilePaths) {
  if (fs.existsSync(p)) {
    require('dotenv').config({ path: p });
  }
}
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Atlas connection setup strictly from environment variable
const rawUri = process.env.MONGODB_URI;
const mongoUri = rawUri
  ? (rawUri.includes('?') ? rawUri : `${rawUri}/?retryWrites=true&w=majority`)
  : null;

// Dynamically extract cluster host for status messages without exposing credentials
const clusterHost = rawUri && rawUri.includes('@')
  ? (rawUri.split('@')[1] || '').split('/')[0]
  : 'MongoDB Atlas';

let cachedClient = null;
let cachedDb = null;

async function getDatabase() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI não foi configurada nas variáveis de ambiente (.env ou atlas-credentials.env).');
  }

  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    await cachedClient.connect();
    console.log('[MongoDB Atlas] Conectado com sucesso ao cluster!');
  }
  cachedDb = cachedClient.db('florescer');
  return cachedDb;
}

// Health & Status check endpoint
app.get('/api/health', async (req, res) => {
  if (!mongoUri) {
    return res.status(503).json({
      status: 'offline',
      database: 'missing_credentials',
      message: 'Configure MONGODB_URI no arquivo .env local para sincronizar na nuvem.',
    });
  }

  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    res.json({
      status: 'ok',
      database: 'connected',
      cluster: clusterHost,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[MongoDB Atlas Health Error]:', error.message);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// GET Profile
app.get('/api/profile', async (req, res) => {
  try {
    const db = await getDatabase();
    const profile = await db.collection('profiles').findOne({ _id: 'current_user' });
    if (!profile) {
      return res.json({ profile: null, isConfigured: false });
    }
    res.json({
      profile: {
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        imageUri: profile.imageUri || null,
        isConfigured: profile.isConfigured || false,
        updatedAt: profile.updatedAt,
      },
      isConfigured: !!profile.isConfigured,
    });
  } catch (error) {
    console.error('[GET /api/profile Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST Profile (Save/Update)
app.post('/api/profile', async (req, res) => {
  try {
    const { name, email, bio, imageUri } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'O nome é obrigatório.' });
    }

    const db = await getDatabase();
    const updateDoc = {
      name: name.trim(),
      email: email ? email.trim() : '',
      bio: bio ? bio.trim() : '',
      imageUri: imageUri || null,
      isConfigured: true,
      updatedAt: new Date(),
    };

    await db.collection('profiles').updateOne(
      { _id: 'current_user' },
      { $set: updateDoc },
      { upsert: true }
    );

    console.log(`[MongoDB Atlas] Perfil de "${updateDoc.name}" salvo com sucesso.`);
    res.json({ success: true, profile: updateDoc });
  } catch (error) {
    console.error('[POST /api/profile Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET Routines
app.get('/api/routines', async (req, res) => {
  try {
    const db = await getDatabase();
    const doc = await db.collection('routines').findOne({ _id: 'current_user_routines' });
    res.json({ routines: doc?.routines || [] });
  } catch (error) {
    console.error('[GET /api/routines Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST Routines (Sync all)
app.post('/api/routines', async (req, res) => {
  try {
    const { routines } = req.body;
    if (!Array.isArray(routines)) {
      return res.status(400).json({ error: 'Routines deve ser um array.' });
    }

    const db = await getDatabase();
    await db.collection('routines').updateOne(
      { _id: 'current_user_routines' },
      { $set: { routines, updatedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true, count: routines.length });
  } catch (error) {
    console.error('[POST /api/routines Error]:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Florescer Backend API rodando na porta ${PORT}`);
  console.log(`📡 MongoDB Atlas conectando em: ${mongoUri.replace(/:[^:]*@/, ':****@')}`);
});
