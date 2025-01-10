import React from "react";
import { dynamicFieldsMiddle } from "./constants";
import { TextField } from "@mui/material";

function FilterFieldsMiddle() {
  return (
    <div className="flex flex-col gap-1">
      {dynamicFieldsMiddle?.map((field, index) => (
        <div className="flex gap-4 w-full items-center" key={index}>
          <label className="w-32 flex-shrink-0 text-xs text-left">
            {field.label}
          </label>
          <TextField
            type={field.type}
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: "0.75rem",
                height: "30px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.75rem",
              },
            }}
            fullWidth
          />
        </div>
      ))}
    </div>
  );
}

export default FilterFieldsMiddle;
