import { Select } from "components/ui";
import { APIS } from "constants/api.constant";
import debounce from "lodash/debounce";
import React from "react";
import { getApi } from "services/CommonService";
import AsyncSelect from "react-select/async";
import DatePickerRange from "components/ui/DatePicker/DatePickerRange";
const Header = ({
  setStartDate,
  setEndDate,
  setUser,
  showUserSelect = true,
}) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const loadStaysOption = (inputValue, resolve) => {
    getApi(APIS.GET_CUSTOMERS, { pattern: inputValue }).then((result) => {
      resolve(result?.data?.data);
    });
  };

  const loadStays = debounce(loadStaysOption, 300);
  return (
    <div className="flex justify-between mb-10">
      <div className="w-1/3">
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="dateRange"
        >
          Filter by date
        </label>
        <DatePickerRange
          defaultValue={[firstDay, lastDay]}
          className="font-semibold h-10"
          inputFormat="MMM, DD YYYY"
          onChange={(e) => {
            setStartDate(e[0]);
            setEndDate(e[1]);
          }}
          placeholder="Select Date"
          dateViewCount={2}
          id="dateRange"
        />
      </div>

      {showUserSelect && (
        <div className="w-1/3">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="userSelect"
          >
            Filter by user
          </label>
          <Select
            isMulti
            defaultOptions
            cacheOptions
            placeholder="Select User"
            loadOptions={loadStays}
            componentAs={AsyncSelect}
            className="font-semibold"
            onChange={(event) => setUser(event)}
            getOptionLabel={(v) => `${v?.name} (${v?.phoneNumber})`}
            getOptionValue={(v) => v?._id}
            id="userSelect"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
