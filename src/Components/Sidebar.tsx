import { Link, useMatch, useNavigate } from "@reach/router";
import { useAtom } from "jotai";
import React, { ReactElement, useState } from "react";
import { sideBarStateAtom } from "../Atoms";

interface SidebarProps {}

function Sidebar(): ReactElement<SidebarProps> {
  const [isOpen, setIsOpen] = useAtom(sideBarStateAtom);

  const items = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      text: "Dashboard",
      path: "/",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      text: "Graphs",
      path: "/graphs/cases",
    },
    // {
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       className="h-6 w-6"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       stroke="currentColor"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    //       />
    //     </svg>
    //   ),
    //   text: "About",
    //   path: "/about",
    // },
  ];

  const closeSideBar = (e: any) => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen ? "sidebar-overlay-open " : "sidebar-overlay-closed "
      }sidebar-overlay`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSideBar(e);
      }}
    >
      <div className={`${isOpen ? "sidebar-open " : "sidebar-closed "}sidebar`}>
        <div className="w-full flex justify-end py-3 px-5">
          <button
            onClick={(e) => closeSideBar(e)}
            className="focus:outline-none no-tap-effect"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ul className="px-5">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-end justify-start space-x-2 space-y-3 cursor-pointer`}
            >
              {item.icon}
              <span className="font-oswald text-lg ">{item.text}</span>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
