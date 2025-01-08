import React from "react";
import { Input } from "components/ui";
import { HiOutlineSearch } from "react-icons/hi";
import debounce from "lodash/debounce";

const TableSearchBar = ({ onChange }) => {
  const debounceFn = debounce(handleDebounceFn, 500);

  function handleDebounceFn(val) {
    onChange?.(val);
  }

  const handleInputChange = (e) => {
    debounceFn(e.target.value);
  };

  return (
    <Input
      className="max-w-md md:w-52 mb-4"
      size="sm"
      placeholder="Search"
      prefix={<HiOutlineSearch className="text-lg" />}
      onChange={handleInputChange}
    />
  );
};

export default TableSearchBar;
