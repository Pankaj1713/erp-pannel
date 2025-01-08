import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Avatar, Button } from "components/ui";
import { DataTable } from "components/shared";
import useThemeClass from "utils/hooks/useThemeClass";
import dayjs from "dayjs";
import { getApi } from "services/CommonService";
import { APIS, BLOCK_STATUS_ENUMS } from "constants/api.constant";
import TableSearchBar from "components/ui/TableSearchBar";
import { HiOutlinePlusCircle } from "react-icons/hi";
import appConfig from "configs/app.config";
import { useNavigate } from "react-router-dom";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import { formatDate } from "utils/utils";
import StatusDialogBox from "components/custom/status";

const Discounts = () => {
  const [loading, setLoading] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  //////FETCH CUSTOMERS ALL DATA FROM API///////

  useEffect(() => {
    getDiscountsData();
  }, [refresh, search, page, limit]);

  const getDiscountsData = () => {
    getApi(APIS.GET_DISCOUNTS, { page: page, limit, pattern: search })
      .then((res) => {
        setDiscounts(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  };

  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    const openDialog = (e) => {
      e.stopPropagation();
    };

    return (
      <div className=" flex">
        {hasPermisson(MODULE.DISCOUNTS, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.DISCOUNTS, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2  text-lg hover:text-red-500"
            onClick={(e) => {
              openDialog(e);
            }}
          >
            <StatusDialogBox
              row={row}
              name="Discount"
              num="9"
              status={row?.status}
              id={row?._id}
              blockStatusEnum={BLOCK_STATUS_ENUMS.discount}
              setRefresh={setRefresh}
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
      Header: "Coupon Code",
      accessor: "couponCode",
      // Cell: (props) => {
      //   const row = props.row.original;
      //   return <NameColumn row={row} />;
      // },
    },
    {
      Header: "Coupon Amount",
      accessor: "couponAmount",
    },
    {
      Header: "Type",
      accessor: "offType",
      Cell: (props) => {
        const row = props.row?.original?.offType;
        return <> {row ? "Flat" : "Percentage"}</>;
      },
    },
    {
      Header: "Limit Count",
      accessor: "limitCount",
    },
    {
      Header: "Minimum Amount",
      accessor: "minimumAmount",
      Cell: (props) => {
        const row = props.row.original.minimumAmount;
        return <div>{props.row.original.minimumAmount || "-"}</div>;
      },
    },

    {
      Header: "Start Date",
      accessor: "startDate",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            {dayjs(row?.startDate).format(formatDate(false))}
          </div>
        );
      },
    },
    {
      Header: "End Date",
      accessor: "endDate",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            {dayjs(row?.endDate).format(formatDate(false))}
          </div>
        );
      },
    },
  ];

  ///// RETURN //////

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
          {hasPermisson(MODULE.DISCOUNTS, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              onClick={() => navigate("/app/discounts/add")}
              icon={<HiOutlinePlusCircle />}
            >
              Add Discount
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            hasPermisson(MODULE.DISCOUNTS, ACCESS.WRITE)
              ? navigate(`/app/discounts/edit/${row?.values?.action?._id}`)
              : navigate(`/app/discounts`);
          }}
          columns={newColumn(columns, MODULE.DISCOUNTS)}
          data={discounts}
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

export default Discounts;
