import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/intercom-webhook", async (req, res) => {
  try {
    const conversation = req.body.data.item;
    const transcript = conversation.conversation_parts;

    // Kirim ke Chatbase
    await axios.post("https://www.chatbase.co/api/v1/events", {
      message: JSON.stringify(transcript),
      source: "intercom_ticket_closed"
    }, {
      headers: {
        Authorization: `Bearer c8e40922-0591-4ec3-91cd-edaf2a6e5dff`
      }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Success");
});