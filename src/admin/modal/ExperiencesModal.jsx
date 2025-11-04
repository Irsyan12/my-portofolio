import React, { useState, useEffect } from "react";
import OutlinedTextField from "../../components/OutlinedTextField";

const ExperienceModal = ({ experience, onSave, onClose }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, index) => currentYear - index);
  const months = [
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
  ];

  const [formData, setFormData] = useState({
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    isCurrentRole: false,
    title: "",
    company: "",
    description: "",
  });

  useEffect(() => {
    if (experience) {
      // Parse period string if exists (e.g., "Jan 2023 - Present")
      let startMonth = "";
      let startYear = "";
      let endMonth = "";
      let endYear = "";

      if (experience.period) {
        const parts = experience.period.split(" - ");
        if (parts[0]) {
          const [m, y] = parts[0].trim().split(" ");
          startMonth = m || "";
          startYear = y || "";
        }
        if (parts[1] && parts[1] !== "Present") {
          const [m, y] = parts[1].trim().split(" ");
          endMonth = m || "";
          endYear = y || "";
        }
      }

      setFormData({
        startMonth,
        startYear,
        endMonth,
        endYear,
        isCurrentRole: experience.isCurrentRole || false,
        title: experience.title || "",
        company: experience.company || "",
        description: experience.description || "",
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create period string
    const period = `${formData.startMonth} ${formData.startYear} - ${
      formData.isCurrentRole
        ? "Present"
        : `${formData.endMonth} ${formData.endYear}`
    }`;

    const dataToSave = {
      title: formData.title,
      company: formData.company,
      description: formData.description,
      period: period,
      isCurrentRole: formData.isCurrentRole,
    };

    if (experience?._id) {
      dataToSave._id = experience._id;
    }

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] mx-10 md:mx-auto rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-color1 text-2xl font-bold mb-4">
          {experience ? "Edit Experience" : "Add Experience"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <OutlinedTextField
              type="text"
              name="title"
              label="Job Title / Role"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <OutlinedTextField
              type="text"
              name="company"
              label="Company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Start Period</label>
            <div className="flex space-x-2">
              <select
                name="startMonth"
                value={formData.startMonth}
                onChange={handleChange}
                className="w-full bg-dark text-white border border-gray-700 rounded-md p-2.5 focus:ring-color1 focus:border-color1"
                required
              >
                <option value="">Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                className="w-full bg-dark text-white border border-gray-700 rounded-md p-2.5 focus:ring-color1 focus:border-color1"
                required
              >
                <option value="">Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center text-gray-300">
              <input
                type="checkbox"
                name="isCurrentRole"
                checked={formData.isCurrentRole}
                onChange={handleChange}
                className="mr-2 w-4 h-4"
              />
              Currently working here
            </label>
          </div>

          {!formData.isCurrentRole && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">End Period</label>
              <div className="flex space-x-2">
                <select
                  name="endMonth"
                  value={formData.endMonth}
                  onChange={handleChange}
                  className="w-full bg-dark text-white border border-gray-700 rounded-md p-2.5 focus:ring-color1 focus:border-color1"
                  required={!formData.isCurrentRole}
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  name="endYear"
                  value={formData.endYear}
                  onChange={handleChange}
                  className="w-full bg-dark text-white border border-gray-700 rounded-md p-2.5 focus:ring-color1 focus:border-color1"
                  required={!formData.isCurrentRole}
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="mb-4">
            <OutlinedTextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              multiline
              placeholder="Describe your role and responsibilities..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 cursor-pointer hover:text-white transition-colors px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-color1 text-black px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
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
