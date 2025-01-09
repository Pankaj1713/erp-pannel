import React from "react";
import Header from "./header";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { Input, Select, DatePicker } from "components/ui";
// import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import SplitSelect from "../ui-components/common/SplitSelect";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import NumberFormat from "react-number-format";

const PurchaseReturn = () => {
  const gstTypeLabels = [
    {
      value: "taxInvoice",
      label: "TaxInvoice",
    },
    {
      value: "import",
      label: "Import",
    },
    {
      value: "reverseCharges",
      label: "ReverseCharges",
    },
    {
      value: "billOfSupply_Compounding",
      label: "BillOfSupply_Compounding",
    },
  ];

  const cashCreditLabels = [
    {
      value: "cash",
      label: "Cash",
    },
    {
      value: "credit",
      label: "Credit",
    },
  ];

  const loadStaysOption = (inputValue, resolve) => {
    getApi(APIS.GET_CUSTOMERS, { pattern: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  };

  const loadStays = debounce(loadStaysOption, 300);

  const NumberFormatInput = ({ onValueChange, ...rest }) => {
    return (
      <NumberFormat
        customInput={Input}
        type='text'
        onValueChange={onValueChange}
        autoComplete='off'
        {...rest}
      />
    );
  };

  return (
    <div>
      <Header />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <div className='flex flex-col'>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              GST Type
            </label>
            <Select
              isMulti={false}
              defaultOptions
              cacheOptions
              placeholder='Select GST Type'
              options={gstTypeLabels}
              loadOptions={loadStays}
              // componentAs={AsyncSelect}
              className='font-semibold'
              // onChange={(event) => setUser(event)}
              getOptionLabel={(v) => `${v?.label}`}
              getOptionValue={(v) => v?.value}
              id='gstType'
            />
          </div>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Cash/Credit
            </label>
            <Select
              isMulti={false}
              defaultOptions
              cacheOptions
              placeholder='Select Cash/Credit'
              options={cashCreditLabels}
              loadOptions={loadStays}
              // componentAs={AsyncSelect}
              className='font-semibold'
              // onChange={(event) => setUser(event)}
              getOptionLabel={(v) => `${v?.label}`}
              getOptionValue={(v) => v?.value}
              id='cashCredit'
            />
          </div>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Branch <span className='text-red-500'>*</span>
            </label>
            <div className='flex items-center justify-between'>
              <SplitSelect />
              <IconButton
                aria-label='delete'
                sx={{
                  backgroundColor: "#1976d2",
                  width: "25px",
                  height: "25px",
                  color: "#fff",
                  borderRadius: "0",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
          </div>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Warehouse <span className='text-red-500'>*</span>
            </label>
            <div className='flex items-center justify-between'>
              <SplitSelect />
              <IconButton
                aria-label='delete'
                sx={{
                  backgroundColor: "#1976d2",
                  width: "25px",
                  height: "25px",
                  color: "#fff",
                  borderRadius: "0",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </div>
          </div>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Supplier <span className='text-red-500'>*</span>
            </label>
            <div className='flex items-center justify-between'>
              <SplitSelect />
              <IconButton
                aria-label='delete'
                sx={{
                  backgroundColor: "#1976d2",
                  width: "25px",
                  height: "25px",
                  color: "#fff",
                  borderRadius: "0",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label='delete'
                sx={{
                  backgroundColor: "red",
                  width: "25px",
                  height: "25px",
                  color: "#fff",
                  borderRadius: "0",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
              >
                <BarChartIcon />
              </IconButton>
            </div>
          </div>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Email
            </label>
            <Input />
          </div>
        </div>
        <div className='flex flex-col'>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Date
            </label>
            <DatePicker
              className='mb-4'
              placeholder='Select a date'
              // defaultValue={date}
              inputSize='sm'
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Purchase Return No
            </label>
            <NumberFormatInput
              // form={form}
              // field={field}
              // customInput={NumberInput}
              placeholder='Phone Number'
              // onValueChange={(e) => {
              //   form.setFieldValue(field.name, e.value);
              // }}
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Ref No
            </label>
            <Input />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Ref.Date
            </label>
            <DatePicker
              className='mb-4'
              placeholder='Select a date'
              // defaultValue={date}
              inputSize='sm'
            />
          </div>
          <div className='mb-4'>Agent </div>
          <div className='mb-4'>Tax</div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Against Bill
            </label>
            <Input />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Against Bill Date
            </label>
            <DatePicker
              className='mb-4'
              placeholder='Select a date'
              // defaultValue={date}
              inputSize='sm'
            />
          </div>
        </div>

        <div className='flex flex-col'>
         section 3
        </div>
      </div>
    </div>
  );
};

export default PurchaseReturn;
