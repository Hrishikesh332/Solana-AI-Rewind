const express = require('express');
const { ChatXAI } = require("@langchain/xai");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const sampleWalletData = {
  "summary":{"wallet":"H1Goip4SDSi4y8cNVFJZVY7Jet1KHiV5ft6Jzsub16Fi","stats":{"total_nfts":2,"total_transactions":241,"recent_activity":15,"delegated_nfts":0,"burnt_nfts":0},"collections":{"favorite":"Unknown Collection","top_collections":[{"id":"DqDk1Ljk9CYknCPZejhQD1ZvyZk4cUGbkVobPkxME9Zd","name":"Unknown Collection","count":1}]},"behavioral_insights":{"is_active_trader":true,"has_verified_nfts":false,"last_active":"2024-12-17T13:20:50.000Z"}},"raw_data":{"address":"H1Goip4SDSi4y8cNVFJZVY7Jet1KHiV5ft6Jzsub16Fi","activity":{"total_transactions":241,"transactions_last_24h":15,"last_activity":"2024-12-17T13:20:50.000Z"},"nft_stats":{"total_nfts":2,"compressed_nfts":1,"regular_nfts":1,"delegated_nfts":0,"top_collections":[{"id":"DqDk1Ljk9CYknCPZejhQD1ZvyZk4cUGbkVobPkxME9Zd","name":"Unknown Collection","count":1}],"top_creators":[{"address":"AXQPUfHW1GjD7Qt8RAfHovpYv2c9sV5SatM7SW6YyJm5","count":1,"verified":false}]},"interesting_facts":{"has_verified_nfts":false,"favorite_collection":"Unknown Collection","is_active_trader":true,"burnt_nfts":0}}
      };

const llm = new ChatXAI({
    model: "grok-beta",
    temperature: 0.7,
    maxTokens: 1000,
    maxRetries: 2,
});


const systemPrompt = `You are an Indian crypto expert but the roaster like the elon musk. Analyze the provided wallet data and give a detailed but concise roast of the wallet's activity. 
Be witty, darket, roasting, fun and dark humor with no limit but maintain technical accuracy. Do relate it with some indian memes or blockchain memes. Roast to hard and one liner concise. Provide in 10 pointers`;

app.post('/analyze-wallet', async (req, res) => {
    try {

        const response = await llm.invoke([
            ["system", systemPrompt],
            ["human", `Please analyze this wallet data: ${JSON.stringify(walletData)}`]
        ]);

        res.json({
            success: true,
            analysis: response.content,
            metadata: {
                tokenUsage: response.response_metadata.tokenUsage,
                modelFingerprint: response.response_metadata.system_fingerprint
            }
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});