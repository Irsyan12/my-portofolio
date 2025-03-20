import React, { useState, useEffect } from "react";

const ExperienceModal = ({ experience, onSave, onClose }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
  
  const [formData, setFormData] = useState({
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    role: "",
    company: "",
    description: "",
  });

  useEffect(() => {
    if (experience) {
      // If editing existing experience
      if (experience.period) {
        // Parse period string to get startMonth, startYear, endMonth, endYear
        const periodParts = experience.period.split(" - ");
        const startParts = periodParts[0].split(" ");
        const endParts = periodParts[1].split(" ");
        
        setFormData({
          ...experience,
          startMonth: startParts[0],
          startYear: startParts[1],
          endMonth: endParts[0],
          endYear: endParts[1]
        });
      } else {
        // If experience already has separate fields
        setFormData(experience);
      }
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine start and end month/year into a period string
    const period = `${formData.startMonth} ${formData.startYear} - ${formData.endMonth} ${formData.endYear}`;
    
    // Create data object to save without the fields that shouldn't go to Firestore
    const dataToSave = {
      period,
      role: formData.role,
      company: formData.company,
      description: formData.description,
    };
    
    // Only include id if editing an existing experience
    if (experience?.id) {
      dataToSave.id = experience.id;
    }
    
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] mx-10 md:mx-auto rounded-lg p-6 w-full max-w-md">
        <h2 className="text-color1 text-2xl font-bold mb-4">
          {experience ? "Edit Experience" : "Add New Experience"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Period (Month & Year)
            </label>
            <div className="flex space-x-2">
              <select
                name="startMonth"
                value={formData.startMonth}
                onChange={handleChange}
                className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
                required
              >
                <option value="">Start Month</option>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
                required
              >
                <option value="">Start Year</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              End Period (Month & Year)
            </label>
            <div className="flex space-x-2">
              <select
                name="endMonth"
                value={formData.endMonth}
                onChange={handleChange}
                className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
                required
              >
                <option value="">End Month</option>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                className="w-full bg-dark text-white border border-gray-700 rounded-md p-2"
                required
              >
                <option value="">End Year</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
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

export default ExperienceModal;