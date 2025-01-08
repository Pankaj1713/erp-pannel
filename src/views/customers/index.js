import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button } from "components/ui";
import { DataTable } from "components/shared";
import useThemeClass from "utils/hooks/useThemeClass";
import { Link } from "react-router-dom";
import { getApi } from "services/CommonService";
import { APIS, BLOCK_STATUS_ENUMS } from "constants/api.constant";
import TableSearchBar from "components/ui/TableSearchBar";
import { HiOutlinePlusCircle } from "react-icons/hi";
import appConfig from "configs/app.config";
import AddEditCustomers from "./addEdit";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import { useSelector } from "react-redux";
import StatusDialogBox from "components/custom/status";

const statusColor = {
  false: "bg-red-500",
  true: "bg-emerald-500",
};

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  //////FETCH CUSTOMERS ALL DATA FROM API///////
  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    const onDelete = (e) => {
      e.stopPropagation();
    };

    return (
      <div className=" flex">
        {hasPermisson(MODULE.CUSTOMERS, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.CUSTOMERS, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2  text-lg hover:text-red-500"
            onClick={(e) => {
              onDelete(e);
            }}
          >
            <StatusDialogBox
              row={row}
              name="Customer"
              num="12"
              id={row?._id}
              status={row?.status}
              setRefresh={setRefresh}
              blockStatusEnum={BLOCK_STATUS_ENUMS.user}
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
      Header: "Phone Number",
      accessor: "phoneNumber",
      Cell: (props) => {
        const row = props.row.original;
        return row?.countryCode + " " + row?.phoneNumber;
      },
    },
    {
      Header: "Wallet",
      accessor: "wallet",
    },
    {
      Header: "Verified user",
      accessor: "verifiedUser",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            <Badge className={statusColor[row?.verifiedUser]} />
            <span className="ml-2 rtl:mr-2 capitalize">
              {row?.verifiedUser ? "Yes" : "No"}
            </span>
          </div>
        );
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
  useEffect(() => {
    getData();
  }, [refresh, search, page, limit]);

  const getData = () => {
    const params = { page, limit };
    if (search && search !== "") params.pattern = search;
    getApi(APIS.GET_CUSTOMERS, params)
      .then((res) => {
        setCustomers(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  };

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
          <TableSearchBar
            onChange={(query) => {
              setSearch(query);
              setPage(1);
            }}
          />
        </div>
        <div className="mb-4">
          {hasPermisson(MODULE.CUSTOMERS, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              onClick={handlerOpenDrawer}
              icon={<HiOutlinePlusCircle />}
            >
              Add Customer
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            setEditData({ ...row?.original, _id: row.original.code });
            setDrawer(hasPermisson(MODULE.CUSTOMERS, ACCESS.WRITE));
          }}
          columns={newColumn(columns, MODULE.CUSTOMERS)}
          data={customers}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
        />
      </AdaptableCard>
      <AddEditCustomers
        show={drawer}
        onClose={handlerCloseDrawer}
        editData={editData}
        setRefresh={setRefresh}
      />
    </>
  );
};

export default Customers;
