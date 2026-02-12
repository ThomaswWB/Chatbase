const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json()); // Memastikan body parser berjalan dengan baik

app.post("/intercom-webhook", async (req, res) => {
  console.log("Received request:", req.body);  // Log untuk debugging

  try {
    const conversationId = req.body.data.id;
    const conversationMessage = req.body.data.conversation_parts.conversation_parts.map(part => `${part.author.type}: ${part.body}`).join("\n");

    // Log data yang akan dikirim ke Chatbase
    console.log("Sending to Chatbase:", conversationId, conversationMessage);

    // Kirim ke Chatbase dengan timeout 10 detik
    const chatbaseResponse = await axios.post(
      "https://api.chatbase.co/v1/upload",
      {
        conversation_id: conversationId,
        message: conversationMessage,
        metadata: {
          ticket_id: conversationId,
          source: "intercom",
          status: req.body.data.status,
          tags: req.body.data.tags || []
        }
      },
      {
        headers: {
          Authorization: "Bearer YOUR_CHATBASE_API_KEY",  // Ganti dengan API key Chatbase kamu
          "Content-Type": "application/json"
        },
        timeout: 10000  // Timeout 10 detik untuk request
      }
    );

    console.log("Chatbase response:", chatbaseResponse.status);  // Log status response dari Chatbase

    res.status(200).send("OK");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Setup server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
