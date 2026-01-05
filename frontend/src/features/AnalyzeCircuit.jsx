import { useState } from "react";
import axios from "axios";

// const [loading, setLoading] = useState(false);
// const [result, setResult] = useState(null);

export const Circuitanalyze = async (imageFile, designParams, modelName, typeName, description) => {
    if (!imageFile) {
        alert("Please upload a circuit image");
        return;
    }

    try {
        const formData = new FormData();

        formData.append("circuitImage", imageFile);

        formData.append("designParams", JSON.stringify(designParams));

        formData.append("modelName", modelName);

        formData.append("categoryName", typeName);

        formData.append("description", description);

        const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/analyze-circuit`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        console.log("here1", response.data);
        const data = await response.data.data;
        return data;
    } catch (err) {
        console.error("Analysis failed:", err);
    }
};
