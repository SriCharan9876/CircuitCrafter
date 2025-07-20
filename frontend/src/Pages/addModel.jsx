import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {notify} from "../features/toastManager"
import { useAuth } from "../contexts/authContext";

const AddModel = () => {
    const navigate=useNavigate();
    const { user, token } = useAuth();
    const initialFormData ={
        modelName: "",
        typeName: "",
        description: "",
        fileUrl: "",
        previewImg:{
            public_id:"",
            url:""
        },
        designParameters: [
            {
            parameter: "",
            upperLimit: 10,
            lowerLimit: 0,
            },
        ],
        calcParams: [
            {
            compName: "",
            comp: "resistor",
            },
        ],
        relations: [""],
    };
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState("");
    const [previewFile, setPreviewFile] = useState(null);


    useEffect(()=>{
        if (!user) {
            notify.info("You shoul login for adding a model")
            navigate("/login");
        }
    },[user])
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
                setCategories(res.data.allCategories); // assuming data is array of { _id, name }
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreviewFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.type.startsWith("image/")) {
            setMessage("Only image files are allowed for profile picture.");
            setFile(null);
        } else {
            setPreviewFile(selectedFile);
            setMessage(""); // clear old error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please upload basemodel file before submitting.");
            return;
        }
        if (!previewFile) {
            setMessage("Please upload circuit preview image before submitting.");
            return;
        }
        try {

            // STEP 1a: Upload the .asc file
            const formData2 = new FormData();
            formData2.append("file", file);
            const uploadRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/files/basefile`, formData2, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
            });
            const uploadedUrl2 = uploadRes.data.fileUrl;
            setUploadedUrl(uploadedUrl2);

            // STEP 1b: Upload the preview image file
            const imgFormData=new FormData();
            imgFormData.append("file",previewFile);
            const imageUploadRes=await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/files/baseimg`,
                imgFormData,
                {headers:{
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }}
            );
            const {public_id,url}=imageUploadRes.data;
            let previewImgData={public_id,url};

            // STEP 2: Now submit the form with the uploaded URL
            const finalData = {
                ...formData,
                fileUrl: uploadedUrl2,
                previewImg:previewImgData,
            };
            const modelRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/models`, finalData, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (modelRes.data.added) {
                setMessage("Model submitted for approval!");
                notify.success("Model submitted for approval!");
                setTimeout(() => navigate("/models/mymodels"), 1000);
            } else {
                setMessage("Failed to submit model. Please check input or try again.");
                notify.error("Failed to submit");
            }
            // Reset form after success
            setFormData(initialFormData);
            setFile(null);
            setUploadedUrl("");
        } catch (err) {
            console.error("Error during submission:", err);
            notify.error("Failed to upload or submit model.")
        }
    };

    const addinput = () => {
        setFormData((prev) => ({
            ...prev,
            designParameters: [
            ...prev.designParameters,
            { parameter: "", upperLimit: 10, lowerLimit: 0 },
            ],
        }));
    };

    const addCalcParam = () => {
        setFormData((prev) => ({
            ...prev,
            calcParams: [...prev.calcParams, { compName: "", comp: "resistor" }],
        }));
    };

    const addRelation = () => {
        setFormData((prev) => ({
            ...prev,
            relations: [...prev.relations, ""],
        }));
    };


    const handleDesignParamChange = (index, field, value) => {
        const updatedParams = [...formData.designParameters];
        updatedParams[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            designParameters: updatedParams,
        }));
    };

    const handleCalcParamChange = (index, field, value) => {
        const updated = [...formData.calcParams];
        updated[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            calcParams: updated,
        }));
    };

    const handleRelationChange = (index, value) => {
        const updated = [...formData.relations];
        updated[index] = value;
        setFormData((prev) => ({
            ...prev,
            relations: updated,
        }));
    };

    const removeDesignParam = (index) => {
        setFormData((prev) => ({
            ...prev,
            designParameters: prev.designParameters.filter((_, i) => i !== index),
        }));
    };


    return (
        <div style={{ maxWidth: "600px", margin: "auto" }} className="allPages">
            <h2>Add New Model</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Model Name:</label><br />
                    <input
                        type="text"
                        name="modelName"
                        value={formData.modelName}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Type (Category):</label><br />
                    <select
                        name="typeName"
                        value={formData.typeName}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="">Select Type</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Description:</label><br />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div>
                    <label>Upload your circuit file (.asc): </label>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                  {uploadedUrl && <a href={uploadedUrl} target="_blank" rel="noreferrer">View Uploaded File</a>}
                </div>

                <div>
                    <label>Upload your circuit preview image (optional):</label>
                    <input type="file"  onChange={handlePreviewFileChange} />
                    <button type="button" onClick={() => setPreviewFile(null)}>remove image</button>
                </div>

                {previewFile && (
                    <div style={{ marginTop: "10px" }}>
                        <h3>Circuit image preview:</h3>
                        <img
                        src={URL.createObjectURL(previewFile)}
                        alt="Preview"
                        style={{ width: "600px", marginTop: "10px", borderRadius: "6px" }}
                        />
                    </div>
                )}

                <div className="inputs">
                    <label>Design Parameters:</label>
                    {formData.designParameters && formData.designParameters.map((param, index) => (
                        <div key={index} style={{ marginBottom: "12px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px", maxWidth:"100%"}}>
                            <input
                                type="text"
                                value={param.parameter}
                                onChange={(e) => handleDesignParamChange(index, "parameter", e.target.value)}
                                placeholder={`Parameter ${index + 1} name`}
                                style={{ width: "30%", padding: "8px", marginLeft: "1%", marginRight: "1%" }}
                                id="parameter"
                            />
                            <label htmlFor="upperLimit">Upper limit:</label>
                            <input
                                type="number"
                                value={param.upperLimit}
                                onChange={(e) => handleDesignParamChange(index, "upperLimit", parseFloat(e.target.value))}
                                placeholder="Upper Limit"
                                style={{ width: "10%", padding: "8px", marginLeft: "1%", marginRight: "1%"  }}
                                id="upperLimit"
                            />
                            <label htmlFor="lowerLimit">Lower limit:</label>
                            <input
                                type="number"
                                value={param.lowerLimit}
                                onChange={(e) => handleDesignParamChange(index, "lowerLimit", parseFloat(e.target.value))}
                                placeholder="Lower Limit"
                                style={{ width: "10%", padding: "8px", marginLeft: "1%", marginRight: "1%"  }}
                                id="lowerLimit"
                            />
                            <button onClick={() => removeDesignParam(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addinput} style={{ marginTop: "10px" }}>
                        Add another Parameter
                    </button>
                </div>

                <div className="inputs" style={{ marginTop: "20px" }}>
                    <label>Calculated Components:</label>
                    {formData.calcParams.map((param, index) => (
                        <div key={index} style={{ marginBottom: "12px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
                        <input
                            type="text"
                            value={param.compName}
                            onChange={(e) => handleCalcParamChange(index, "compName", e.target.value)}
                            placeholder={`Component Name ${index + 1}`}
                            style={{ width: "100%", padding: "8px", marginBottom: "6px" }}
                        />
                        <select
                            value={param.comp}
                            onChange={(e) => handleCalcParamChange(index, "comp", e.target.value)}
                            style={{ width: "100%", padding: "8px" }}
                        >
                            <option value="resistor">Resistor</option>
                            <option value="capacitor">Capacitor</option>
                            <option value="inductor">Inductor</option>
                            {/* Add more if needed */}
                        </select>
                        </div>
                    ))}
                    <button type="button" onClick={addCalcParam} style={{ marginTop: "10px" }}>
                        Add another component
                    </button>
                </div>

                <div className="inputs" style={{ marginTop: "20px" }}>
                    <label>Relations / Equations:</label>
                    {formData.relations.map((relation, index) => (
                        <input
                        key={index}
                        type="text"
                        value={relation}
                        onChange={(e) => handleRelationChange(index, e.target.value)}
                        placeholder={`Relation ${index + 1}`}
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                        />
                    ))}
                    <button type="button" onClick={addRelation}>
                        Add another relation
                    </button>
                </div>

                <button type="submit" style={{ marginTop: "20px", padding: "10px 20px" }}>
                    Submit
                </button>
            </form>

            {message && <p style={{ marginTop: "20px" }}>{message}</p>}
        </div>
    );
};

export default AddModel;
