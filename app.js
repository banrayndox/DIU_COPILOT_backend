import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// socket map
global.socketMap = {};

io.on("connection", (socket) => {

    console.log("🟢 Connected:", socket.id);

    global.socketMap[socket.id] = socket;

    socket.on("sendMessage", async ({ text, userId }) => {

        try {

            const response = await axios.post(
                "http://127.0.0.1:8000/",
                {
                    message: text,
                    user_id: userId,
                    socket_id: socket.id
                },
                {
                    responseType: "stream"
                }
            );

            let buffer = "";

            response.data.on("data", (chunk) => {

                const text = chunk.toString();

                buffer += text;

                socket.emit("aiChunk", text);
            });

            response.data.on("end", () => {

                socket.emit("aiEnd", buffer);
            });

        } catch (err) {

            console.error("❌ Error:", err.message);

            socket.emit("aiError", {
                message: "FastAPI error"
            });
        }
    });

    socket.on("disconnect", () => {
        delete global.socketMap[socket.id];
    });
});

server.listen(8080, () => {
    console.log("🚀 Node running on 8080");
});