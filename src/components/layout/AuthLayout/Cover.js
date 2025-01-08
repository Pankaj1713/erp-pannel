import React, { cloneElement } from "react";
import Logo from "components/template/Logo";
import { APP_NAME } from "constants/app.constant";

const Cover = ({ children, content, ...rest }) => {
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        // className="col-span-2 bg-no-repeat bg-cover py-6 px-16 flex-col justify-between bg-white dark:bg-gray-800 hidden lg:flex"
        className="col-span-2  py-6 px-16 flex-col justify-between bg-blue-900 dark:bg-gray-800 hidden lg:flex"
        // style={{ backgroundImage: `url('/img/others/auth-cover.png')` }}
      >
        <h2
          className="text-6xl  text-white"
          style={{
            lineHeight: 1.2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          A complete CRM build to increase your revenue
        </h2>
        <Logo mode="dark" />
        <span className="text-white">
          Copyright &copy; {`${new Date().getFullYear()}`}{" "}
          <span className="font-semibold ">{`${APP_NAME}`}</span>{" "}
        </span>
      </div>
      <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children ? cloneElement(children, { ...rest }) : null}
        </div>
      </div>
    </div>
  );
};

export default Cover;
