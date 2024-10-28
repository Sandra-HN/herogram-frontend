import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({}); // State for validation errors

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        const isValidType =
          file.type.startsWith("image/") || file.type.startsWith("video/");
        const isValidSize = file.size <= MAX_FILE_SIZE;

        if (!isValidType) {
          toast.error("Only images and videos are allowed.");
        }

        if (!isValidSize) {
          toast.error("File size must be less than 2 MB.");
        }

        return isValidType && isValidSize;
      });

      setFiles(validFiles);
    },
  });

  // Handle form validation before upload
  const validateForm = () => {
    const newErrors = {};

    if (!files.length) {
      newErrors.files = "Please select at least one valid file.";
    }

    if (!tags.trim()) {
      newErrors.tags = "Tags cannot be empty.";
    }

    if (!description.trim()) {
      newErrors.description = "Description cannot be empty.";
    }

    setErrors(newErrors);

    // Show error toasts if validation fails
    if (newErrors.files) toast.error(newErrors.files);
    if (newErrors.tags) toast.error(newErrors.tags);
    if (newErrors.description) toast.error(newErrors.description);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    // Validate the form before proceeding
    if (!validateForm()) return;

    const formData = new FormData();

    files.forEach((file) => formData.append("file", file));
    formData.append("tags", tags);
    formData.append("metadata", JSON.stringify({ description }));

    try {
      await axiosInstance.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Files uploaded successfully!");
      setFiles([]); // Clear files after successful upload
      setTags(""); // Clear tags
      setDescription(""); // Clear description
      setErrors({}); // Clear errors
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files.");
    }
  };

  return (
    <div className="bg-white  p-6 rounded-md mb-6">
      {/* File Dropzone */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-8 text-center cursor-pointer mb-4"
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          Drag & drop files here, or click to select files
        </p>
      </div>
      {errors.files && <p className="text-red-500">{errors.files}</p>}

      {/* File Previews */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {files.map((file, index) => (
          <div key={index} className="border p-2 rounded-md">
            {file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 object-cover rounded-md"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                className="w-full h-32 object-cover rounded-md"
                controls
              />
            )}
            <p className="text-sm text-center mt-2">{file.name}</p>
          </div>
        ))}
      </div>

      {/* Tags Input */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="e.g. document, image, personal"
        />
        {errors.tags && <p className="text-red-500">{errors.tags}</p>}
      </div>

      {/* Metadata Input */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Add a description for the file(s)"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded-md"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
