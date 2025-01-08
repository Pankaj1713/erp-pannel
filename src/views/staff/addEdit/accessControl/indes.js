import { Checkbox, Table } from "components/ui";
import TBody from "components/ui/Table/TBody";
import Td from "components/ui/Table/Td";
import Th from "components/ui/Table/Th";
import THead from "components/ui/Table/THead";
import Tr from "components/ui/Table/Tr";
import React from "react";

export const PERMISSIONS = [
  {
    label: "Dashboard",
    name: "dashboard",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Categories",
    name: "categories",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Services",
    name: "services",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Banners",
    name: "banners",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Bookings",
    name: "bookings",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Discounts",
    name: "discounts",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Taxation",
    name: "taxation",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Staff and Admins",
    name: "staff and admins",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Customers",
    name: "customers",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Content Form Entries",
    name: "contact",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "App config",
    name: "appConfig",
    read: true,
    edit: false,
    delete: false,
  },
];

const AccessControl = ({ touched, errors, values, setFieldValue }) => {
  const selectHandler = (role, value, name) => {
    const newRoles = values?.access?.map((x) =>
      x?.name === name ? { ...x, [role]: value } : x
    );
    setFieldValue("access", newRoles);
  };

  return (
    <div>
      <h4 className="my-4">Access Control</h4>
      <Table>
        <THead>
          <Tr>
            <Th>Menu</Th>
            <Th>Read</Th>
            <Th>Add/Edit</Th>
            <Th>Delete</Th>
          </Tr>
        </THead>
        <TBody>
          {PERMISSIONS?.map((permission, index) => {
            const valueObj = values?.access?.find(
              (x) => x?.name === permission?.name
            );
            return (
              <Tr key={index}>
                <Td>{permission?.label}</Td>
                <Td>
                  <Checkbox
                    checked={valueObj?.read}
                    onChange={(e) => selectHandler("read", e, permission?.name)}
                  />
                </Td>
                <Td>
                  <Checkbox
                    checked={valueObj?.edit}
                    onChange={(e) => selectHandler("edit", e, permission?.name)}
                  />
                </Td>
                <Td>
                  <Checkbox
                    checked={valueObj?.delete}
                    onChange={(e) =>
                      selectHandler("delete", e, permission?.name)
                    }
                  />
                </Td>
              </Tr>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
};

export default AccessControl;
