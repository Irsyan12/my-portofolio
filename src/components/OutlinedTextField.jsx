/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from "react";
import TextField from "@mui/material/TextField";

const OutlinedTextField = ({
  type = "text",
  id,
  label,
  value,
  onChange,
  variant = "outlined",
  color = "white",
  borderColor = "white",
  focusedColor = "blue",
  ...props
}) => {
  return (
    <TextField
      type={type}
      id={id}
      label={label}
      variant={variant}
      value={value}
      onChange={onChange}
      fullWidth
      sx={{
        "& label": { color: "white" },
        "& input": { color: "white" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "white" },
          "&:hover fieldset": { borderColor: "gray" },
          "&.Mui-focused fieldset": { borderColor: "white" },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: "white" },
      }}
      {...props}
    />
  );
};

export default OutlinedTextField;
