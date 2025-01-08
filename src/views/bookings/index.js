import { AdaptableCard } from "components/shared";
import React, { useEffect, useState } from "react";
import { Button, Tag } from "components/ui";
import { DataTable } from "components/shared";
import useThemeClass from "utils/hooks/useThemeClass";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getApi, postApi } from "services/CommonService";
import { APIS } from "constants/api.constant";
import { BOOKING_STATUS } from "constants/booking";
import TableHeader from "./addEdit/tableHeader";
import hasPermisson, { ACCESS, MODULE, newColumn } from "utils/hasPermission";
import { BsDownload } from "react-icons/bs";
import { formatDate } from "utils/utils";

export const paymentClass =
  "text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20 rounded border-0";
export const OrderStatusTag = ({ status }) => {
  switch (status) {
    case BOOKING_STATUS.PENDING:
      return <Tag className={paymentClass}>Pending</Tag>;
    case BOOKING_STATUS.CONFIRMED:
      return (
        <Tag className="bg-green-100 text-gray-600 rounded border-0">
          Confirmed
        </Tag>
      );
    case BOOKING_STATUS.PARTIAL_PAYMENT:
      return <Tag className={paymentClass}>Partial Payment</Tag>;

    case BOOKING_STATUS.CANCEL_NO_PAYMENT_RECEIVED:
      return <Tag className={paymentClass}>No Payment received</Tag>;
    case BOOKING_STATUS.CANCEL_BY_USER:
      return <Tag className={paymentClass}>Cancel by User</Tag>;
    case BOOKING_STATUS.CANCEL_BY_ADMIN:
      return (
        <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 rounded border-0">
          Cancel by Admin
        </Tag>
      );

    case BOOKING_STATUS.COMPLETED:
      return (
        <Tag className="text-green-600 bg-green-100 dark:text-green-100 dark:bg-green-500/20 rounded border-0">
          Completed
        </Tag>
      );

    default:
      return null;
  }
};

const Bookings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState();
  const [userId, setUserId] = useState();
  const [refresh, setRefresh] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [downloadRowId, setDownloadRowId] = useState();

  useEffect(() => {
    const params = {
      page,
      limit,
      userId: userId?._id,
      bookingStatus: status?.value,
      startDate,
      endDate,
    };
    if (search) {
      params.orderNumber = search;
    }
    getApi(APIS.GET_BOOKINGS, params)
      .then((res) => {
        setBookings(res?.data?.data);
        setTotalCount(res?.data?.count);
      })
      .finally(() => setLoading(false));
  }, [refresh, search, page, limit, userId, status, startDate, endDate]);

  const InvoiceHandler = (row) => {
    setInvoiceLoading(true);
    postApi(APIS.GENERATE_INVOICE, { bookingId: row?._id }).then((res) => {
      const fileUrls = res?.data?.map((download) => {
        return { link: download?.url, name: download?.name };
      });

      fileUrls?.forEach((url) => {
        fetch(url?.link, {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        })
          .then((response) => response.blob())
          .then((blob) => {
            // Create blob link to download
            const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${url.name}`);

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
          });
      });

      setInvoiceLoading(false);
    });
  };

  const onDelete = (e) => {
    e.stopPropagation();
  };
  const ActionColumn = ({ row }) => {
    const { textTheme } = useThemeClass();

    return (
      <div className=" flex ">
        {hasPermisson(MODULE.BOOKINGS, ACCESS.WRITE) && (
          <span
            className={`${textTheme} cursor-pointer select-none font-semibold`}
          >
            Edit
          </span>
        )}
        {hasPermisson(MODULE.BOOKINGS, ACCESS.DELETE) && (
          <span
            className="cursor-pointer px-2  text-lg hover:text-red-500"
            onClick={(e) => {
              onDelete(e);
            }}
          >
            {/* <DeleteDialogBox
              row={row}
              name="Booking"
              num="6"
              setRefresh={setRefresh}
            /> */}
          </span>
        )}
      </div>
    );
  };

  const NameColumn = ({ row }) => {
    return (
      <div className="flex items-center">
        {`${row?.fullName} - ${row?.email} - ${row?.phoneNumber}`}
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
      Header: "Invoice",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <Button
            key={row}
            loading={invoiceLoading && row?._id === downloadRowId}
            onClick={(e) => {
              onDelete(e);
              InvoiceHandler(row);
              setDownloadRowId(row?._id);
            }}
            icon={<BsDownload />}
            size="xs"
            variant="twoTone"
          >
            {invoiceLoading && row?._id === downloadRowId
              ? "Downloading"
              : "Download"}
          </Button>
        );
      },
    },
    {
      Header: "Booking No.",
      accessor: "orderNumber",
    },
    {
      Header: "Booking Status.",
      accessor: (row) => row,
      Cell: (props) => {
        const row = props?.row?.original;
        return <OrderStatusTag status={row?.status} />;
      },
    },
    {
      Header: "User Details",
      accessor: "name",
      Cell: (props) => {
        const row = props.row.original?.userId;
        const phoneNumber = row?.countryCode + row?.phoneNumber;

        return (
          <div>
            {row === null ? (
              "-"
            ) : (
              <div>
                <div>{row?.name},</div>
                <div>{row?.email},</div>
                <div>{phoneNumber}</div>
              </div>
            )}
          </div>
        );
      },
    },

    {
      Header: "Booking Date",
      accessor: "createdAt",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex items-center">
            {dayjs(row?.date).format(formatDate(false))}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <TableHeader
        {...{
          search,
          setSearch,
          status,
          setStatus,
          userId,
          setUserId,
          setStartDate,
          setEndDate,
        }}
      />
      <AdaptableCard className="h-full" bodyClass="h-full">
        <DataTable
          onRowClicked={(row) => {
            if (hasPermisson(MODULE.BOOKINGS, ACCESS.WRITE))
              navigate(
                `/app/bookings/edit/${row?.values?.action?.orderNumber}`
              );
          }}
          columns={newColumn(columns, MODULE.BOOKINGS)}
          data={bookings}
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

export default Bookings;
