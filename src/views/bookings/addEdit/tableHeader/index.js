import { Button, Select } from "components/ui";
import React, { useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { bookingStatus } from "../primaryContact";
import { debounce } from "lodash";
import { getApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import AsyncSelect from "react-select/async";
import { GrPowerReset } from "react-icons/gr";
import DatePickerRange from "components/ui/DatePicker/DatePickerRange";
import BookingSearchBar from "components/ui/BookingSearchBar";
import hasPermisson, { ACCESS, MODULE } from "utils/hasPermission";

const TablerHeader = ({
  setSearch,
  status,
  setStatus,
  setUserId,
  setStartDate,
  setEndDate,
  userId,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState();
  const [selectedDate, setSelectedDate] = useState();

  const loadStaysOption = (inputValue, resolve) => {
    getApi(APIS.GET_CUSTOMERS, { pattern: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  };

  const loadStays = debounce(loadStaysOption, 300);
  return (
    <div className="grid grid-cols-2 gap-4  items-end md:flex md:justify-between lg:gap-0  mb-4">
      <div className="flex flex-col justify-center ">
        <BookingSearchBar
          className="w-40"
          onChange={(query) => setSearch(query)}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>

      <div className="flex flex-col justify-center ">
        <p>Booking Status</p>
        <Select
          autoComplete="off"
          placeholder="Select Status"
          size="sm"
          value={status}
          options={bookingStatus}
          onChange={(event) => setStatus(event)}
          name="status"
          isSearchable={false}
        />
      </div>
      <div className="flex flex-col justify-center ">
        <p>Customer Name</p>
        <Select
          autoComplete="off"
          placeholder="Select Customer"
          size="sm"
          defaultOptions
          cacheOptions
          loadOptions={loadStays}
          value={userId}
          componentAs={AsyncSelect}
          getOptionLabel={(v) => v?.name}
          getOptionValue={(v) => v?._id}
          onChange={(event) => setUserId(event)}
          name="customer"
        />
      </div>

      <div className="flex flex-col justify-center ">
        <p>Select Dates</p>
        <DatePickerRange
          inputFormat="MMM, DD YYYY"
          autoComplete="off"
          size="sm"
          isClearable
          value={selectedDate}
          placeholder="Select Date"
          dateViewCount={2}
          onChange={(e) => {
            setSelectedDate(e);
            setStartDate(e[0]);
            setEndDate(e[1]);
          }}
        />
      </div>

      <Button
        size="sm"
        className="mt-7"
        onClick={() => {
          setStatus("");
          setUserId("");
          setSearchValue("");
          setSelectedDate("");
        }}
        icon={<GrPowerReset />}
      >
        Reset
      </Button>
      {hasPermisson(MODULE.BOOKINGS, ACCESS.WRITE) && (
        <Button
          size="sm"
          variant="solid"
          className="mt-7"
          onClick={() => navigate("/app/bookings/add")}
          icon={<HiOutlinePlusCircle />}
        >
          Add Bookings
        </Button>
      )}
    </div>
  );
};

export default TablerHeader;
