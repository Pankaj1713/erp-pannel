import React from "react";
import { Menu, Dropdown } from "components/ui";
import { Link } from "react-router-dom";
import VerticalMenuIcon from "./VerticalMenuIcon";
import { Trans } from "react-i18next";

const { MenuItem, MenuCollapse } = Menu;

const DefaultItem = ({ nav, onLinkClick, userAuthority }) => {
  return nav?.isVisible?.() ? (
    <MenuCollapse
      label={
        <>
          <VerticalMenuIcon icon={nav.icon} />
          <span>
            <Trans i18nKey={nav.translateKey} defaults={nav.title} />
          </span>
        </>
      }
      key={nav.key}
      eventKey={nav.key}
      expanded={false}
      className="mb-2"
    >
      {nav.subMenu.map((subNav) =>
        subNav?.isVisible?.() ? (
          <MenuItem eventKey={subNav.key}>
            {subNav.path ? (
              <Link
                className="h-full w-full flex items-center"
                onClick={() =>
                  onLinkClick?.({
                    key: subNav.key,
                    title: subNav.title,
                    path: subNav.path,
                  })
                }
                to={subNav.path}
              >
                <span>
                  <Trans
                    i18nKey={subNav.translateKey}
                    defaults={subNav.title}
                  />
                </span>
              </Link>
            ) : (
              <span>
                <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
              </span>
            )}
          </MenuItem>
        ) : (
          ""
        )
      )}
    </MenuCollapse>
  ) : (
    ""
  );
};

const CollapsedItem = ({ nav, onLinkClick, userAuthority, direction }) => {
  const menuItem = (
    <MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
      <VerticalMenuIcon icon={nav.icon} />
    </MenuItem>
  );

  return (
    <Dropdown
      trigger="hover"
      renderTitle={menuItem}
      placement={direction === "rtl" ? "middle-end-top" : "middle-start-top"}
    >
      {nav.subMenu.map((subNav) => (
        <Dropdown.Item eventKey={subNav.key}>
          {subNav.path ? (
            <Link
              className="h-full w-full flex items-center"
              onClick={() =>
                onLinkClick?.({
                  key: subNav.key,
                  title: subNav.title,
                  path: subNav.path,
                })
              }
              to={subNav.path}
            >
              <span>
                <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
              </span>
            </Link>
          ) : (
            <span>
              <Trans i18nKey={subNav.translateKey} defaults={subNav.title} />
            </span>
          )}
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

const VerticalCollapsedMenuItem = ({ sideCollapsed, ...rest }) => {
  return sideCollapsed ? (
    <CollapsedItem {...rest} />
  ) : (
    <DefaultItem {...rest} />
  );
};

export default VerticalCollapsedMenuItem;
