import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/intercom-webhook", async (req, res) => {
  console.log("Request body:", req.body);  // Log payload untuk debugging

  if (!req.body || !req.body.data) {
    return res.status(400).send("Invalid request payload");
  }

  const conversationId = req.body.data.id;
  const conversationMessage = req.body.data.conversation_parts.conversation_parts.map(part => `${part.author.type}: ${part.body}`).join("\n");

  // Kirim ke Chatbase
  try {
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
          Authorization: "Bearer c8e40922-0591-4ec3-91cd-edaf2a6e5dff",  // Ganti dengan API key Chatbase kamu
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Sent data to Chatbase:", chatbaseResponse.status);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).send("Internal Server Error");
  }
});
