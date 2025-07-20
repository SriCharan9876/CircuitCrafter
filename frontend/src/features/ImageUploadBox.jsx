import React, { useState, useRef, useEffect } from "react";

/**
 * ImageUploadBox
 * Props:
 * - onImageSelect: callback(imageFile)
 * - initialPreview: optional default image URL
 * - boxSize: number (default 200)
 * - label: string
 */
const ImageUploadBox = ({
  onImageSelect,
  initialPreview = null,
  boxSize = 200,
  label = "Click to upload image",
}) => {
  const [preview, setPreview] = useState(initialPreview);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelect?.(file);
    } else {
      notify.error("Please select a valid image file");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (preview && !initialPreview) URL.revokeObjectURL(preview);
    };
  }, [preview, initialPreview]);

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
