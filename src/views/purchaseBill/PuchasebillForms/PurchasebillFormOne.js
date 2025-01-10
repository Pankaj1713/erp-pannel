
import React from "react";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconButton from '@mui/material/IconButton';
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from '@mui/icons-material/BarChart';
import { DatePicker } from "components/ui";
import BillingForm from "./BillingForm";
import ShippingForm from "./ShippingForm";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SplitSelect from "views/ui-components/common/SplitSelect";
const PurchasebillFormOne = () => {
const [billingOpen,setBillingOpen]=useState(false)
const [shippingOpen,setShippingOpen]=useState(false)
    const initialValues = {
        gstType: "TaxInvoice",
        cashCredit: "Credit",
        branch: "",
        warehouse: "",
        supplier: "",
        email: "",
        date: "",
        invoiceNo: "",
        supplierInvNo: "",
        supplierInvDate: "",
        agent: "",
        tax: "Exclusive",
        paymentTerms: "",
        dueDate: "",
    };
    const gstTypes = [
        { value: "TaxInvoice", label: "TaxInvoice" },
        { value: "Import", label: "Import" },
        { value: "ReverseCharges", label: "ReverseCharges" },
        { value: "BillOfSupply_Compounding", label: "BillOfSupply_Compounding" },
        { value: "BillOfSupply_UnRegistered", label: "BillOfSupply_UnRegistered" },
        { value: "BillOfSupply_Exempted", label: "BillOfSupply_Exempted" },
        { value: "BillOfSupply_NilRated", label: "BillOfSupply_NilRated" },
        { value: "BillOfSupply_NonGST", label: "BillOfSupply_NonGST" },
        { value: "BranchTransfer", label: "BranchTransfer" },
    ];
    const credit = [
        { value: "Cash", label: "Cash" },
        { value: "Credit", label: "Credit" },
    ]

    // const onSubmit = (values) => {
    //     console.log("Form data", values);
    // };
    const validationSchema = Yup.object({
        branch: Yup.string().required("Branch is required"),
        warehouse: Yup.string().required("Warehouse is required"),
        supplier: Yup.string().required("Supplier is required"),
        date: Yup.date().required("Date is required"),
        supplierInvNo: Yup.string().required("Supplier Invoice No is required"),
        supplierInvDate: Yup.date().required("Supplier Invoice Date is required"),
    });
    // billing form open
    const handleBillingClick=()=>{
setBillingOpen(!billingOpen)
    }
const handleShippingForm=()=>{
    setShippingOpen(!shippingOpen)
}
    return (
        <div>

            <div className="mt-50">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                // onSubmit={onSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <div className="flex flex-row items-center gap-10  px-15 ">
                                {/* first column */}
                                <div className="flex flex-col gap-6 p-4 ">
                                    <div className="flex gap-5">
                                        <label htmlFor="gstType" className="mb-2 text-sm font-medium text-gray-700">GST Type</label>
                                        <Field
                                            as="select"
                                            name="gstType"
                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        >
                                            {gstTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="cashCredit" className="mb-2 text-sm font-medium text-gray-700">Cash/Credit</label>
                                        <Field
                                            as="select"
                                            name="cashCredit"
                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        >
                                            {credit.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex flex gap-5 flex-1">
                                            <label htmlFor="branch" className="mb-2 text-sm font-medium text-gray-700">Branch</label>
                                            <span className="text-red-500">*</span>
                                            <div className="flex flex-col">
                                                <Field
                                                name="branch"
                                                placeholder="Select..."
                                                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            {/* <SplitSelect/> */}
                                                <ErrorMessage name="branch" component="div" className="mt-1 text-sm text-red-600" /></div>

                                        </div>

                                        <IconButton
                                            aria-label="edit"
                                            sx={{
                                                backgroundColor: '#164e7f',
                                                color: '#FFFFFF',
                                                width: '40px', // Set width for square shape
                                                height: '40px', // Set height to match width
                                                borderRadius: '0', // Square corners
                                                '&:hover': {
                                                    backgroundColor: '#164e7f', // Darker shade for hover effect
                                                },
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex fgap-5">
                                            <label htmlFor="warehouse" className="mb-2 text-sm font-medium text-gray-700">Warehouse</label>
                                            
                                            <span className="text-red-500">*</span><div className="flex flex-col">  
                                                <Field
                                                name="warehouse"
                                                placeholder="Select..."
                                                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            {/* <SplitSelect/> */}
                                                <ErrorMessage name="warehouse" component="div" className="mt-1 text-sm text-red-600" /></div>
                                        </div>
                                        <IconButton
                                            aria-label="edit"
                                            sx={{
                                                backgroundColor: '#164e7f',
                                                color: '#FFFFFF',
                                                width: '40px', // Set width for square shape
                                                height: '40px', // Set height to match width
                                                borderRadius: '0', // Square corners
                                                '&:hover': {
                                                    backgroundColor: '#164e7f', // Darker shade for hover effect
                                                },
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-5">
                                            <label htmlFor="supplier" className="mb-2 text-sm font-medium text-gray-700 leading-tight">Supplier</label>
                                            <span className="text-red-500">*</span>
                                            <div className="flex flex-col">
                                                <Field
                                                    name="supplier"
                                                    placeholder="Select..."
                                                    className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                {/* <SplitSelect/> */}
                                                <ErrorMessage name="supplier" component="div" className="mt-1 text-sm text-red-600" />
                                            </div>
                                        </div>
                                        <IconButton
                                            aria-label="edit"
                                            sx={{
                                                backgroundColor: '#164e7f',
                                                color: '#FFFFFF',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '0',
                                                '&:hover': {
                                                    backgroundColor: '#164e7f',
                                                },
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="edit"
                                            sx={{
                                                backgroundColor: '#8B0000',
                                                color: '#FFFFFF',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '0',
                                                '&:hover': {
                                                    backgroundColor: '#164e7f',
                                                },
                                            }}
                                        >
                                            <BarChartIcon />
                                        </IconButton>
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">Email</label>
                                        <Field
                                            name="email"
                                            type="email"
                                            placeholder="Enter email"
                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                {/* second column */}
                                <div className="flex flex-col gap-6 p-4 ">
                                    <div className="flex gap-5">
                                        <label htmlFor="date" className="mb-2 text-sm font-medium text-gray-700">Date</label>
                                        <span className="text-red-500">*</span>
                                        <div className="flex flex-col">
                                            <DatePicker placeholder="Select a date" className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                                            <ErrorMessage name="date" component="div" className="mt-1 text-sm text-red-600" />
                                        </div>
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="invoiceNo" className="mb-2 text-sm font-medium text-gray-700">Invoice No</label>
                                        <Field
                                            name="invoiceNo"
                                            placeholder="Enter Invoice No"
                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="supplierInvNo" className="mb-2 text-sm font-medium text-gray-700">Supplier Inv No</label>
                                        <span className="text-red-500">*</span>
                                        <div className="flex flex-col">
                                            <Field
                                                name="supplierInvNo"
                                                placeholder="Enter Supplier Inv No"
                                                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <ErrorMessage name="supplierInvNo" component="div" className="mt-1 text-sm text-red-600" />
                                        </div>
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="supplierInvDate" className="mb-2 text-sm font-medium text-gray-700">Supplier Inv Date</label>
                                        <div className="flex flex-col">
                                            <DatePicker placeholder="Select a date" className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
                                            <ErrorMessage name="supplierInvDate" component="div" className="mt-1 text-sm text-red-600" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label htmlFor="agent" className="w-32 text-sm font-medium text-gray-700">Agent</label>
                                        <div className="flex flex-1 items-center gap-2">
                                            <Field
                                                name="agent"
                                                placeholder="Select..."
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <IconButton
                                                aria-label="edit"
                                                sx={{
                                                    backgroundColor: '#164e7f',
                                                    color: '#FFFFFF',
                                                    width: '40px', // Set width for square shape
                                                    height: '40px', // Set height to match width
                                                    borderRadius: '0', // Square corners
                                                    '&:hover': {
                                                        backgroundColor: '#164e7f', // Darker shade for hover effect
                                                    },
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </div>
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="tax" className="mb-2 text-sm font-medium text-gray-700">Tax</label>
                                        <Field
                                            as="select"
                                            name="tax"
                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Exclusive">Exclusive</option>
                                            <option value="Inclusive">Inclusive</option>
                                        </Field>
                                    </div>
                                </div>
                                {/* third column */}
                                <div className="flex flex-col gap-6 p-4 ">
                                    <div className="flex gap-5">
                                        <label htmlFor="billingForm" className="mb-2 text-sm font-medium text-gray-700 ">Billing Form</label>
                                        <IconButton
                                                aria-label="edit"
                                                sx={{
                                                    backgroundColor: '#164e7f',
                                                    color: '#FFFFFF',
                                                    width: '20px', 
                                                    height: '20px', 
                                                    borderRadius: '50%',
                                                    '&:hover': {
                                                        backgroundColor: '#164e7f', // Darker shade for hover effect
                                                    },
                                                }}
                                                onClick={handleBillingClick}
                                            >
                                                <ArrowDownwardIcon />
                                            </IconButton>
                                        {/* <Field
                                            name="billingForm"
                                            placeholder="Select..."
                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        /> */}
                                        {billingOpen && <BillingForm/>}
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="shippingBill" className="mb-2 text-sm font-medium text-gray-700">Shipping Bill</label>
                                        <IconButton
                                                aria-label="edit"
                                                sx={{
                                                    backgroundColor: '#164e7f',
                                                    color: '#FFFFFF',
                                                    width: '20px', 
                                                    height: '20px', 
                                                    borderRadius: '50%',
                                                    '&:hover': {
                                                        backgroundColor: '#164e7f', // Darker shade for hover effect
                                                    },
                                                }}
                                                onClick={handleShippingForm}
                                            >
                                                <ArrowDownwardIcon />
                                            </IconButton>
                                      {shippingOpen && <ShippingForm/>}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label htmlFor="paymentTerms" className="w-32 text-sm font-medium text-gray-700">Payment Terms</label>
                                        <div className="flex items-center flex-1 gap-2">
                                            <Field
                                                name="paymentTerms"
                                                placeholder="Select..."
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                            <IconButton
                                                aria-label="edit"
                                                sx={{
                                                    backgroundColor: '#164e7f',
                                                    color: '#FFFFFF',
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '0',
                                                    '&:hover': {
                                                        backgroundColor: '#164e7f',
                                                    },
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </div>
                                    </div>

                                    <div className="flex gap-5">
                                        <label htmlFor="dueDate" className="mb-2 text-sm font-medium text-gray-700">Due Date</label>
                                        <DatePicker
                                            placeholder="Select a date"
                                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>







                        </Form>
                    )}
                </Formik></div>

        </div>


    );
};

export default PurchasebillFormOne;