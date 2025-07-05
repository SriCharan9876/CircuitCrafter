import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier"; // to upload from string/buffer
import axios from "axios"
/**
 * Parses LTspice-style values like '1k', '10m', etc. to numeric.
 */
function parseValue(valStr) {
    const multipliers = { 'k': 1e3, 'm': 1e-3, 'u': 1e-6, 'n': 1e-9 };
    valStr = valStr.trim().toLowerCase();

    for (const [suffix, factor] of Object.entries(multipliers)) {
        if (valStr.endsWith(suffix)) {
            return parseFloat(valStr.replace(suffix, '')) * factor;
        }
    }

    return parseFloat(valStr);
}

/**
 * Converts numeric values to LTspice-style format.
 */
function formatValue(val) {
    if (val >= 1000 && val % 1000 === 0) return `${val / 1000}k`;
    if (val < 1) {
        if (val >= 1e-3) return (val * 1e3).toFixed(2) + 'm';
        if (val >= 1e-6) return (val * 1e6).toFixed(2) + 'u';
        if (val >= 1e-9) return (val * 1e9).toFixed(2) + 'n';
    }
    return val.toFixed(2).replace(/\.00$/, '');
}

/**
 * Safely evaluates an expression with variables.
 */
function safeEval(expression, context) {
    return Function(...Object.keys(context), `return ${expression}`)(...Object.values(context));
}

async function modifyLtspiceFileFromCloud(inputFileUrl, inputValues, calc2, relations) {
    // Fetch the .asc file content from the URL
    const { data: content } = await axios.get(inputFileUrl); // returns string

    const lines = content.split('\n');

    // Step 1: Evaluate variables
    const context = { ...inputValues };
    for (const relation of relations) {
        const [key, expr] = relation.split('=').map(s => s.trim());
        try {
            context[key] = safeEval(expr, context);
        } catch (err) {
            throw new Error(`Failed to evaluate "${relation}": ${err.message}`);
        }
    }

    // Step 2: Replace component values in .asc file
    for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith('SYMATTR InstName')) {
            const compName = line.split(' ').pop();
            if (calc2.includes(compName)) {
                const valueLineIdx = i + 1;
                if (lines[valueLineIdx].trim().startsWith('SYMATTR Value')) {
                    const newValStr = formatValue(context[compName]);
                    lines[valueLineIdx] = `SYMATTR Value ${newValStr}`;
                }
            }
        }
    }

    const modifiedContent = lines.join('\n');

    // Step 3: Upload modified content to Cloudinary
    const uploadStream = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                resource_type: "raw",
                folder: 'CircuitCrafter',
                public_id: `ltspice_outputs/${Date.now()}_modified.asc`,
                use_filename: true,
                unique_filename: false,
                overwrite: true,
            }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });

            streamifier.createReadStream(modifiedContent).pipe(stream);
        });
    };

    const uploadResult = await uploadStream();

    return {
        cloudinaryUrl: uploadResult.secure_url,
        values: calc2.map(c => ({ [c]: formatValue(context[c]) }))
    };
}


/**
 * Main function to modify and upload LTspice .asc file to Cloudinary.
 */
async function modifyLtspiceFileAndUpload(inputFile, inputValues, calc2, relations) {
    const filePath = path.resolve(inputFile);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Step 1: Evaluate variables
    const context = { ...inputValues };
    for (const relation of relations) {
        const [key, expr] = relation.split('=').map(s => s.trim());
        try {
            context[key] = safeEval(expr, context);
        } catch (err) {
            throw new Error(`Failed to evaluate "${relation}": ${err.message}`);
        }
    }

    // Step 2: Replace component values in .asc file
    for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith('SYMATTR InstName')) {
            const compName = line.split(' ').pop();
            if (calc2.includes(compName)) {
                const valueLineIdx = i + 1;
                if (lines[valueLineIdx].trim().startsWith('SYMATTR Value')) {
                    const newValStr = formatValue(context[compName]);
                    lines[valueLineIdx] = `SYMATTR Value ${newValStr}`;
                }
            }
        }
    }

    const modifiedContent = lines.join('\n');

    // Step 3: Upload modified content to Cloudinary
    const uploadStream = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                resource_type: "raw",
                folder:'CircuitCrafter',
                public_id: `ltspice_outputs/${Date.now()}_modified.asc`,
                use_filename: true,
                unique_filename: false,
                overwrite: true,
            }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });

            streamifier.createReadStream(modifiedContent).pipe(stream);
        });
    };

    const uploadResult = await uploadStream();

    // Optional log
    console.log(`✅ Uploaded to Cloudinary: ${uploadResult.secure_url}`);

    return {
        cloudinaryUrl: uploadResult.secure_url,
        values: calc2.map(c => ({ [c]: formatValue(context[c]) }))
    };
}

export default modifyLtspiceFileFromCloud;
