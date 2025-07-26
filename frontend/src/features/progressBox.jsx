// components/ProgressBox.jsx
import "../styles/progressBox.css"; // optional: separate styles
import DoneIcon from '@mui/icons-material/Done';

const ProgressBox = ({ stepNames, stepInfos, currentStep }) => {
  return (
    <div className="progress-steps">
      {stepNames.map((title, idx) => (
        <div
          key={idx}
          className={`progress-step `}
        >
            <div 
                className={`progress-step-index 
                    ${currentStep === idx + 1 ? "active" : ""} 
                    ${currentStep > idx + 1 ? "completed" : ""}`
                    }>
                    {currentStep > idx + 1 ? <DoneIcon sx={{ fontSize: 20}}/> : ""}
                </div>
            <div className="progress-step-info">
                <h4>{title}</h4>
                <p>{stepInfos[idx]}</p>
            </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBox;
