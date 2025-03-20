import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AirCalling Landing Page Design",
      category: "Web Design",
      image: "https://placehold.co/600x400?text=AirCalling+Landing+Page+Design",
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const openModal = (project = null) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const handleSave = (project) => {
    if (currentProject) {
      // Edit existing project
      setProjects(projects.map(proj => 
        proj.id === currentProject.id ? {...project, id: currentProject.id} : proj
      ));
    } else {
      // Add new project
      const newProject = {
        ...project,
        id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1
      };
      setProjects([...projects, newProject]);
    }
    closeModal();
  };

  const handleDelete = (projectToDelete) => {
    setProjects(projects.filter(proj => proj.id !== projectToDelete.id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-color1 text-2xl md:text-3xl font-bold">Projects</h1>
        <button 
          onClick={() => openModal()}
          className="bg-color1 text-black text-sm md:text-xl px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Add Project
        </button>
      </div>

      <div className="bg-[#1E1E1E] rounded-lg scrollbar p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="p-4">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="p-4">{project.title}</td>
                <td className="p-4">{project.category}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => openModal(project)}
                      className="text-gray-400 hover:text-color1 transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(project)}
                      className="text-red-500 hover:opacity-80 transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProjectModal 
          project={currentProject} 
          onSave={handleSave} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

const ProjectModal = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState(project || {
    title: '',
    category: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-color1 text-2xl font-bold mb-4">
          {project ? 'Edit Project' : 'Add New Project'}
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
            <label className="block text-gray-300 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              required
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
              />
              <label 
                htmlFor="imageUpload" 
                className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center cursor-pointer"
              >
                <Image className="mr-2" size={20} />
                Upload Image
              </label>
              {formData.image && (
                <img 
                  src={formData.image} 
                  alt="Project Preview" 
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
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-color1 text-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectsPage;