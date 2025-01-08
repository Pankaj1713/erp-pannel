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
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import { useSelector } from "react-redux";
import StatusDialogBox from "components/custom/status";

const Banners = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  const openDialog = (e) => {
    e.stopPropagation();
  };
  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    return (
      <div className=" flex ">
        {hasPermisson(MODULE.JOURNEYS, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.JOURNEYS, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2  text-lg hover:text-red-500"
            onClick={(e) => {
              openDialog(e);
            }}
          >
            <StatusDialogBox
              row={row}
              name="Banners"
              num="11"
              id={row?._id}
              status={row?.status}
              setRefresh={setRefresh}
              blockStatusEnum={BLOCK_STATUS_ENUMS.banner}
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

  const columns = [
    {
      Header: "Actions",
      id: "action",
      accessor: (row) => row,
      Cell: (props) => <ActionColumn row={props.row.original} />,
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: (props) => {
        const row = props?.row?.original?.title;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Sub Title",
      accessor: "subTitle",
      Cell: (props) => {
        const row = props.row.original.subTitle;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: (props) => {
        const row = props.row.original.description;
        return <div>{row || "-"}</div>;
      },
    },
    {
      Header: "color",
      accessor: "textColor",
      Cell: (props) => {
        const row = props.row.original.textColor;
        return (
          <div
            style={{
              backgroundColor: row || "white",
              color: "black",
            }}
          >
            {row || "-"}
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
    getApi(APIS.GET_BANNERS, params)
      .then((res) => {
        setBanners(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  };

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
          {hasPermisson(MODULE.JOURNEYS, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              onClick={() => navigate("/app/banners/add")}
              icon={<HiOutlinePlusCircle />}
            >
              Add Banner
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            hasPermisson(MODULE.JOURNEYS, ACCESS.WRITE)
              ? navigate(`/app/banners/edit/${row?.values?.action?._id}`)
              : navigate("/app/services");
          }}
          columns={newColumn(columns, MODULE.JOURNEYS)}
          data={banners}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          loading={loading}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
        />
        {/* <CustomerEditDialog /> */}
      </AdaptableCard>
    </>
  );
};

export default Banners;
