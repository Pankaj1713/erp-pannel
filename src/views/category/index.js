import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Avatar, Button } from "components/ui";
import { DataTable } from "components/shared";
import useThemeClass from "utils/hooks/useThemeClass";
import { Link } from "react-router-dom";
import { getApi } from "services/CommonService";
import {
  APIS,
  BLOCK_STATUS_ENUMS,
  GET_CATEGORIES_TYPE,
} from "constants/api.constant";
import TableSearchBar from "components/ui/TableSearchBar";
import { HiOutlineLockClosed, HiOutlinePlusCircle } from "react-icons/hi";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import AddEditCategory from "./addEdit";
import StatusDialogBox from "components/custom/status";
import appConfig from "configs/app.config";
import { useSelector } from "react-redux";

const Category = () => {
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editData, setEditData] = useState();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const Url = useSelector((state) => state.auth?.session?.imageUrl);

  ////// GET LIST CATEGORY FROM API///////////

  useEffect(() => {
    getData();
  }, [refresh, search, page, limit]);

  const getData = () => {
    const params = { page, limit };
    if (search && search !== "") params.pattern = search;
    getApi(APIS.GET_CATEGORIES, params)
      .then((res) => {
        setTags(res?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  };

  const openDialog = (e) => {
    e.stopPropagation();
  };

  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    // const openDialog = (e) => {
    //   e.stopPropagation();
    // };
    return (
      <div className=" flex">
        {hasPermisson(MODULE.CATEGORY, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.CATEGORY, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2  text-lg text-red-500"
            onClick={(e) => {
              openDialog(e);
            }}
          >
            <StatusDialogBox
              row={row}
              id={row?.row?.original?._id}
              status={row?.row?.original?.status}
              setRefresh={setRefresh}
              blockStatusEnum={BLOCK_STATUS_ENUMS.category}
              name="Category"
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
      Header: "category",
      accessor: "category",
    },

    {
      Header: "color",
      accessor: "color",
      Cell: (props) => {
        return (
          <div
            style={{
              backgroundColor: props?.row?.original?.color || "white",
              color: "black",
            }}
          >
            {props?.row?.original?.color}
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
          {hasPermisson(MODULE.CATEGORY, ACCESS.WRITE) && (
            <Button
              size="sm"
              variant="solid"
              onClick={() => setDrawer(true)}
              icon={<HiOutlinePlusCircle />}
            >
              Add Category
            </Button>
          )}
        </div>
      </div>
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            setEditData({
              ...row?.original,
              _id: row.original.code,
            });
            setDrawer(hasPermisson(MODULE.CONTACT, ACCESS.WRITE));
          }}
          columns={newColumn(columns, MODULE.CATEGORY)}
          data={tags.data}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ width: 28, height: 28 }}
          pagingData={{ pageIndex: page, pageSize: limit, total: totalCount }}
          onPaginationChange={(page) => setPage(page)}
          onSelectChange={(limit) => setLimit(limit)}
        />
      </AdaptableCard>

      <AddEditCategory
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

export default Category;
