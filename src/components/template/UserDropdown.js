import React from "react";
import { Avatar, Dropdown } from "components/ui";
import withHeaderItem from "utils/hoc/withHeaderItem";
import useAuth from "utils/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { FiActivity } from "react-icons/fi";
import { onSignOutSuccess } from "store/auth/sessionSlice";

const dropdownItemList = [
  // {
  //   label: "Profile",
  //   path: "/app/account/settings/profile",
  //   icon: <HiOutlineUser />,
  // },
  {
    label: "Account Setting",
    path: "/app/account/settings/profile",
    icon: <HiOutlineCog />,
  },
  // {
  //   label: "Activity Log",
  //   path: "/app/account/activity-log",
  //   icon: <FiActivity />,
  // },
];

export const UserDropdown = ({ className }) => {
  const data = useSelector((state) => state.auth.user);
  const { signOut } = useAuth();
  const dispatch = useDispatch();

  const UserAvatar = (
    <div className={classNames(className, "flex items-center gap-2")}>
      <Avatar
        className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
        size={32}
        shape="circle"
        src={data?.data?.avatar}
        icon={<HiOutlineUser />}
      />
      <div className="hidden md:block">
        <div className="text-xs capitalize">
          {data?.authority[0] || "guest"}
        </div>
        <div className="font-bold">{data?.data?.name}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2">
            <Avatar
              className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
              shape="circle"
              // src={avatar}
              icon={<HiOutlineUser />}
            />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {data?.data?.name}
              </div>
              <div className="text-xs">{data?.data?.email}</div>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item variant="divider" />
        {dropdownItemList.map((item) => (
          <Dropdown.Item
            eventKey={item.label}
            key={item.label}
            className="mb-1"
          >
            <Link className="flex gap-2 items-center" to={item.path}>
              <span className="text-xl opacity-50">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </Dropdown.Item>
        ))}
        <Dropdown.Item variant="divider" />
        <Dropdown.Item
          onClick={() => {
            dispatch(onSignOutSuccess());
          }}
          eventKey="Sign Out"
          className="gap-2"
        >
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>Sign Out</span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default withHeaderItem(UserDropdown);
