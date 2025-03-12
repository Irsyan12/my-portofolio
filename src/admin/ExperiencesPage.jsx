/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([
    {
      period: "Jul 2024 - Dec 2024",
      role: "Part of Human Resource Department",
      company: "Himpunan Mahasiswa Teknik Komputer",
      description: "Responsible for managing the organization's human resources",
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);

  const openModal = (experience = null) => {
    setCurrentExperience(experience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExperience(null);
  };

  const handleSave = (experience) => {
    if (currentExperience) {
      // Edit existing experience
      setExperiences(experiences.map(exp => 
        exp === currentExperience ? experience : exp
      ));
    } else {
      // Add new experience
      setExperiences([...experiences, experience]);
    }
    closeModal();
  };

  const handleDelete = (experienceToDelete) => {
    setExperiences(experiences.filter(exp => exp !== experienceToDelete));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-color1 text-3xl font-bold">Experiences</h1>
        <button 
          onClick={() => openModal()}
          className="bg-color1 text-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Add Experience
        </button>
      </div>

      <div className="bg-[#1E1E1E] rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="p-4 text-left">Period</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((experience, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="p-4">{experience.period}</td>
                <td className="p-4">{experience.role}</td>
                <td className="p-4">{experience.company}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => openModal(experience)}
                      className="text-gray-400 hover:text-color1 transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(experience)}
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
        <ExperienceModal 
          experience={currentExperience} 
          onSave={handleSave} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const ExperienceModal = ({ experience, onSave, onClose }) => {
  const [formData, setFormData] = useState(experience || {
    period: '',
    role: '',
    company: '',
    description: ''
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-color1 text-2xl font-bold mb-4">
          {experience ? 'Edit Experience' : 'Add New Experience'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Period</label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
              rows="4"
              required
            />
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

export default ExperiencesPage;