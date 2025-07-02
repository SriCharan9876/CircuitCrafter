import fs from "fs"
import path from "path";

/**
 * Modifies an LTspice .asc file to update resistor values based on desired gain
 * for a non-inverting amplifier configuration: Gain = 1 + (Rf / Rin)
 * 
 * @param {string} inputPath - Path to the input .asc file
 * @param {string} outputPath - Path to save the modified .asc file
 * @param {number} gain - Desired amplifier gain (e.g., 5)
 * @param {number} Rin - Input resistance in ohms (e.g., 1000 for 1k)
 * 
 * @returns {Object} - Status object with success message or error
 */
function modifyLtspiceGain(inputPath, outputPath, gain, Rin = 1000) {
    try {
        const Rf = Math.round((gain) * Rin);
        const content = fs.readFileSync(path.resolve(inputPath), 'utf8');

        const updated = content
            .replace(/SYMATTR InstName Rin[\s\S]*?SYMATTR Value [^\n]+/, match => {
                return match.replace(/SYMATTR Value .+/, `SYMATTR Value ${Rin}`);
            })
            .replace(/SYMATTR InstName Rf[\s\S]*?SYMATTR Value [^\n]+/, match => {
                return match.replace(/SYMATTR Value .+/, `SYMATTR Value ${Rf}`);
            });

        fs.writeFileSync(path.resolve(outputPath), updated, 'utf8');

        return {
            success: true,
            message: `Updated file saved to ${outputPath}. Rin=${Rin}Ω, Rf=${Rf}Ω for Gain=${gain}`
        };
    } catch (error) {
        return {
            success: false,
            message: `Error: ${error.message}`
        };
    }
}

export default modifyLtspiceGain;