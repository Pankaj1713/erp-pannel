import React from 'react'
import SplitSelect from '../ui-components/common/SplitSelect';
import { Input, Select, DatePicker, Button } from 'components/ui';
import NumberFormat from 'react-number-format';

const LogisticsForm = () => {

    const shippingModeOptions = [
      { value: 'ByAir', label: 'ByAir' },
      { value: 'BySea', label: 'BySea' },
      { value: 'Post', label: 'Post' },
      { value: 'Road', label: 'Road' },
      { value: 'Train', label: 'Train' },
    ];

    const chargeTypeOptions = [
      { value: 'Paid', label: 'Paid' },
      { value: 'ToBePaid', label: 'ToBePaid' },
      { value: 'SelfVehicle', label: 'SelfVehicle' },
      { value: 'PaidByParty', label: 'PaidByParty' },
      { value: 'ToBePaid_BillToParty', label: 'ToBePaid_BillToParty' },
      { value: 'NotApplicable', label: 'NotApplicable' },
    ];

    const branchOption = [
      { id: "0002", name: "Bhopal Store" },
      { id: "0001", name: "Sironj" },
      { id: "0003", name: "Vidisha Store" },
    ];

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
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex flex-col'>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='dispatchFrom'
          >
            Dispatch From
          </label>
            <SplitSelect options={branchOption} />
            
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='destination'
          >
            Destination
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='shippingMode'
          >
            Shipping Mode
          </label>
          <Select
            isMulti={false}
            defaultOptions
            cacheOptions
            placeholder='Select Shipping Mode'
            options={shippingModeOptions}
            // loadOptions={loadStays}
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
            htmlFor='shippingCompanyAddressPhoneDetail'
          >
            Shipping Company Address/Phone Detail
          </label>
          <Input textArea />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='shippingTrackingNo'
          >
            Shipping Tracking No
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='shippingDate'
          >
            Shipping Date
          </label>
          <DatePicker
            placeholder='Select a shipping date'
            // defaultValue={date}
            inputSize='sm'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='shippingCharges'
          >
            Shipping Charges
          </label>
          <NumberFormatInput
          // form={form}
          // field={field}
          // customInput={NumberInput}
          // placeholder='Shipping Charges'
          // onValueChange={(e) => {
          //   form.setFieldValue(field.name, e.value);
          // }}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='vehicleVesselNo'
          >
            Vehicle/Vessel No
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='chargeType'
          >
            Charge Type
          </label>
          <Select
            isMulti={false}
            defaultOptions
            cacheOptions
            placeholder='Select Charge Type'
            options={chargeTypeOptions}
            // loadOptions={loadStays}
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
            htmlFor='documentThrough'
          >
            Document Through
          </label>
          <Input />
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='portOfLanding'
          >
            Port of Landing
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='portOfDischarge'
          >
            Port of Discharge
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='noOfPackts'
          >
            No of Packts
          </label>
          <NumberFormatInput
            // form={form}
            // field={field}
            // customInput={NumberInput}
            // placeholder='Shipping Charges'
            // onValueChange={(e) => {
            //   form.setFieldValue(field.name, e.value);
            // }}
            defaultValue={0}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='weight'
          >
            Weight
          </label>
          <NumberFormatInput
            // form={form}
            // field={field}
            // customInput={NumberInput}
            // placeholder='Shipping Charges'
            // onValueChange={(e) => {
            //   form.setFieldValue(field.name, e.value);
            // }}
            defaultValue={0}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='distance'
          >
            Distance
          </label>
          <NumberFormatInput
            // form={form}
            // field={field}
            // customInput={NumberInput}
            // placeholder='Shipping Charges'
            // onValueChange={(e) => {
            //   form.setFieldValue(field.name, e.value);
            // }}
            defaultValue={0}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='eWayInvoiceNo'
          >
            eWay Invoice No
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='eWayInvoiceDate'
          >
            eWay Invoice Date
          </label>
          <DatePicker
            placeholder='Select a eWay Invoice Date'
            // defaultValue={date}
            inputSize='sm'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='eWayCancelDate'
          >
            eWay Cancel Date
          </label>
          <DatePicker
            placeholder='Select a eWay Cancel Date'
            // defaultValue={date}
            inputSize='sm'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='inrNo'
          >
            IRN No
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='qrCode'
          >
            QR Code
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='inrCancelDate'
          >
            IRN Cancel Date
          </label>
          <DatePicker
            placeholder='Select a IRN Cancel Date'
            // defaultValue={date}
            inputSize='sm'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='inrCancelReason'
          >
            IRN Cancel Reason
          </label>
          <Input />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='acknowledgementNo'
          >
            Acknowledgement No
          </label>
          <NumberFormatInput
          // form={form}
          // field={field}
          // customInput={NumberInput}
          // placeholder='Shipping Charges'
          // onValueChange={(e) => {
          //   form.setFieldValue(field.name, e.value);
          // }}
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 font-semibold mb-2'
            htmlFor='acknowledgementDate'
          >
            Acknowledgement Date
          </label>
          <DatePicker
            placeholder='Select a Acknowledgement Date'
            // defaultValue={date}
            inputSize='sm'
          />
        </div>
      </div>
      <div>
        <Button size='sm' variant='solid' className='w-full'>
          OverHead Expense
        </Button>
      </div>
    </div>
  );
}

export default LogisticsForm