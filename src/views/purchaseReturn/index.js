import React from "react";
import Header from "./header";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { Input, Select, DatePicker } from "components/ui";
// import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import SplitSelect from "../ui-components/common/SplitSelect";
import NumberFormat from "react-number-format";
import CommonAccordion from "../ui-components/common/CommonAccordion";
import LogisticsForm from "./LogisticsForm"; // Adjust the path as necessary

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

  const DNOrCNReturnReasonOptions = [
    { label: "Sales/Return", value: "salesReturn" },
    { label: "Post Sale Discount", value: "postSaleDiscount" },
    { label: "Deficiency In Services", value: "deficiencyInServices" },
    { label: "Correction In Invoice", value: "correctionInInvoice" },
    { label: "Change In POS", value: "changeInPOS" },
    {
      label: "Finalization Of Provisional Assessment",
      value: "finalizationOfProvisionalAssessment",
    },
    { label: "Others", value: "others" },
    { label: "Expired Stock", value: "expiredStock" },
    { label: "Breakage Damaged", value: "breakageDamaged" },
  ];

  const branchOption = [
    { id: "0002", name: "Bhopal Store" },
    { id: "0001", name: "Sironj" },
    { id: "0003", name: "Vidisha Store" },
  ];

  const warehouseOption = [
    { id: "0002", name: "Bhopal" },
    { id: "0001", name: "Sironj" },
    { id: "0003", name: "Vidisha" },
  ];

  const supplierOption = [
    { id: "0002", name: "A.K. BEAS HOSIERY" },
    { id: "0001", name: "3 Monks Clothing" },
    { id: "0003", name: "CREATIVEFOLD" },
  ];

  const agentOption = [{ id: "0002", name: "Default" }];

  const placeOption = [
    { id: "0002", name: "Delhi" },
    { id: "0001", name: "Gujarat" },
    { id: "0003", name: "Punjab" },
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
          <div className='mb-4'>
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
          <div className='mb-4'>
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
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Branch <span className='text-red-500'>*</span>
            </label>
            <SplitSelect options={branchOption} />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Warehouse <span className='text-red-500'>*</span>
            </label>
            <SplitSelect options={warehouseOption} />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Pull From
            </label>
            <SplitSelect />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Supplier <span className='text-red-500'>*</span>
            </label>
            <div>
              <SplitSelect options={supplierOption} BarChartBtn={true} />
            </div>
          </div>
          <div className='mb-4'>
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
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Date
            </label>
            <DatePicker
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
              Agent
            </label>
            <SplitSelect options={agentOption} />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='userSelect'
            >
              Tax
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
          <div className='mb-4'>
            <CommonAccordion
              title={"Billing From"}
              content={
                <>
                  <Input textArea />
                  <div>
                    <label
                      className='block text-gray-700 font-semibold mb-2'
                      htmlFor='dateRange'
                    >
                      GST
                    </label>
                    <Input />
                  </div>
                  <div>
                    <label
                      className='block text-gray-700 font-semibold mb-2'
                      htmlFor='dateRange'
                    >
                      Contact Person
                    </label>
                    <Input />
                  </div>
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 font-semibold mb-2'
                      htmlFor='dateRange'
                    >
                      Place of Supply
                    </label>
                    <SplitSelect options={placeOption} />
                  </div>
                  <div>
                    <label
                      className='block text-gray-700 font-semibold mb-2'
                      htmlFor='dateRange'
                    >
                      eCommerce Inv No
                    </label>
                    <Input />
                  </div>
                </>
              }
            />
          </div>
          <div className='mb-4'>
            <CommonAccordion
              title={"Shipping From"}
              content={
                <>
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 font-semibold mb-2'
                      htmlFor='dateRange'
                    >
                      Ship To
                    </label>
                    <SplitSelect options={agentOption} />
                  </div>
                  <Input textArea />
                </>
              }
            />
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Payment Terms
            </label>
            <SplitSelect options={agentOption} />
          </div>
          <div>
            <label
              className='block text-gray-700 font-semibold mb-2'
              htmlFor='dateRange'
            >
              Due Date
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
              htmlFor=' '
            >
              DN/CN Return Reason
            </label>
            <Select
              size='sm'
              isSearchable={false}
              // value={pageSizeOption.filter(
              //   (option) => option.value === pageSize
              // )}
              options={DNOrCNReturnReasonOptions}
              // onChange={(option) => handleSelectChange(option.value)}
            />
          </div>
        </div>
      </div>
      <CommonAccordion
        title='Logistics'
        defaultExpanded={true}
        content={<LogisticsForm />}
      />
    </div>
  );
};

export default PurchaseReturn;
