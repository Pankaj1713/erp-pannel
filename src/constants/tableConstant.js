const NameColumn = ({ row }) => {
  const { textTheme } = useThemeClass();

  return (
    <div className="flex items-center">
      {row?.image?.thumbnail ? (
        <Avatar
          size={28}
          shape="circle"
          src={`${appConfig.imageBaseUrl}${row?.image?.thumbnail}`}
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
export const columns = [
  {
    Header: "Name",
    accessor: "name",
    Cell: (props) => {
      const row = props.row.original;
      return <NameColumn row={row} />;
    },
  },
  {
    Header: "Description",
    accessor: "description",
    Cell: (props) => {
      const row = props.row.original;
      return row?.description || "-";
    },
  },
  {
    Header: "Price",
    accessor: "price",
    Cell: (props) => {
      const row = props.row.original;
      return row?.price;
    },
  },
  {
    Header: "GST%",
    accessor: "gst",
    Cell: (props) => {
      const row = props.row.original;
      return row?.gst;
    },
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: (props) => {
      const row = props.row.original;
      return (
        <div className="flex items-center">
          <Badge className={statusColor[row?.isBlocked]} />
          <span className="ml-2 rtl:mr-2 capitalize">
            {row?.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>
      );
    },
  },
  {
    Header: "Date added",
    accessor: "createdAt",
    Cell: (props) => {
      const row = props.row.original;
      return (
        <div className="flex items-center">
          {dayjs(row?.createdAt).format("DD MMM YYYY HH:mm a")}
        </div>
      );
    },
  },
  {
    Header: "",
    id: "action",
    accessor: (row) => row,
    Cell: (props) => {
      const { textTheme } = useThemeClass();
      return (
        <div
          className={`${textTheme} cursor-pointer select-none font-semibold`}
        >
          Edit
        </div>
      );
    },
  },
];
