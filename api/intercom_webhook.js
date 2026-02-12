import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const conversation = req.body.data.item;

    const transcript = JSON.stringify(conversation.conversation_parts);

    await axios.post(
      "https://www.chatbase.co/api/v1/events",
      {
        message: transcript,
        source: "intercom_ticket_closed"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.c8e40922-0591-4ec3-91cd-edaf2a6e5dff}`
        }
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
}