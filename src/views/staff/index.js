import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Select } from "components/ui";
import { DataTable } from "components/shared";
import useThemeClass from "utils/hooks/useThemeClass";
import { Link } from "react-router-dom";
import { getApi } from "services/CommonService";
import { APIS, BLOCK_STATUS_ENUMS } from "constants/api.constant";
import TableSearchBar from "components/ui/TableSearchBar";
import { HiOutlinePlusCircle } from "react-icons/hi";
import appConfig from "configs/app.config";
import { useNavigate } from "react-router-dom";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import { useSelector } from "react-redux";
import StatusDialogBox from "components/custom/status";

const statusColor = {
  true: "bg-emerald-500",
  false: "bg-red-500",
};

export const roleOptions = [
  { value: 2, label: "Sub-Admin" },
  { value: 3, label: "Staff" },
];

const Staff = () => {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [roleType, setRoleType] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  useEffect(() => {
    getData();
  }, [refresh, search, page, limit, roleType]);

  const getData = () => {
    const params = { page, limit };
    if (search && search !== "") params.pattern = search;
    if (roleType) params.type = roleType;

    getApi(APIS.GET_EMPLOYEE, params)
      .then((res) => {
        setStaff(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setSearch("");
    setRoleType(null);
    setPage(1);
    setLimit(10);
    setRefresh(!refresh);
  };

  const getLabelForValue = (value) => {
    const option = roleOptions.find((option) => option.value === value);
    return option?.label || "";
  };

  const NameColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    return (
      <div className="flex items-center">
        {row?.imageUrl?.thumbnail ? (
          <Avatar
            size={28}
            shape="circle"
            src={`${appConfig.imageBaseUrl}${row?.imageUrl?.thumbnail}`}
          ></Avatar>
        ) : (
          <Avatar size={28} shape="circle">
            {row?.name?.[0]?.toUpperCase()}
          </Avatar>
        )}
        <Link className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}>
          {row?.name || "-"}
        </Link>
      </div>
    );
  };

  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    const onDelete = (e) => {
      e.stopPropagation();
    };

    return (
      <div className="flex">
        {hasPermisson(MODULE.STAFF, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
            onClick={() => navigate(`/app/staff/edit/${row._id}`)}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.STAFF, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2 text-lg hover:text-red-500"
            onClick={(e) => {
              onDelete(e);
            }}
          >
            <StatusDialogBox
              row={row}
              name="Staff"
              num="7"
              id={row?._id}
              status={row?.status}
              setRefresh={setRefresh}
              blockStatusEnum={BLOCK_STATUS_ENUMS.employee}
            />
          </span>
        )}
      </div>
    );
  };

  const columns = [
    {
      Header: "Actions",
      id: "action",
      accessor: (row) => row,
      Cell: (props) => <ActionColumn row={props.row.original} />,
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: (props) => {
        const row = props.row.original;
        return row?.name || "-";
      },
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: (props) => {
        const row = props.row.original;
        return row?.email || "-";
      },
    },
    {
      Header: "Employee Type",
      accessor: "employee",
      Cell: (props) => {
        const row = props.row.original.type;
        const label = getLabelForValue(row);
        return <div className="w-16">{label}</div>;
      },
    },
    {
      Header: "Phone Number",
      accessor: "phoneNumber",
      Cell: (props) => {
        const row = props.row.original;
        return row?.countryCode + row?.phoneNumber;
      },
    },
    {
      Header: "Image",
      accessor: "image",
      Cell: (props) => {
        const row = props?.row?.original;
        const hasImage = row.image && row.image.length > 0;
        const imageUrl = hasImage ? Url + row.image[0].original : null;

        return (
          <div className="flex items-center">
            {hasImage && <Avatar src={imageUrl} shape="circle" />}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="md:flex items-center justify-between">
        <div className="md:flex items-center gap-4">
          <TableSearchBar
            onChange={(query) => setSearch(query)}
            style={{ height: "40px" }}
            value={search}
          />
          <Select
            options={roleOptions}
            placeholder="Select Role"
            onChange={(selected) => setRoleType(selected?.value || null)}
            value={
              !!roleType
                ? roleOptions.find((option) => option.value === roleType)
                : null
            }
            styles={{
              control: (base) => ({
                ...base,
                height: "40px",
                marginBottom: "16px",
              }),
            }}
          />
          <Button
            size="sm"
            variant="solid"
            onClick={resetFilters}
            className="mb-4"
          >
            Reset Filters
          </Button>
        </div>

        <div className="mb-4">
          {hasPermisson(MODULE.STAFF, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              onClick={() => navigate("/app/staff/add")}
              icon={<HiOutlinePlusCircle />}
            >
              Add Staff
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            hasPermisson(MODULE.ADVENTURES, ACCESS.WRITE)
              ? navigate(`/app/staff/edit/${row?.values?.action?._id}`)
              : navigate("/app/staff");
          }}
          columns={newColumn(columns, MODULE.STAFF)}
          data={staff}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
        />
      </AdaptableCard>
    </>
  );
};

export default Staff;
