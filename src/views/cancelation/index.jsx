import React, { useEffect, useState } from "react";
import { Button, Avatar } from "components/ui";
import { DataTable, AdaptableCard } from "components/shared";
import useThemeClass from "utils/hooks/useThemeClass";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import StatusDialogBox from "components/custom/status";
import { getApi } from "services/CommonService";
import { APIS, BLOCK_STATUS_ENUMS } from "constants/api.constant";
import hasPermission, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import TableSearchBar from "components/ui/TableSearchBar";
import AddEditCancelation from "./addEdit";

const Cancelation = () => {
  const [loading, setLoading] = useState(true);
  const [cancelations, setCancelations] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  useEffect(() => {
    fetchData();
  }, [refresh, search, page, limit]);

  const fetchData = () => {
    const params = { page, limit, search };
    getApi(APIS.GET_REFUND_RULES, params)
      .then((res) => {
        setCancelations(res?.data);
        setTotalCount(res.data.count);
      })
      .finally(() => setLoading(false));
  };

  const openDialog = (e) => {
    e.stopPropagation();
  };

  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    return (
      <div className="flex">
        {hasPermission(MODULE.CANCELATION, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
            onClick={() => {
              setEditData(row?.row?.original);
              setDrawer(true);
            }}
          >
            Edit
          </span>
        )}
        {hasPermission(MODULE.CANCELATION, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2 text-lg text-red-500"
            onClick={(e) => openDialog(e)}
          >
            <StatusDialogBox
              row={row}
              id={row?.row?.original?._id}
              status={row?.row?.original?.status}
              setRefresh={setRefresh}
              blockStatusEnum={BLOCK_STATUS_ENUMS.refundRule}
              name="Cancelation"
            />
          </span>
        )}
      </div>
    );
  };

  const columns = [
    {
      Header: "Actions",
      id: "actions",
      Cell: (props) => <ActionColumn row={props} />,
    },
    {
      Header: "Start Time",
      accessor: "startTime",
      Cell: (props) => {
        const row = props.row.original;
        const time = row?.timeUnit === 0 ? "Hours" : "Days";
        return (
          <div className="flex items-center">{`${row?.startTime} ${time}`}</div>
        );
      },
    },
    {
      Header: "End Time",
      accessor: "endTime",
      Cell: (props) => {
        const row = props.row.original;
        const time = row?.timeUnit === 0 ? "Hours" : "Days";
        return (
          <div className="flex items-center">{`${row?.endTime} ${time}`}</div>
        );
      },
    },
    {
      Header: "Time Unit",
      accessor: "timeUnit",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            {row?.timeUnit === 0 ? "Hours" : "Days"}
          </div>
        );
      },
    },
    {
      Header: "Percentage",
      accessor: "refundPercentage",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">{row?.refundPercentage}%</div>
        );
      },
    },
  ];

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
          {hasPermission(MODULE.CANCELATION, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              onClick={() => setDrawer(true)}
              icon={<HiOutlinePlusCircle />}
            >
              Add Rules
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          columns={newColumn(columns, MODULE.CANCELATION)}
          data={cancelations.data}
          loading={loading}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
          onRowClicked={(row) => {
            setEditData(row.original);
            setDrawer(true);
          }}
        />
      </AdaptableCard>
      <AddEditCancelation
        show={drawer}
        onClose={() => {
          setEditData(null);
          setDrawer(false);
        }}
        setRefresh={setRefresh}
        editData={editData}
      />
    </>
  );
};

export default Cancelation;
