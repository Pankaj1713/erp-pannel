import React from "react";
import { dynamicFields } from "./constants";
import { TextField } from "@mui/material";

function FilterFields() {
  return (
    <div className="flex flex-col gap-1">
      {dynamicFields?.map((field, index) => (
        <div className="flex gap-4 w-full items-center" key={index}>
          <label className="w-32 flex-shrink-0 text-xs text-left">
            {field.label}
          </label>
          <TextField
            type={field.type}
            select={field.type === "select"}
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

export default FilterFields;
