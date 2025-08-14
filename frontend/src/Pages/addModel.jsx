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
import AddLinkIcon from '@mui/icons-material/AddLink';
import ContentCutIcon from '@mui/icons-material/ContentCut';

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
        specifications:["Gain Range is -1 to -10","Input Amplitude Range is 0-10mV", "Invered output"],
        prerequisites:[]
    };
    const [formData, setFormData] = useState(initialFormData);
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [submitting,setSubmitting]=useState(false);
    const [components, setComponents]=useState([]);
    const [newComponents, setNewComponents] = useState([]); 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
                setCategories(res.data.allCategories);
            } catch (error) {
                console.error("Error fetching categories", error);
            }
        };
        fetchCategories();
        const fetchComponents = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/components`);
                setComponents(res.data.allComponents);
            } catch (error) {
                console.error("Error fetching components", error);
            }
        };
        fetchComponents();
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

            //Step 1c: Add new components if created in datbase 
            let createdComponentIds = [];
            if(newComponents.length>0){
                for(let comp of newComponents){
                    if (!comp.name.trim()) {
                        notify.error("New component name cannot be empty");
                        setSubmitting(false);
                        return;
                    }

                    //Upload files to cloud and get download URL's
                    let uploadedFiles = [];
                    for (let f of comp.files) {
                        if (!f.file) continue; // skip empty
                        const fileForm = new FormData();
                        fileForm.append("file", f.file);

                        const uploadRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/files/componentfile`,fileForm,
                            {
                                headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        uploadedFiles.push({
                            type: f.type,
                            downloadUrl: uploadRes.data.fileUrl,
                            public_id:uploadRes.data.public_id,
                            savePath: f.savePath
                        });
                    }

                    const compRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/components`,
                        {
                            name: comp.name.trim(),
                            description: comp.description.trim(),
                            files: uploadedFiles
                        },
                        {
                            withCredentials: true,
                            headers: {Authorization: `Bearer ${token}` },
                        }
                    );
                    if (compRes.data?.component?._id) {
                        createdComponentIds.push(compRes.data.component._id);
                    } else {
                        notify.error("Failed to create a component: " + comp.name);
                        setSubmitting(false);
                        return;
                    }
                    
                }
            }

            // STEP 1d: Merge prerequisites (existing + new)
            const prerequisiteIds = [
                ...(formData.prerequisites?.filter(p => p)?.map(p => p) || []),
                ...createdComponentIds
            ];

            // STEP 2: Now submit the form with the uploaded URLs, prerequisites
            const finalData = {
                ...formData,
                fileUrl: uploadedUrl2,
                previewImg:previewImgData,
                prerequisites: prerequisiteIds
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

    const addSpecification = () => {
        setFormData((prev) => ({
            ...prev,
            specifications: [...prev.specifications, ""],
        }));
    };

    const addPreRequisite  = () => {
        setFormData((prev) => ({
            ...prev,
            prerequisites: [...(prev.prerequisites||[]),""],
        }));
    };

    const addNewComponent = (index) => {
        setNewComponents([...newComponents, { name: "", description: "", files: [] }]);
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

    const handleSpecificationChange = (index, value) => {
        const updated = [...formData.specifications];
        updated[index] = value;
        setFormData((prev) => ({
            ...prev,
            specifications: updated,
        }));
    };

    const handlePreRequisiteChange = (index, value) => {
        const updatedPrereqs = [...formData.prerequisites];
        updatedPrereqs[index] = value;
        setFormData((prev) => ({
            ...prev,
            prerequisites: updatedPrereqs
        }));
    };

    const handleNewComponentChange = (index, field, value) => {
        const updated = [...newComponents];
        updated[index][field] = value;
        setNewComponents(updated);
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

    const removeSpecification = (index) => {
        setFormData((prev) => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index),
        }));
    };

    const removePreRequisite = (index) => {
        const updatedPrereqs = formData.prerequisites.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            prerequisites: updatedPrereqs
        }));
    };

    const removeNewComponent = (index) => {
        const updated = [...newComponents];
        updated.splice(index, 1);
        setNewComponents(updated);
    };

    // Add new empty file entry to a new component
    const addNewComponentFile = (compIdx) => {
        const updated = [...newComponents];
        updated[compIdx].files.push({ type: "symbol", file: null, savePath:""}); // file will be uploaded before submit
        setNewComponents(updated);
    };

    // Handle file type change
    const handleNewComponentFileChange = (compIdx, fileIdx, field, value) => {
        const updated = [...newComponents];
        updated[compIdx].files[fileIdx][field] = value;
        setNewComponents(updated);
    };

    // Handle actual file selection
    const handleNewComponentFileUpload = (compIdx, fileIdx, file) => {
        const updated = [...newComponents];
        updated[compIdx].files[fileIdx].file = file; // store File object temporarily
        setNewComponents(updated);
    };

    // Remove a file entry
    const removeNewComponentFile = (compIdx, fileIdx) => {
        const updated = [...newComponents];
        updated[compIdx].files.splice(fileIdx, 1);
        setNewComponents(updated);
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
                            className=""
                        >
                            <option value="resistor" className="category-options">Resistor</option>
                            <option value="capacitor" className="category-options">Capacitor</option>
                            <option value="inductor" className="category-options">Inductor</option>
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
                return <div className="addmodel-inputs lastStep">
                    <label>Add Specification<button type="button" onClick={addSpecification}>
                        <AddIcon sx={{fontSize:"1.6rem"}}/>
                    </button></label><br />

                    {formData.specifications.map((specification, index) => (
                        <div key={index}>
                            <input
                            type="text"
                            value={specification}
                            onChange={(e) => handleSpecificationChange(index, e.target.value)}
                            placeholder={`Give Specification - ${index}`}
                            />
                            <button onClick={() => removeSpecification(index)} className="addmodel-deletebtn" type="button"><DeleteIcon/></button>   
                        </div>
                    ))}

                    <label>Create or Link pre-requisite components
                        <button type="button" onClick={addPreRequisite} style={{padding:"0.4rem"}} title="Link existing component as prerequisite">
                        <AddLinkIcon/>
                        </button>
                        <button type="button" onClick={addNewComponent} style={{padding:"0.4rem"}} title="Create new component as prerequisite">
                        <AddIcon/>
                        </button>
                    </label><br />
                    
                    {formData.prerequisites?.map((prerequisite, index) => (
                        <div key={index} >
                        <select
                            value={prerequisite}
                            onChange={(e) => handlePreRequisiteChange(index,e.target.value)}
                            className="select-category"
                        >
                            <option value="" className="category-options">Select component</option>
                            {components.map(comp => (
                                <option key={comp._id} value={comp._id} className="category-options">
                                {comp.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={() => removePreRequisite(index)} type="button" className="addmodel-deletebtn"><DeleteIcon/></button>
                        </div>
                    ))}

                    <section style={{width:"100%", marginBottom:"1rem"}}>
                    {newComponents.map((comp, idx) => (
                        <div key={idx} className="new-component-form">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Component Name"
                                    value={comp.name}
                                    onChange={(e) => handleNewComponentChange(idx, "name", e.target.value)}
                                />
                                <button type="button" className="new-component-delete-btn" onClick={() => removeNewComponent(idx)}><DeleteIcon/>Delete Component</button>
                            </div>
                            <textarea
                                placeholder="Description"
                                value={comp.description}
                                onChange={(e) => handleNewComponentChange(idx, "description", e.target.value)}
                            />

                            {/* File inputs */}
                            <label>Create files for this component
                                <button style={{padding:"0.4rem"}} type="button" onClick={() => addNewComponentFile(idx)}>
                                <AddIcon/>
                                </button>
                            </label><br />

                            {comp.files.map((fileObj, fIdx) => (
                            <section key={fIdx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>

                                <div>
                                    {/* File picker */}
                                    <input
                                    type="file"
                                    accept={
                                        fileObj.type === "symbol" ? ".asy" :
                                        fileObj.type === "model" ? ".sub,.lib,.301,.cir" :
                                        ".asc"
                                    }
                                    onChange={(e) => handleNewComponentFileUpload(idx, fIdx, e.target.files[0])}
                                    />

                                    {/* Type selector */}
                                    <select
                                        value={fileObj.type}
                                        onChange={(e) => handleNewComponentFileChange(idx, fIdx, "type", e.target.value)}
                                        className="select-category"
                                        >
                                        <option value="symbol" className="category-options">Symbol (.asy)</option>
                                        <option value="model" className="category-options">Model (.sub, .lib, .301, .cir)</option>
                                        <option value="hierarchicalSchematic" className="category-options">Hierarchical Schematic (.asc)</option>
                                    </select>
                                </div>

                                <div>
                                    {/*Save path */}
                                    <input
                                        type="text"
                                        placeholder="Path to save file in local storage"
                                        value={fileObj.savePath}
                                        onChange={(e) => handleNewComponentFileChange(idx, fIdx, "savePath", e.target.value)}
                                    />

                                    <button type="button" className="new-component-delete-btn" onClick={() => removeNewComponentFile(idx, fIdx)}><ContentCutIcon/>Delete File</button>
                                    
                                </div>
                            </section>
                            ))}
                        </div>
                    ))}
                    </section>   

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
