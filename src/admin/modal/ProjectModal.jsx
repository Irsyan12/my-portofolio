import React, { useState, useEffect } from "react";
import { FaImage, FaLink } from "react-icons/fa";

const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "Project", // Default value
    description: "", // Tambahkan description
    imageUrl: "",
    certificateInstitution: "", // Tambahan untuk institusi sertifikat
    certificateLink: "", // Tambahan untuk link sertifikat
    ...project,
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id,
        title: project.title,
        type: project.type || "Project",
        description: project.description || "", // Default ke string kosong jika tidak ada
        imageUrl: project.imageUrl || "",
        certificateInstitution: project.certificateInstitution || "", // Tambahkan default kosong
        certificateLink: project.certificateLink || "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Tidak ada file yang dipilih!");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "projects_web");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dxwmph7tj/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary error:", data);
        alert("Gagal upload gambar: " + data.error?.message);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.secure_url,
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error saat mengupload gambar. Periksa console untuk detail.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedTitle = formData.title.replace(/\s+/g, "+");

    const imageUrl =
      formData.imageUrl ||
      `https://placehold.co/600x400?text=${formattedTitle}`;

    // Tambahkan kondisi untuk sertifikat
    const finalData = {
      ...formData,
      imageUrl: imageUrl,
    };

    // Jika tipe adalah Certification, pastikan field tambahan diisi
    if (formData.type === "Certification") {
      if (!formData.certificateInstitution) {
        alert("Institusi sertifikat harus diisi");
        return;
      }
    }

    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-color1 text-2xl font-bold mb-4">
          {project ? "Edit Project" : "Add New Project"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              required
            >
              <option value="Project">Project</option>
              <option value="Certification">Certification</option>
            </select>
          </div>

          {formData.type === "Certification" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Certificate Institution
                </label>
                <input
                  type="text"
                  name="certificateInstitution"
                  value={formData.certificateInstitution}
                  onChange={handleChange}
                  className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Certificate Link (Optional)
                </label>
                <div className="flex items-center">
                  <FaLink className="mr-2 text-gray-400" size={20} />
                  <input
                    type="url"
                    name="certificateLink"
                    value={formData.certificateLink}
                    onChange={handleChange}
                    placeholder="https://example.com/certificate"
                    className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
                  />
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              rows="4"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
                disabled={isUploading}
              />
              <label
                htmlFor="imageUpload"
                className={`${
                  isUploading ? "bg-gray-700" : "bg-gray-800"
                } text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center cursor-pointer`}
              >
                <FaImage className="mr-2" size={20} />
                {isUploading ? "Uploading..." : "Upload Gambar"}
              </label>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-color1 text-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              disabled={isUploading}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
