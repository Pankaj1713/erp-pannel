import React from "react";
import { TaxFieldsData } from "./constants";
import { TextField } from "@mui/material";

function TaxFields() {
  return (
    <div className="flex flex-col gap-1">
      {TaxFieldsData?.map((field, index) => (
        <div className="flex gap-4 w-full items-center" key={index}>
          <label
            className={`w-32 flex-shrink-0 text-left text-xs ${
              field.fontWeight ? "font-bold" : ""
            }`}
          >
            {field.label}
          </label>
          <TextField
            type="text"
            size="small"
            value={field.value}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: "0.75rem",
                height: "30px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.75rem",
              },
              "& input": {
                textAlign: "right",
              },
            }}
            fullWidth
          />
        </div>
      ))}
    </div>
  );
}

export default TaxFields;
