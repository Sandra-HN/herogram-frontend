import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaClipboard, FaEye } from "react-icons/fa"; // Importing eye icon
import axiosInstance from "../utils/axiosInstance";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BiXCircle } from "react-icons/bi";
import { toast } from "react-toastify";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState("gallery");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get("/files");
        const fileData = response.data.map((file) => {
          let parsedMetadata = {};
          try {
            parsedMetadata = file.metadata ? JSON.parse(file.metadata) : {};
          } catch (error) {
            console.error("Error parsing metadata:", error);
          }
          return { ...file, metadata: parsedMetadata };
        });
        setFiles(fileData);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  // Function to open file in modal
  const openFile = async (file) => {
    try {
      await axiosInstance.post(`/files/${file.id}/view`);
      file.views += 1;
      setSelectedFile(file);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedFile(null);
  };
  // Function to copy sharable link to clipboard
  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Sharable link copied to clipboard!");
  };
  // Swiper settings
  // const sliderSettings = {
  //   modules: [Navigation, Autoplay],
  //   navigation: true,
  //   autoplay: { delay: 3000, disableOnInteraction: false },
  //   spaceBetween: 20,
  //   loop: files.length > 1,
  //   breakpoints: {
  //     320: { slidesPerView: 1 }, // Mobile
  //     640: { slidesPerView: 2 }, // Small screens
  //     1024: { slidesPerView: 3 }, // Medium screens
  //     1280: { slidesPerView: 4 }, // Large screens
  //   },
  //   className: "w-full mx-auto",
  // };
  const sliderSettings = {
    modules: [Navigation, Autoplay],
    navigation: true,
    pagination: { clickable: true },
    autoplay: { delay: 3000, disableOnInteraction: false },
    spaceBetween: 30,
    slidesPerView: 1,
    loop: files.length > 1,
    className: "max-w-sm md:max-w-lg mx-auto",
  };
  return (
    <div className="bg-white  p-6 rounded-md ">
      <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>

      {/* View Mode Toggle */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setViewMode("gallery")}
          className={`px-4 py-2 rounded-md ${
            viewMode === "gallery" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Gallery View
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`px-4 py-2 rounded-md ${
            viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Grid View
        </button>
      </div>

      {/* File List */}
      {viewMode === "gallery" ? (
        <Swiper {...sliderSettings}>
          {files.map((file) => (
            <SwiperSlide key={file.id}>
              <div className="relative group">
                <div className="flex flex-col items-center">
                  {file.metadata.mimeType?.startsWith("image") ? (
                    <img
                      src={`${file.shareableLink}`}
                      alt={file.filename}
                      className="w-full h-96 object-contain bg-gray-200 rounded-md shadow-md"
                    />
                  ) : (
                    <video
                      src={`${file.shareableLink}`}
                      className="w-full h-96 object-contain bg-gray-200 rounded-md shadow-md"
                      controls
                    />
                  )}
                  <p className="mt-2 text-center text-lg font-medium">
                    {file.filename}
                  </p>
                </div>

                {/* View Button */}
                <button
                  onClick={() => openFile(file)}
                  className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <FaEye size={20} />
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative p-2 border rounded-md group"
              onClick={() => openFile(file)}
            >
              {file.metadata.mimeType?.startsWith("image") ? (
                <img
                  src={`${file.shareableLink}`}
                  alt={file.filename}
                  className="w-full h-32 object-contain bg-gray-200 rounded-md shadow-md"
                />
              ) : (
                <video
                  src={`${file.shareableLink}`}
                  className="w-full h-32 object-contain bg-gray-200 rounded-md shadow-md"
                  controls
                />
              )}
              <p className="text-center mt-2 text-sm">{file.filename}</p>

              {/* View Button */}
              <button
                onClick={() => openFile(file)}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <FaEye size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing file details */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md"
            >
              <BiXCircle size={16} />
            </button>
            <div className="overflow-y-auto max-h-[80vh] p-2">
              <h2 className="text-2xl font-bold mb-4">
                {selectedFile.filename}
              </h2>
              {selectedFile.metadata.mimeType?.startsWith("image") ? (
                <img
                  src={`${selectedFile.shareableLink}`}
                  alt={selectedFile.filename}
                  className="w-full h-auto object-contain bg-gray-200 rounded-md"
                />
              ) : (
                <video
                  src={`${selectedFile.shareableLink}`}
                  className="w-full h-auto object-contain bg-gray-200 rounded-md"
                  controls
                />
              )}
              <div className="mt-4">
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedFile.metadata?.description}
                </p>
                <p>
                  <strong>Original Name:</strong>{" "}
                  {selectedFile.metadata?.originalName}
                </p>
                <p>
                  <strong>MIME Type:</strong> {selectedFile.metadata?.mimeType}
                </p>
                <p>
                  <strong>Size:</strong> {selectedFile.metadata?.size} bytes
                </p>
                <p>
                  <strong>Upload Date:</strong>{" "}
                  {new Date(selectedFile.metadata?.uploadDate).toLocaleString()}
                </p>
                <p>
                  <strong>Views:</strong> {selectedFile.views}
                </p>
                <p className="mt-4 flex items-center">
                  <strong className="mr-2">Sharable Link:</strong>
                  <input
                    type="text"
                    readOnly
                    value={selectedFile.shareableLink}
                    className="border p-1 rounded flex-grow"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedFile.shareableLink)}
                    className="ml-2 bg-blue-600 text-white p-2 rounded-md"
                  >
                    <FaClipboard size={16} />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;