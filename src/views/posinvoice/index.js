import { Grid2, TextField } from "@mui/material";
import React from "react";
import FilterFields from "./FilterFields";
import TaxFields from "./TaxFields";
import FilterFieldsMiddle from "./FilterFieldsMiddle";
import PaymentTable from "./PaymentTable";
import { AdaptableCard, DataTable } from "components/shared";
import { MODULE, newColumn } from "utils/hasPermission";

function PosInvoice() {
  const columns = [
    {
      Header: "sNo",
      id: "sNo",
      accessor: (row) => row,
    },
    {
      Header: " ",
      //   accessor: "title",
      id: "empty",
      Cell: (props) => {
        const row = props?.row?.original?.title;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: " ",
      //  accessor: "subTitle",
      id: "empty2",
      Cell: (props) => {
        const row = props.row.original.subTitle;
        return <div>{row || "-"}</div>;
      },
    },

    {
      Header: " ",
      // accessor: "subTitle",
      Cell: (props) => {
        const row = props.row.original.subTitle;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Return",
      accessor: "Return",
      Cell: (props) => {
        const row = props.row.original.subTitle;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Select Item",
      accessor: "item",
      Cell: (props) => {
        const row = props.row.original.subTitle;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: (props) => {
        const row = props.row.original.subTitle;
        return <div>{row || "-"}</div>;
      },
    },
  ];
  return (
    <div className="flex w-full gap-4">
      <div className="w-5/6 border border-gray-300 p-1">
        <div className="flex gap-4">
          <div className="w-1/3">
            <FilterFields />
          </div>

          <div className="w-1/3 ">
            <FilterFieldsMiddle />
          </div>

          <div className="w-1/3 border border-gray-300 ">
            <div className="flex">
              <div className="w-1/2 h-[30px] p-1 border border-gray-300  flex items-center">
                <span className="text-xs">Name: Cash Sales</span>
              </div>
              <div className="w-1/2 h-auto border p-1 border-gray-300  flex items-center">
                <span className="text-xs">
                  Last Visit : Dated - 12/17/2024, Bill Amount - 200 Item:
                  HOODIES
                </span>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 h-[30px] p-1 border border-gray-300  flex items-center">
                <span className="text-xs">Phone: 917067749006</span>
              </div>
              <div className="w-1/2 h-[30px] border p-1 border-gray-300 flex items-center">
                <span className="text-xs">Email: raghavriantraders@</span>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 h-[30px] p-1 border border-gray-300  flex items-center">
                <span className="text-xs">DOB :</span>
              </div>
              <div className="w-1/2 h-[30px] border p-1 border-gray-300 flex items-center">
                <span className="text-xs">Anniversary :</span>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 h-[30px] border p-1 border-gray-300  flex items-center">
                <span className="text-xs">Balance Point : 0</span>
              </div>
              <div className="w-1/2 h-[30px] border p-1 border-gray-300 flex items-center">
                <span className="text-xs">O/S : ₹0.00</span>
              </div>
            </div>

            <div className="w-full h-[30px] border p-1 border-gray-300  flex items-center">
              <span className="text-xs font-bold">
                Address : Madhya Pradesh
              </span>
            </div>
          </div>
        </div>
        <div>
          <AdaptableCard className="h-full" bodyClass="h-full"></AdaptableCard>
        </div>
      </div>

      <div className="w-2/6 border border-gray-300 p-1">
        <div className="flex gap-2 flex-col">
          <TaxFields />

          <PaymentTable />
        </div>
      </div>
    </div>
  );
}

export default PosInvoice;
