import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeCircuit = async (req, res) => {
    try {
        const { designParams, modelName, categoryName, description } = req.body;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ error: "Circuit image required" });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const prompt = `
You are an expert analog electronics engineer and circuit analyst.

You MUST rely strictly on the uploaded circuit image and details provided below.
Circuit Name = ${modelName}
Category = ${categoryName}
Description = ${description}

Do NOT assume any component behavior, ideal models, or topology unless it is
explicitly supported by visual evidence in the circuit.

TASKS (follow in order):

1. VISUAL ANALYSIS
   - Carefully inspect the circuit image.
   - Detect and list ALL visible components and their labels exactly as shown
     (e.g., R1, R2, C1, U1, V1, LM741, TL081, etc).
   - If a label or value is unclear or unreadable, explicitly state that it is unclear.
   - Do NOT rename components.

2. DEVICE MODELING RULES
   - If a specific IC (e.g., LM741) is visible, treat it as a REAL device.
   - Do NOT assume ideal behavior unless:
     - The image explicitly states “ideal”, OR
     - An assumption is unavoidable, in which case it must be listed explicitly.
   - If the device model is unknown, state the uncertainty.

3. DESIGN PARAMETER MAPPING
    - Using ONLY the analyzed topology and identified components,
      determine which components influence the given design parameters.
    - Ignore components that do not affect the design parameters.
    - Every component that must be changed to achieve the required design parameters must appear
    - If the number of adjustable components > number of independent relations, then:
        - The model is allowed to fix (assume) some components
    - Those assumed components should be:
        - Explicitly listed in design_relations
        - Assigned direct values (not formulas) (eg, "design_relations": {
            "R1": "chosen as reference resistor",
            "R2": "R1 × (Gain - 1)",
            "Rin": "1000"
        })

4. SYMBOLIC RELATION DERIVATION
    - Derive SYMBOLIC (algebraic) relations between the relevant components and the design parameters.
    - Do NOT calculate numeric values.
    - Do NOT invent relations that are not justified by the actual circuit.
    - If a relation cannot be derived due to missing information, state that explicitly.

    STRICT DESIGN_RELATIONS FORMAT RULES:

- Each value in "design_relations" MUST be either:
  (a) a pure symbolic equation using component names and design parameters
      Example: "Rf": "Gain * Rin1"
  OR
  (b) a pure numeric assignment represented as a string
      Example: "Rin1": "1000"

- DO NOT include:
  - natural language
  - explanations
  - words like "chosen", "assumed", "set to"
  - units (Ohm, kΩ, Hz, etc.)
  - comments or justifications

- If a component is fixed to resolve underdetermination:
  - Assign only its numeric value in "design_relations"
  - Explain WHY it was fixed ONLY in the "assumptions" section


DESIGN PARAMETERS (user-provided, do not reinterpret):
${designParams}


EXAMPLE OUTPUT FORMAT (JSON ONLY — no markdown, no explanation text):

to_be_modified_components should only contain components that are to be modified to achieve the required design parameters.

{
  "to_be_modified_components": [
    {
      "name": "",
      "type": "Resistor | Capacitor | Inductor",
      "confidence": "high | medium | low"
    }
  ],
  "design_relations": {
    "component_name": "Expression/Value for the component in terms of Design Parameters"
  },
  "assumptions": [
    "Only include assumptions that are strictly necessary and justify each one"
  ],
  "uncertainties": [
    "List any ambiguities due to image quality, missing labels, or unclear wiring"
  ]
}

CRITICAL RULES:
- DO NOT hallucinate missing components or labels.
- DO NOT assume ideal op-amps by default.
- DO NOT rely on textbook formulas unless the topology is fully verified.
- If something cannot be concluded, say so explicitly.
You must:
1. **Extract the JSON block**
2. 
3. **Parse safely**
4. **Fail gracefully if parsing breaks**

This is **mandatory**
`;

        const imagePart = {
            inlineData: {
                data: image.buffer.toString("base64"),
                mimeType: image.mimetype
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const rawText = result.response.text();
        console.log("here2", rawText);
        let parsedJSON;
        try {
            parsedJSON = extractJSONFromLLM(rawText);
        } catch (err) {
            console.error("JSON parse failed:", rawText);
            return res.status(500).json({
                error: "AI returned invalid JSON",
                raw: rawText
            });
        }

        res.json({
            success: true,
            data: parsedJSON
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI processing failed" });
    }
};
function extractJSONFromLLM(text) {
    // Match ```json ... ``` OR fallback to {...}
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/i;
    const match = text.match(jsonBlockRegex);

    let jsonString = match ? match[1] : text;

    // Trim whitespace
    jsonString = jsonString.trim();

    return JSON.parse(jsonString);
}