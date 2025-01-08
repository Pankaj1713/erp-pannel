import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Avatar } from "components/ui";
import { DataTable } from "components/shared";

import { Button } from "components/ui";
import { HiOutlinePlusCircle } from "react-icons/hi";
import useThemeClass from "utils/hooks/useThemeClass";
import { useNavigate } from "react-router-dom";
import { getApi } from "services/CommonService";
import { APIS, BLOCK_STATUS_ENUMS } from "constants/api.constant";
import TableSearchBar from "components/ui/TableSearchBar";

import { formatListAmount } from "utils/helpers";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import { useSelector } from "react-redux";
import StatusDialogBox from "components/custom/status";

const statusColor = {
  true: "bg-emerald-500",
  false: "bg-red-500",
};

export const availableForOptions = [
  { label: "Male", value: 0 },
  { label: "Female", value: 1 },
  { label: "Both", value: 2 },
];

const Services = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const imageUrl = useSelector((state) => state.auth?.session?.imageUrl);
  const data = useSelector((state) => state?.auth?.user?.appConfig?.[0]);

  ////// GET ACTIVITY LIST FROM API DATA//////
  useEffect(() => {
    getData();
  }, [refresh, search, page, limit]);

  const getData = () => {
    const params = { page, limit };
    if (search && search !== "") params.pattern = search;
    getApi(APIS.GET_SERVICES, params)
      .then((res) => {
        setActivities(res?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  };

  const openDialog = (e) => {
    e.stopPropagation();
  };

  const getLabelForValue = (value) => {
    const option = availableForOptions.find((option) => option.value === value);
    return option ? option.label : "";
  };

  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    return (
      <div className=" flex justify-end ">
        {hasPermisson(MODULE.SERVICES, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.SERVICES, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2  text-lg hover:text-red-500"
            onClick={(e) => {
              openDialog(e);
            }}
          >
            <StatusDialogBox
              row={row}
              id={row?._id}
              status={row?.status}
              name="Service"
              num="4"
              setRefresh={setRefresh}
              blockStatusEnum={BLOCK_STATUS_ENUMS.service}
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
    },

    {
      Header: "Price",
      accessor: "price",

      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="w-16">
            {`${data?.globalCurrency} ${formatListAmount(row?.price)}`}
          </div>
        );
      },
    },

    {
      Header: "Time in minutes",
      accessor: "time",
    },
    {
      Header: "Description ",
      accessor: "description",
      Cell: (props) => {
        const row = props.row.original.description;
        return <div>{props.row.original.description || "-"}</div>;
      },
    },
    {
      Header: "Selected Category",
      accessor: "categoryId",
      Cell: (props) => {
        const row = props.row.original.categoryId.category;
        return <div className="w-16">{row}</div>;
      },
    },
    {
      Header: "Available For",
      accessor: "availableFor",
      Cell: (props) => {
        const row = props.row.original.availableFor;
        const label = getLabelForValue(row);
        return <div className="w-16">{label}</div>;
      },
    },
    {
      Header: "Image",
      accessor: "image",
      Cell: (props) => {
        const row = props?.row?.original;
        const hasImage = row.image && row.image.length > 0;
        const Url = hasImage ? imageUrl + row.image[0].original : null;

        return (
          <div className="flex items-center">
            {hasImage && <Avatar src={Url} shape="circle" />}
          </div>
        );
      },
    },
  ];
  /////RETURN/////

  return (
    <>
      <div className="md:flex items-center justify-between">
        <div className="md:flex items-center gap-4">
          <TableSearchBar
            onChange={(query) => {
              setSearch(query);
              setPage(1);
            }}
          />
        </div>
        <div className="mb-4">
          {hasPermisson(MODULE.SERVICES, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              icon={<HiOutlinePlusCircle />}
              onClick={() => navigate("/app/service/add")}
            >
              Add Service
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            hasPermisson(MODULE.SERVICES, ACCESS.WRITE)
              ? navigate(`/app/services/edit/${row?.values?.action?._id}`)
              : navigate("/app/services");
          }}
          columns={newColumn(columns, MODULE.SERVICES)}
          data={activities.data}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          loading={loading}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
        />
      </AdaptableCard>
    </>
  );
};

export default Services;
