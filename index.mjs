import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT | 8000;
const ARMAZEM = "armazem_database";
const COLLECTION = "armazem";

const uri = process.env.MONGO_URI;

// Estabelecendo conexão
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("armazem_database").command({ ping: 1 });
    console.log("Conectado ao mongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.use(express.json());

// GET ALL
await app.get("/api/armazem", async (req, res) => {
  try {
    await client.connect();
    const cursor = await client.db(ARMAZEM).collection(COLLECTION).find({});
    const results = await cursor.toArray();
    console.log(results);
    res.json({ mensagem: "Sucesso!", results });
  } finally {
    await client.close();
  }
});

// GET one
await app.get("/api/armazem/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  try {
    await client.connect();
    const cursor = await client
      .db(ARMAZEM)
      .collection(COLLECTION)
      .find({ _id: id });

    const results = await cursor.toArray();
    if (results.length > 0) {
      res.json({ mensagem: "Sucesso!", results });
    } else {
      res.json({ mensagem: "Não encontrado!" });
    }
  } finally {
    await client.close();
  }
});

// POST, CREATE
await app.post("/api/armazem", async (req, res) => {
  const body = req.body;

  const produto = {
    produto: body.produto,
    quantidade: body.quantidade,
  };

  if (!produto) {
    res.json({ msg: "Propriedades faltando" });
  }

  try {
    await client.connect();
    const cursor = await client
      .db(ARMAZEM)
      .collection(COLLECTION)
      .insertOne(produto);

    const results = await cursor.acknowledged;
    res.json({ mensagem: "Sucesso!", results });
  } finally {
    await client.close();
  }
});

// PUT, UPDATE
await app.put("/api/armazem/:id", async (req, res) => {
  const id = new ObjectId(req.params);
  const body = req.body;

  const produto = {
    produto: body.produto,
    quantidade: body.quantidade,
  };

  if (!produto) {
    res.json({ msg: "Propriedades faltando" });
  }

  try {
    await client.connect();
    const cursor = await client
      .db(ARMAZEM)
      .collection(COLLECTION)
      .updateOne({ _id: id }, { $set: produto });

    const results = await cursor.acknowledged;
    res.json({ mensagem: "Sucesso!", results });
  } finally {
    await client.close();
  }
});

// DELETE
await app.delete("/api/armazem/:id", async (req, res) => {
  const id = new ObjectId(req.params);

  try {
    await client.connect();
    const cursor = await client
      .db(ARMAZEM)
      .collection(COLLECTION)
      .deleteOne({ _id: id });

    const results = await cursor.acknowledged;
    res.json({ mensagem: "Sucesso!", results });
  } finally {
    await client.close();
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em ${PORT}`);
});
