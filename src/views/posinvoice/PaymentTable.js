import React from "react";
import { TableRows } from "./constants";

function PaymentTable() {
  return (
    <table className="table-auto w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border  py-2 text-left">Description</th>
          <th className="border  py-2 text-right">Net</th>
        </tr>
      </thead>
      <tbody>
        {TableRows?.map((row, index) => (
          <tr
            key={index}
            className={(index + 1) % 2 === 0 ? "bg-gray-100" : ""}
          >
            <td className="border py-2">{row.col1}</td>
            <td className="border py-2 text-right">{row.col2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PaymentTable;
