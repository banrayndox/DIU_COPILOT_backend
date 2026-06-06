import axios from "axios";

/**
 * This function does NOT wait full response.
 * It returns STREAM from FastAPI.
 */
export default async function getAgentResponseStream(userQuery, userId) {

    try {

        const response = await axios({
            method: "POST",
            url: "http://127.0.0.1:8000/",
            data: {
                message: userQuery,
                user_id: userId
            },

            // 🔥 IMPORTANT: enables streaming
            responseType: "stream"
        });

        return response.data;

    } catch (error) {

        console.error("❌ FastAPI call error:", error.message);

        throw error;
    }
}