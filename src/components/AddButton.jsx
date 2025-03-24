import React from "react";
import { FaPlus } from "react-icons/fa";
import PropTypes from "prop-types";

const AddButton = ({ onClick, label = "Add" }) => {
  return (
    <button
      onClick={onClick}
      className="bg-color1 text-black text-sm md:text-md px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center"
    >
      <FaPlus className="mr-2" size={15} />
      {label}
    </button>
  );
};

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired, // Fungsi yang akan dipanggil saat tombol diklik
  label: PropTypes.string, // Label tombol (opsional, default: "Add")
};

export default AddButton;
