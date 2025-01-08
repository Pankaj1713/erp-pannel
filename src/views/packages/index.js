import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Avatar, Badge, Select } from "components/ui";
import { DataTable } from "components/shared";

import { Button } from "components/ui";
import { HiOutlinePlusCircle } from "react-icons/hi";
import useThemeClass from "utils/hooks/useThemeClass";
import { useNavigate } from "react-router-dom";
import { getApi, postApi } from "services/CommonService";
import { APIS, BLOCK_STATUS_ENUMS } from "constants/api.constant";
import TableSearchBar from "components/ui/TableSearchBar";

import { formatListAmount } from "utils/helpers";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import appConfig from "configs/app.config";
import { useSelector } from "react-redux";
import StatusDialogBox from "components/custom/status";

const statusColor = {
  true: "bg-emerald-500",
  false: "bg-red-500",
};

const Packages = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const Url = useSelector((state) => state?.auth?.session?.imageUrl);
  const data = useSelector((state) => state?.auth?.user?.appConfig?.[0]);

  useEffect(() => {
    getData();
  }, [refresh, search, page, limit]);

  const getData = () => {
    const params = { page, limit };
    if (search && search !== "") params.pattern = search;
    getApi(APIS.GET_PACKAGES, params)
      .then((res) => {
        setPackages(res?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  };

  const openDialog = (e) => {
    e.stopPropagation();
  };

  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();
    return (
      <div className=" flex  ">
        {hasPermisson(MODULE.ADVENTURES, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.ADVENTURES, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2  text-lg hover:text-red-500"
            onClick={(e) => {
              openDialog(e);
            }}
          >
            <StatusDialogBox
              row={row}
              name="Package"
              num="4"
              setRefresh={setRefresh}
              status={row?.status}
              id={row?._id}
              blockStatusEnum={BLOCK_STATUS_ENUMS.package}
            />
          </span>
        )}
      </div>
    );
  };
  const sortOptions = [];
  for (let i = 1; i <= totalCount; i++) {
    sortOptions.push({
      label: i,
      value: i,
    });
  }
  // const sortHandler = (row, val) => {
  //   const payload = new FormData();
  //   payload.append("activityId", row?._id);
  //   payload.append("sortOrder", val?.value);
  //   postApi(APIS.ADD_EDIT_ACTIVITY, payload);
  // };

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
            {`${data?.globalCurrency}${formatListAmount(row?.price)}`}
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
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Offer ",
      accessor: "offer",
      Cell: (props) => {
        const row = props.row.original.offer;
        return <div>{props.row.original.offer || "-"}</div>;
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
  /////RETURN/////

  return (
    <>
      <div className="md:flex items-center justify-between">
        <div className="md:flex items-center gap-4">
          <TableSearchBar onChange={(query) => setSearch(query)} />
        </div>
        <div className="mb-4">
          {hasPermisson(MODULE.ADVENTURES, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              icon={<HiOutlinePlusCircle />}
              onClick={() => navigate("/app/packages/add")}
            >
              Add Package
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            hasPermisson(MODULE.ADVENTURES, ACCESS.WRITE)
              ? navigate(`/app/packages/edit/${row?.values?.action?._id}`)
              : navigate("/app/packages");
          }}
          columns={newColumn(columns, MODULE.ADVENTURES)}
          data={packages.data}
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

export default Packages;
