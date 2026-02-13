import React, { useState, useEffect } from "react";
import { FaImage, FaLink, FaGithub, FaPlay, FaTimes } from "react-icons/fa";
import OutlinedTextField from "../../components/OutlinedTextField"; // Import OutlinedTextField
import { iconDict } from "../../utils/getTechIcons";

const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "project", // Default value (lowercase for backend)
    description: "",
    imageUrl: "",
    projectLink: "", // Project repository link
    demoLink: "", // New demo link field
    techStack: [], // New tech stack field
    certificateInstitution: "",
    certificateLink: "",
    ...project,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [linkPreview, setLinkPreview] = useState(null);
  const [techStackInput, setTechStackInput] = useState("");

  const techStackOptions = Object.keys(iconDict);

  useEffect(() => {
    if (project) {
      setFormData({
        _id: project._id,
        title: project.title,
        type: project.type || "project",
        description: project.description || "",
        imageUrl: project.imageUrl || "",
        projectLink: project.projectLink || project.githubUrl || "",
        demoLink: project.demoLink || project.demoUrl || "", // Include demo link
        techStack: project.techStack || [],
        certificateInstitution: project.certificateInstitution || "",
        certificateLink: project.certificateLink || "",
      });

      // Load link preview if project link exists
      if (project.projectLink || project.githubUrl) {
        fetchLinkPreview(project.projectLink || project.githubUrl);
      }
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle tech stack input
  const handleTechStackInputChange = (e) => {
    setTechStackInput(e.target.value);
  };

  // Add tech stack from input
  const addTechStack = (tech) => {
    if (tech && !formData.techStack.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, tech],
      }));
    }
    setTechStackInput("");
  };

  // Handle tech stack input key press
  const handleTechStackKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechStack(techStackInput.trim());
    }
  };

  // Remove tech stack
  const removeTechStack = (techToRemove) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((tech) => tech !== techToRemove),
    }));
  };

  const fetchLinkPreview = async (url) => {
    if (!url || !url.trim().startsWith("http")) return;

    setIsLoadingPreview(true);
    try {
      const response = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=false`
      );

      if (!response.ok) throw new Error("Failed to fetch link preview");

      const { data } = await response.json();

      const previewData = {
        title: data.title || "No Title",
        description: data.description || "",
        image: data.image?.url || null,
        url: data.url,
      };

      setLinkPreview(previewData);

      if (url.includes("github.com")) {
        try {
          const parts = url.split("github.com/")[1]?.split("/");
          if (parts && parts.length >= 2) {
            const username = parts[0];
            const repo = parts[1];

            const githubResponse = await fetch(
              `https://api.github.com/repos/${username}/${repo}`
            );

            if (githubResponse.ok) {
              const repoData = await githubResponse.json();

              previewData.description =
                repoData.description || previewData.description;
              previewData.title = repoData.full_name || previewData.title;

              const ogImageUrl = `https://opengraph.githubassets.com/1/${username}/${repo}`;
              previewData.image = ogImageUrl;

              setLinkPreview(previewData);

              if (!formData.imageUrl) {
                setFormData((prev) => ({
                  ...prev,
                  imageUrl: ogImageUrl,
                }));
              }
            }
          }
        } catch (githubErr) {
          console.error("Error fetching GitHub data:", githubErr);
          if (!previewData.image) {
            previewData.image =
              "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
            setLinkPreview(previewData);
          }
        }
      }

      if (previewData.image && !formData.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: previewData.image,
        }));
      }
    } catch (error) {
      console.error("Error fetching link preview:", error);

      if (url.includes("github.com")) {
        const parts = url.split("github.com/")[1]?.split("/");
        if (parts && parts.length >= 2) {
          const username = parts[0];
          const repo = parts[1];

          const fallbackPreview = {
            title: `${username}/${repo}`,
            description: "GitHub Repository",
            image: `https://opengraph.githubassets.com/1/${username}/${repo}`,
            url: url,
          };

          setLinkPreview(fallbackPreview);

          if (!formData.imageUrl) {
            setFormData((prev) => ({
              ...prev,
              imageUrl: fallbackPreview.image,
            }));
          }
        } else {
          const fallbackPreview = {
            title: url.split("/").slice(-2).join("/"),
            description: "GitHub Repository",
            image:
              "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            url: url,
          };

          setLinkPreview(fallbackPreview);

          if (!formData.imageUrl) {
            setFormData((prev) => ({
              ...prev,
              imageUrl: fallbackPreview.image,
            }));
          }
        }
      }
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleLinkBlur = () => {
    if (formData.projectLink) {
      fetchLinkPreview(formData.projectLink);
    }
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

    // Map frontend field names to backend field names
    const finalData = {
      _id: formData._id,
      title: formData.title,
      type: formData.type, // Already lowercase
      description: formData.description,
      imageUrl: imageUrl,
      techStack: formData.techStack,
      // Map to backend field names
      githubUrl: formData.projectLink, // Backend uses githubUrl
      demoUrl: formData.demoLink, // Backend uses demoUrl
      // Keep legacy fields for compatibility
      projectLink: formData.projectLink,
      demoLink: formData.demoLink,
      certificateInstitution: formData.certificateInstitution,
      certificateLink: formData.certificateLink,
    };

    if (formData.type === "certification") {
      if (!formData.certificateInstitution) {
        alert("Institusi sertifikat harus diisi");
        return;
      }
    }

    onSave(finalData);
  };

  const getLinkIcon = () => {
    if (formData.projectLink?.includes("github.com")) {
      return <FaGithub className="mr-2 text-gray-400" size={20} />;
    }
    return <FaLink className="mr-2 text-gray-400" size={20} />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark rounded-lg p-6 w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-color1 text-2xl font-bold mb-4">
          {project ? "Edit Project" : "Add New Project"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <OutlinedTextField
              type="text"
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
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
              <option value="project">Project</option>
              <option value="certification">Certification</option>
            </select>
          </div>

          {formData.type === "project" && (
            <>
              <div className="mb-4">
                <div className="flex items-center">
                  {getLinkIcon()}
                  <OutlinedTextField
                    type="url"
                    name="projectLink"
                    label="Project Link (Optional)"
                    value={formData.projectLink}
                    onChange={handleChange}
                    onBlur={handleLinkBlur}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                {linkPreview && (
                  <div className="mt-2 border border-gray-700 rounded-md overflow-hidden">
                    <div className="p-3 bg-gray-800">
                      <h3 className="text-sm font-medium text-gray-300 truncate">
                        {linkPreview.title}
                      </h3>
                      {linkPreview.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {linkPreview.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {formData.projectLink}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tech Stack Section */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Tech Stack</label>

                {/* Input for adding new tech stack */}
                <div className="mb-2">
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={handleTechStackInputChange}
                    onKeyPress={handleTechStackKeyPress}
                    placeholder="Add technology (press Enter)"
                    className="w-full bg-dark text-white border border-gray-700 rounded-md p-2 text-sm"
                  />
                </div>

                {/* Quick add buttons for common tech stacks */}
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-2">Quick Add:</p>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {techStackOptions.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => addTechStack(tech)}
                        disabled={formData.techStack.includes(tech)}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                          formData.techStack.includes(tech)
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-gray-700 text-gray-300 hover:bg-color1 hover:text-black cursor-pointer"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center">
                    <FaPlay className="mr-2 text-gray-400" size={20} />
                    <OutlinedTextField
                      type="url"
                      name="demoLink"
                      label="Demo Link (Optional)"
                      value={formData.demoLink}
                      onChange={handleChange}
                      placeholder="https://demo-example.com"
                    />
                  </div>
                </div>

                {/* Display selected tech stack */}
                {formData.techStack.length > 0 && (
                  <div className="border border-gray-700 rounded-md p-3 bg-gray-800">
                    <p className="text-xs text-gray-400 mb-2">
                      Selected Technologies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-color1 text-black text-xs rounded-md"
                        >
                          {iconDict[tech] && (
                            <img
                              src={iconDict[tech]}
                              alt={tech}
                              className="w-4 h-4 object-contain"
                            />
                          )}
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechStack(tech)}
                            className="ml-1 text-black hover:text-red-600 cursor-pointer"
                          >
                            <FaTimes size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {formData.type === "certification" && (
            <>
              <div className="mb-4">
                <OutlinedTextField
                  type="text"
                  name="certificateInstitution"
                  label="Certificate Institution"
                  value={formData.certificateInstitution}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center">
                  <FaLink className="mr-2 text-gray-400" size={20} />
                  <OutlinedTextField
                    type="url"
                    name="certificateLink"
                    label="Certificate Link (Optional)"
                    value={formData.certificateLink}
                    onChange={handleChange}
                    placeholder="https://example.com/certificate"
                  />
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <OutlinedTextField
              name="description"
              label="Description (Optional)"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
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
              className="text-gray-300 hover:text-white transition-colors hover:cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-color1 text-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity hover:cursor-pointer"
              disabled={isUploading || isLoadingPreview}
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
