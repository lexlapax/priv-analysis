const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const systemPrompt = "You are a policy expert. Given a volume of text, you are able to analyze the content of the text to answer specific questions about the policy in question. Do not make up facts. For any text generated, if possible point to the source for attribution. Policy's can be about anything, from privacy policies to criminial procedures etc.";
const userPrompt = "Given the following privacy policy that is to follow: make an around 150 word concise bstract detailing where user data is goinbg, along with the a percent score out of 100 detailing how well user privacy is protected. The policy is as follows: "
// Route to handle privacy policy analysis
app.post('/api/v1/models/gemini-pro:generateText', async (req, res) => {
  const { policy } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    // const chat = model.startChat({
    //   systemInstruction: systemPrompt
    // });

    //   const result = await chat.sendMessage(userPrompt + policy);
    //   const responseText = result.response.text();
    //   res.json({ text: responseText });
      const result = await model.generateContent(systemPrompt + userPrompt +policy) ;
      const responseText = result.response.text();
      return responseText;
    } catch (error) {
    console.error('Error fetching privacy summary:', error.message);
    res.status(500).json({ error: 'Failed to analyze privacy policy' });
  }
});


// Try listening on port, fall back to another port if in use
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is in use, trying another port...`);
    const fallbackServer = app.listen(0, () => { // 0 means a random available port
      console.log(`Server running on http://localhost:${fallbackServer.address().port}`);
    });
  } else {
    console.error(err);
  }
});