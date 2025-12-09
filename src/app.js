import express from "express";
import chatRoute from "./routes/gemini.route.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// setup đường dẫn tới index.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

app.use("/api/chat", chatRoute);

app.listen(3000, () => {
    console.log("Chatbot chạy tại http://localhost:3000");
});
