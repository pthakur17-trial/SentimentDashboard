require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // <-- add this
const { v4: uuidv4 } = require('uuid');
const { TextAnalyticsClient, AzureKeyCredential } = require('@azure/ai-text-analytics');
const { CosmosClient } = require('@azure/cosmos');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // <-- add this

// Azure Text Analytics
const textClient = new TextAnalyticsClient(
    process.env.COG_ENDPOINT,
    new AzureKeyCredential(process.env.COG_KEY)
);

// Cosmos DB
const cosmos = new CosmosClient(process.env.COSMOS_CONN);
const db = cosmos.database(process.env.COSMOS_DB);
const container = db.container(process.env.COSMOS_CONTAINER);

// Endpoint to analyze text
app.post('/analyze', async (req, res) => {
    try {
        const { text, language = 'en' } = req.body;
        if (!text || text.trim().length === 0) return res.status(400).json({ error: 'Text is required' });

        // 1) Sentiment analysis
        const [sentimentResult] = await textClient.analyzeSentiment([text], language);

        // 2) Extract key phrases
        const keyPhrasesResult = await textClient.extractKeyPhrases([text], language);

        const doc = {
            id: uuidv4(),
            text,
            sentiment: sentimentResult.sentiment,
            scores: sentimentResult.confidenceScores,
            keyPhrases: keyPhrasesResult[0].keyPhrases || [],
            language,
            timestamp: new Date().toISOString()
        };

        // Store in Cosmos DB (use id as partition key)
        await container.items.create(doc, { partitionKey: doc.id });

        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to fetch recent analyses
app.get('/recent', async (req, res) => {
    try {
        const querySpec = {
            query: 'SELECT TOP 50 * FROM c ORDER BY c.timestamp DESC'
        };
        const { resources } = await container.items.query(querySpec).fetchAll();
        res.json(resources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
const port = process.env.PORT || 7071;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));

