import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import {notify} from "../features/toastManager"


const EditModel = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    modelName: "",
    typeName: "",
    description: "",
    fileUrl: "",
    previewImg:{
      public_id:"",
      url:""
    },
    designParameters: [{ parameter: "", upperLimit: 10, lowerLimit: 0 }],
    calcParams: [{ compName: "", comp: "resistor" }],
    relations: [""],
  });

  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/models/${id}`);
        setFormData(res.data.pmodel);
      } catch (err) {
        console.error("Failed to fetch model", err);
        notify.error("Error loading model's data")
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        setCategories(res.data.allCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchModel();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    try {
      let fileUrl = formData.fileUrl;

      if (file) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/files/baseFile`, uploadForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fileUrl = uploadRes.data.fileUrl;
      }

      let previewImgData = null;
      if(previewFile){
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
        console.log("Uploaded preview image:", public_id, url);
        previewImgData={public_id,url};
      };

      const updatedModel = {
        ...formData,
        fileUrl: fileUrl || formData.fileUrl,
        ...(previewImgData && { previewImg: previewImgData }),
      };
      console.log("Updated Model Payload:", updatedModel);


      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/models/${id}`,
        updatedModel,
        {
          headers:{ 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` 
          },
          withCredentials: true,
        }
      );

      if (res.data.updated) {
        setMessage("Model updated successfully!");
        navigate(`/models/${id}`); // Update with correct route
      } else {
        setMessage("Failed to update model.");
      }
    } catch (err) {
      console.error("Error during model update", err);
      setMessage("An error occurred while updating.");
    }
  };

  const handleDesignParamChange = (index, field, value) => {
    const updated = [...formData.designParameters];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, designParameters: updated }));
  };

  const handleCalcParamChange = (index, field, value) => {
    const updated = [...formData.calcParams];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, calcParams: updated }));
  };

  const handleRelationChange = (index, value) => {
    const updated = [...formData.relations];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, relations: updated }));
  };

  const addinput = () => {
    setFormData((prev) => ({
      ...prev,
      designParameters: [...prev.designParameters, { parameter: "", upperLimit: 10, lowerLimit: 0 }],
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

  return (
    <div style={{ maxWidth: "600px", margin: "auto", marginTop: "50px" }} className="allPages">
      <h2>Edit Model</h2>
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
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          {formData.fileUrl && (
            <a href={formData.fileUrl} target="_blank" rel="noreferrer">
              View Uploaded File
            </a>
          )}
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
          {formData.designParameters.map((param, index) => (
            <div key={index} style={{ marginBottom: "12px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
              <input
                type="text"
                value={param.parameter}
                onChange={(e) => handleDesignParamChange(index, "parameter", e.target.value)}
                placeholder={`Parameter ${index + 1}`}
                style={{ width: "30%", padding: "8px", marginRight: "10px" }}
              />
              <input
                type="number"
                value={param.upperLimit}
                onChange={(e) => handleDesignParamChange(index, "upperLimit", parseFloat(e.target.value))}
                placeholder="Upper Limit"
                style={{ width: "20%", padding: "8px", marginRight: "10px" }}
              />
              <input
                type="number"
                value={param.lowerLimit}
                onChange={(e) => handleDesignParamChange(index, "lowerLimit", parseFloat(e.target.value))}
                placeholder="Lower Limit"
                style={{ width: "20%", padding: "8px" }}
              />
            </div>
          ))}
          <button type="button" onClick={addinput}>Add another Parameter</button>
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
              </select>
            </div>
          ))}
          <button type="button" onClick={addCalcParam}>Add another component</button>
        </div>

        <div className="inputs" style={{ marginTop: "20px" }}>
          <label>Relations / Equations:</label>
          {formData.relations.map((rel, index) => (
            <input
              key={index}
              type="text"
              value={rel}
              onChange={(e) => handleRelationChange(index, e.target.value)}
              placeholder={`Relation ${index + 1}`}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          ))}
          <button type="button" onClick={addRelation}>Add another relation</button>
        </div>

        <button type="submit" style={{ marginTop: "20px", padding: "10px 20px" }}>
          Update
        </button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default EditModel;
