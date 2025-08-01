import { useState, useRef, useEffect } from "react";
import { notify } from "./toastManager";
/**
 * ImageUploadBox
 * Props:
 * - onImageSelect: callback(imageFile)
 * - initialPreview: optional default image URL
 * - boxSize: number (default 200)
 * - label: string
 */
const ImageUploadBox = ({
  setPreviewFile,
  initialPreview = null,
  previewFile,
  boxSize = 200,
  label = "Click to upload image",
}) => {
  const [preview, setPreview] = useState(initialPreview || null);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setPreviewFile(file);
    } else {
      notify.error("Please select a valid image file");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    let objectUrl;

    if (previewFile) {
      objectUrl = URL.createObjectURL(previewFile);
      setPreview(objectUrl);
    } else if (initialPreview) {
      setPreview(initialPreview);
    } else {
      setPreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [initialPreview, previewFile]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div
        onClick={handleClick}
        style={{
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          border: "2px solid #bbb",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "#f9f9f9",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ color: "#777", textAlign: "center" }}>{label}</span>
        )}
      </div>
    </div>
  );
};

export default ImageUploadBox;
