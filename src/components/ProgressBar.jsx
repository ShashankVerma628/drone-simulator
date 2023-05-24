import { useState } from "react";

const ProgressBar = ({ steps, activeStep }) => {
  const [progress, setProgress] = useState(0);

  const progressPercentage = Math.floor((activeStep / steps) * 100);

  if (progress !== progressPercentage) {
    setProgress(progressPercentage);
  }

  return (
    <div className="progress-bar">
      <div
        className="progress"
        style={{ width: `${progress}%`, backgroundColor: "#0042a5" }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
