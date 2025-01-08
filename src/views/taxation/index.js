import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Avatar, Button } from "components/ui";
import { DataTable } from "components/shared";
import useThemeClass from "utils/hooks/useThemeClass";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { getApi } from "services/CommonService";
import { APIS, BLOCK_STATUS_ENUMS } from "constants/api.constant";
import TableSearchBar from "components/ui/TableSearchBar";
import { HiOutlinePlusCircle } from "react-icons/hi";
import AddEditTaxation from "./addEdit";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import StatusDialogBox from "components/custom/status";

const NameColumn = ({ row }) => {
  const { textTheme } = useThemeClass();

  return (
    <div className="flex items-center">
      <Avatar size={28} shape="circle">
        {row?.taxName?.[0]?.toUpperCase()}
      </Avatar>

      <Link className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}>
        {row?.taxName || "-"}
      </Link>
    </div>
  );
};

const Addons = () => {
  const [loading, setLoading] = useState(true);
  const [taxes, setTaxes] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);

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
              blockStatusEnum={BLOCK_STATUS_ENUMS.taxation}
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
      Header: "Name",
      accessor: "name",
      Cell: (props) => {
        const row = props.row.original;
        return <NameColumn row={row} />;
      },
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: (props) => {
        const row = props.row.original?.taxPrice;
        return <div>{row}</div>;
      },
    },
    {
      Header: "City Name",
      accessor: "cityName",
      Cell: (props) => {
        const row = props.row.original.localSaleTax[0]?.cityName;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Local Tax Rate",
      accessor: "localTaxRate",
      Cell: (props) => {
        const row = props.row.original.localSaleTax[0]?.localTaxRate;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Date added",
      accessor: "createdAt",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            {dayjs(row?.createdAt).format("DD MMM YYYY ")}
          </div>
        );
      },
    },
  ];

  //////FETCH CUSTOMERS ALL DATA FROM API///////

  useEffect(() => {
    getApi(APIS.GET_TAXATION, {
      page: limit * (page - 1),
      limit,
      pattern: search,
    })
      .then((res) => {
        setTaxes(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [refresh, search, page, limit]);

  ///// HANDLER FOR OPEN AND CLOSE DRAWER/////

  const handlerOpenDrawer = () => {
    setDrawer(true);
  };

  const handlerCloseDrawer = () => {
    setEditData(null);
    setDrawer(false);
  };

  ///// RETURN //////

  return (
    <>
      <div className="md:flex items-center justify-between">
        <div className="md:flex items-center gap-4">
          <TableSearchBar onChange={(query) => setSearch(query)} />
        </div>
        <div className="mb-4">
          {hasPermisson(MODULE.TAXATION, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              onClick={handlerOpenDrawer}
              icon={<HiOutlinePlusCircle />}
            >
              Add Taxation
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            setEditData({
              _id: row?.values?.action?._id,
              taxName: row?.values?.action?.taxName,
              taxPrice: row?.values?.action?.taxPrice,
              cityName: row?.values?.action?.localSaleTax[0]?.cityName,
              localTaxRate: row?.values?.action?.localSaleTax[0]?.localTaxRate,
              interStateTax: row?.values?.action?.interState,
            });
            setDrawer(hasPermisson(MODULE.TAXATION, ACCESS.WRITE));
          }}
          columns={newColumn(columns, MODULE.TAXATION)}
          data={taxes}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
        />
      </AdaptableCard>

      <AddEditTaxation
        show={drawer}
        onClose={handlerCloseDrawer}
        editData={editData}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default Addons;
