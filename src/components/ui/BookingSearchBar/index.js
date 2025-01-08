import React from "react";
import { Input } from "components/ui";
import { HiOutlineSearch } from "react-icons/hi";
import debounce from "lodash/debounce";

const BookingSearchBar = ({
  onChange,
  className,
  searchValue,
  setSearchValue,
  setSearch
}) => {
  const debounceFn = debounce(handleDebounceFn, 500);

  function handleDebounceFn(val) {
    onChange?.(val);
  }

  const handleInputChange = (e) => {
    debounceFn(e.target.value);
    setSearchValue(e.target.value);
  };

  return (
    <>
      <p>Search Booking</p>
      <Input
        className={` ${className}`}
        size="sm"
        value={searchValue}
        placeholder="Search"
        prefix={<HiOutlineSearch className="text-lg" />}
        onChange={handleInputChange}
      />
    </>
  );
};

export default BookingSearchBar;
