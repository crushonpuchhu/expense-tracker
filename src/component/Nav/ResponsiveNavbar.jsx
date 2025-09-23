"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Button,
  Tooltip,
} from "@heroui/react";
import { RiAccountCircleFill } from "react-icons/ri";


export default function ResponsiveNavbar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/Dashboard" },
    { name: "Transactions", href: "/Transactions" },
    { name: "Budgets", href: "/Budget" },
  ];

  return (
    <>
      <Navbar shouldHideOnScroll>
        {/* Left - Logo */}
        <NavbarBrand>
         <Link href={"/"}> <h1 className="font-bold text-xl">
            Expense <span className="font-light">Tracker</span>
          </h1></Link>
        </NavbarBrand>

        {/* Center - Desktop Menu */}
        <NavbarContent justify="center" className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <NavbarItem isActive={item.name=="Dashboard"?true:false} key={item.name}>
              <Link href={item.href}>{item.name}</Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right - Profile + Hamburger */}
        <NavbarContent justify="end" className="flex items-center space-x-4">
          <Link href="/Profile">
            <Tooltip content="Profile">
              <Avatar icon={<RiAccountCircleFill size={20} />} isBordered color="success"   size="sm" alt="Profile" />
            </Tooltip>
          </Link>

          {/* Hamburger button for mobile */}
          <Button
            className="md:hidden"
            variant="ghost"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <span className="text-2xl font-bold">&#x2715;</span> // X icon
            ) : (
              <span className="text-2xl font-bold">&#9776;</span> // Hamburger
            )}
          </Button>
        </NavbarContent>
      </Navbar>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block text-gray-700 hover:text-indigo-500 font-medium ${item.name=="Dashboard"?"text-indigo-600 font-bold ":''}`}
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
