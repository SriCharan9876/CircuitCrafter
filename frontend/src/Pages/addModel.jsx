import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {notify} from "../features/toastManager"
import { useAuth } from "../contexts/authContext";
import ProgressBox from "../features/progressbox";
import ImageUploadBox from "../features/ImageUploadBox";
import AscFileUploadBox from "../features/AscFileUpload";
import "../styles/addModel.css"; 
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";

const AddModel = () => {
    const navigate=useNavigate();
    const { token } = useAuth();

    const [currentStep, setCurrentStep] = useState(1);
    const stepNames = ["Model details","Upload files","Parameters","Submit"];
    const stepInfos=["Fill model name", "Upload files", "Add params", "Finish"];

    const initialFormData ={
        modelName: "",
        typeName: "",
        description: "",
        fileUrl: "",
        previewImg:{public_id:"",url:""},
        designParameters: [{parameter: "",upperLimit: 10,lowerLimit: 0,},],
        calcParams: [{compName: "",comp: "resistor",},],
        relations: [""],
    };
    const [formData, setFormData] = useState(initialFormData);
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [submitting,setSubmitting]=useState(false);
    
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
        setFormData(prev => ({ ...prev, [name]: value.trimStart() }));
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (!formData.modelName?.trim() || !formData?.typeName?.trim()) {
                notify.error("Please fill all required fields");
                return;
            }
        }else if(currentStep===2){
            if(!file){
                notify.error("Please upload a circuit file");
                return;
            }
        }else{
            const hasInvalidDesignParams = formData.designParameters?.some(para => para.parameter.trim().length === 0);
            const hasInvalidCalcParams = formData.calcParams?.some(para => para.compName.trim().length === 0);
            const hasInvalidRelations=formData.relations?.some(rel => rel.trim().length === 0);

            if (hasInvalidDesignParams || hasInvalidCalcParams || hasInvalidRelations) {
                notify.error("Please delete invalid parameters or relations");
                return;
            }
            if(formData.designParameters.length>0 && formData.calcParams.length===0){
                notify.error("atleast one calculation parameter is required for designing model");
                return;
            }
            if(formData.relations.length<formData.calcParams.length){
                notify.error("Atleast one relation should be defined for each calculation parameter");
                return;
            }
        }
        setCurrentStep((prevstep) => prevstep + 1);
    };


    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((prevstep)=>(prevstep-1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentStep !== stepNames.length) {
            notify.error("Please complete all steps before submitting");
            return;
        }

        if (!file) {
            notify.error("Please upload circuit file before submitting")
            return;
        }

        setSubmitting(true);
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

            // STEP 1b: Upload the preview image file
            let previewImgData = { public_id: "", url: "" };
            if (previewFile) {
                const imgFormData = new FormData();
                imgFormData.append("file", previewFile);
                const imageUploadRes = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/files/baseimg`,
                    imgFormData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                const { public_id, url } = imageUploadRes.data;
                previewImgData = { public_id, url };
            }

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
                notify.success("Model submitted for approval!");
                setTimeout(() => navigate("/models/mymodels"), 1000);
                // Reset form after success
                setFormData(initialFormData);
                setFile(null);
                setPreviewFile(null);
            } else {
                notify.error(modelRes.data.message || "Failed to submit model.");
            }
            
        } catch (err) {
            console.log("Error during submission:", err);
            const backendMsg = err.response?.data?.message;
            notify.error(backendMsg || "Failed to upload or submit model.");
        } finally {
            setSubmitting(false);
        }
    };

    const addinput = () => {
        setFormData((prev) => ({
            ...prev,
            designParameters: [...prev.designParameters,{ parameter: "", upperLimit: 10, lowerLimit: 0 },],
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
    
    const removeCalcParam = (index) => {
        setFormData((prev) => ({
            ...prev,
            calcParams: prev.calcParams.filter((_, i) => i !== index),
        }));
    };

    const removeRelation = (index) => {
        setFormData((prev) => ({
            ...prev,
            relations: prev.relations.filter((_, i) => i !== index),
        }));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                <>
                <div className="addLa">
                    <label>Model Name</label><br />
                    <input
                        type="text"
                        name="modelName"
                        value={formData.modelName}
                        onChange={handleChange}
                        // style={{marginTop:"0"}}
                        required
                    />
                </div>

                <div className="addLa">
                    <label>Category</label><br />
                    <select
                        name="typeName"
                        value={formData.typeName}
                        onChange={handleChange}
                        required
                        className="select-category"
                    >
                        <option value="" className="category-options">Select Type</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name} className="category-options">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="addLa">
                    <label>Description</label><br />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={14}
                        style={{ width: "100%", padding: "8px"}}
                    />
                </div>
                </>
                );
            case 2:
                return (
                <div className="addmodel-upload-section">
                   <div >
                        <label >Upload your circuit file (.asc): </label>
                        <AscFileUploadBox file={file} setFile={setFile} />
                    </div>

                    <div >
                        <label>Upload your circuit preview image (optional):</label>
                        <ImageUploadBox initialPreview={previewFile ? URL.createObjectURL(previewFile) : null} setPreviewFile={setPreviewFile} boxSize={200} />
                    </div>
                </div>
                );
            case 3:
                return (
                <div className="addmodel-inputs">
                    <label>Add Design Parameters<button type="button" onClick={addinput} style={{ marginTop: "10px" }}>
                        <AddIcon/>
                    </button></label><br />

                    {formData.designParameters.length>0&&
                    <div style={{justifyContent:"space-around",marginRight:"10%", gap:"0%"}}>
                        <label>Parameter name</label>
                        <label>Upper limit</label>
                        <label>Lower limit</label>
                    </div>
                    }
                    
                    {formData.designParameters && formData.designParameters.map((param, index) => (
                        <div key={index} className="addmodel-designparam-box">
                            <div>
                                <input
                                    type="text"
                                    value={param.parameter}
                                    onChange={(e) => handleDesignParamChange(index, "parameter", e.target.value)}
                                    placeholder={`name Parameter`}
                                />
                            </div>
                            <div>
                                
                                <input
                                    type="number"
                                    value={param.upperLimit}
                                    onChange={(e) => handleDesignParamChange(index, "upperLimit", parseFloat(e.target.value)||0)}
                                    placeholder="Upper Limit"
                                />
                            </div>
                            <div>
                                
                                <input
                                    type="number"
                                    value={param.lowerLimit}
                                    onChange={(e) => handleDesignParamChange(index, "lowerLimit", parseFloat(e.target.value)||0)}
                                    placeholder="Lower Limit"
                                />
                            </div>
                            
                            <button onClick={() => removeDesignParam(index)} type="button" className="addmodel-deletebtn"><DeleteIcon/></button>                            
                        
                        </div>
                    ))}

                    <label>Add calculation Components<button type="button" onClick={addCalcParam}>
                        <AddIcon/>
                    </button></label><br />
                    {formData.calcParams.map((param, index) => (
                        <div key={index} >
                        <input
                            type="text"
                            value={param.compName}
                            onChange={(e) => handleCalcParamChange(index, "compName", e.target.value)}
                            placeholder={`name component`}
                        />
                        <select
                            value={param.comp}
                            onChange={(e) => handleCalcParamChange(index, "comp", e.target.value)}
                        >
                            <option value="resistor">Resistor</option>
                            <option value="capacitor">Capacitor</option>
                            <option value="inductor">Inductor</option>
                            {/* Add more if needed */}
                        </select>
                        <button onClick={() => removeCalcParam(index)} type="button" className="addmodel-deletebtn"><DeleteIcon/></button>   
                        </div>
                    ))}

                    <label>Create Relations<button type="button" onClick={addRelation}>
                        <AddIcon sx={{fontSize:"1.6rem"}}/>
                    </button></label><br />

                    {formData.relations.map((relation, index) => (
                        <div key={index}>
                            <input
                            type="text"
                            value={relation}
                            onChange={(e) => handleRelationChange(index, e.target.value)}
                            placeholder={`Give relation between parameters, components`}
                            />
                            <button onClick={() => removeRelation(index)} className="addmodel-deletebtn" type="button"><DeleteIcon/></button>   
                        </div>
                    ))}
                    
                </div>
                );
            case 4:
                return <div className="lastStep">
                    Last step for adding instruction and  prerequisite files, if any
                </div>
            default:
                return null;
        }
    };

    return (
        <div className="allPages">
            <div className="addmodel-page">
                <div className="addmodel-sidebar">
                    <div className="addmodel-progressbox">
                        <ProgressBox stepNames={stepNames} stepInfos={stepInfos} currentStep={currentStep} />
                    </div>
                </div>
                <div className="addmodel-data">
                    <h2>Add New Model — Step {currentStep} of {stepNames.length}</h2>
                    <form onSubmit={handleSubmit} className="addmodel-form" >
                        {renderStepContent()}
                        <div className="addmodel-nav-btns">
                            {currentStep > 1 && 
                                <button type="button" 
                                    className="addmodel-navigate-btn" 
                                    onClick={handleBack}
                                    ><NavigateBeforeIcon/>Back</button>}
                            {currentStep < stepNames.length && 
                                <button type="button" 
                                    className="addmodel-navigate-btn" 
                                    onClick={handleNext}
                                    >Next <NavigateNextIcon/></button>}
                            {currentStep === stepNames.length &&
                                <button type="submit" 
                                    className="addmodel-navigate-btn" 
                                    style={{backgroundColor:"green"}}
                                    disabled={submitting}>
                                    {submitting ? (
                                        <>
                                        Submitting...
                                        <CircularProgress size={20} color="inherit" />
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                    </button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddModel;
