"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardBody, addToast } from "@heroui/react";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/drawer";
import { Input } from "@heroui/input";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  SearchIcon,
  UsersIcon,
  LayoutDashboardIcon,
  CreditCardIcon,
  Trash2Icon,
  MenuIcon,
  XIcon,
} from "lucide-react";

import Loading from "../../component/LodingUi/Loding";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [txnSearch, setTxnSearch] = useState("");

  // Mock Data
  const [users, setUsers] = useState([]);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  function getLastFiveReversed(arr) {
    if (!Array.isArray(arr)) return [];
    // Take last 5 elements and reverse
    return arr.slice(-5).reverse();
  }
  // Fetch all users and transactions from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin", {
          method: "GET",
          credentials: "include", // send cookies for auth
        });
        const result = await res.json();
        setLoading(false);
        if (!res.ok) throw new Error(result.error || "Failed to fetch data");

        console.log(result.data.users, result.data.transactions);
        setUsers(result.data.users);
        setTransactions(result.data.transactions);
      } catch (err) {
        addToast({ title: "error", description: err.message, color: "danger" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalUsers = users.length;
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Filters
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [userSearch, users]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (t) =>
        (t.category?.toLowerCase() || "").includes(txnSearch.toLowerCase()) ||
        (
          users.filter((e) => t.userId == e._id)[0].name?.toLowerCase() || ""
        ).includes(txnSearch.toLowerCase()) ||
        (t.note?.toLowerCase() || "").includes(txnSearch.toLowerCase()) ||
        (t.method?.toLowerCase() || "").includes(txnSearch.toLowerCase()) ||
        (t.type?.toLowerCase() || "").includes(txnSearch.toLowerCase()) ||
        (t.currency?.toLowerCase() || "").includes(txnSearch.toLowerCase())
    );
  }, [txnSearch, transactions]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  // function to delete a user parmanent by admin
  async function handleDeleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/?userId=${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Optional: add your auth token if required
            // "Authorization": `Bearer ${token}`
          },
        });

        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          addToast({
            title: "error",
            description: data.error,
            color: "danger",
          });
          return;
        }

        addToast({
          title: "success",
          description: data.message,
          color: "success",
        });

        // Optionally: refresh the users list
        // fetchUsers();
      } catch (err) {
        setLoading(false);
        addToast({
          title: "error",
          description: "something went wrong",
          color: "danger",
        });
      }
    }
  }

  const menuItems = [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
    },
    { key: "users", label: "Users", icon: <UsersIcon className="w-5 h-5" /> },
    {
      key: "transactions",
      label: "Transactions",
      icon: <CreditCardIcon className="w-5 h-5" />,
    },
  ];

  const Sidebar = ({ onSelect }) => (
    <div className="flex flex-col p-4 bg-white h-full shadow-lg rounded-xl w-64 hover:shadow-2xl transition-all">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`flex items-center gap-2 w-full p-3 rounded-lg text-left font-medium transition ${
              selectedTab === item.key
                ? "bg-primary-100 text-primary-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => {
              onSelect(item.key);
              setDrawerOpen(false);
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  function formatDateTimeFun(isoString) {
    if (!isoString) return "";

    const date = new Date(isoString);

    // Day and short month
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" }); // e.g., "Sep"
    const year = date.getFullYear();

    // Time in 24-hour format with AM/PM
    let hours = date.getHours(); // 0-23
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // convert 0 to 12 for 12 AM/PM
    const time = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;

    return `${day} ${month} ${year}, ${time}`;
  }

  function getLastFiveReversed(arr) {
    if (!Array.isArray(arr)) return [];
    // Take last 5 elements and reverse
    return arr.slice(-5).reverse();
  }
  // total spent by user get here
  function totalSpentByUser(data) {
    const newArray = transactions.filter((e) => e.userId == data._id);
    const totalSpent = newArray.filter((e) => e.type == "Expense");
    return totalSpent.reduce((sum, txn) => sum + txn.amount, 0);
  }

  // totla income by user get here
  function totalIncomeByUser(data) {
    const newArray = transactions.filter((e) => e.userId == data._id);
    const totalSpent = newArray.filter((e) => e.type == "Income");
    return totalSpent.reduce((sum, txn) => sum + txn.amount, 0);
  }
  return (
    <div className="min-h-screen flex bg-gray-50">
      {loading ? <Loading /> : null}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex sticky top-4 h-[calc(100vh-2rem)] p-2">
        <Sidebar onSelect={setSelectedTab} />
      </aside>

      {/* Mobile Drawer */}
      <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen} placement="left">
  <DrawerContent
    className="
      w-full sm:w-80 md:w-64 
      h-full 
      max-w-xs sm:max-w-sm md:max-w-md
    "
  >
    <DrawerHeader className="flex justify-between items-center border-b">
      <h3 className="font-bold text-lg">Menu</h3>
      {/* Show close button only on mobile */}
      <Button
        variant="light"
        onPress={() => setDrawerOpen(false)}
        className="sm:hidden"
      >
        <XIcon className="w-6 h-6" />
      </Button>
    </DrawerHeader>

    <DrawerBody>
      <Sidebar onSelect={setSelectedTab} />
    </DrawerBody>
  </DrawerContent>
</Drawer>


      {/* Main content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Mobile header */}
        <div className="flex items-center justify-between md:hidden mb-4">
          <h1 className="text-2xl font-bold capitalize">{selectedTab}</h1>
          <Button variant="light" onPress={() => setDrawerOpen(true)}>
            <MenuIcon className="w-6 h-6" />
          </Button>
        </div>

        {/* Header + Add button for desktop */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold capitalize">{selectedTab}</h1>
          <p className="font-bold">
            Expence <span className=" font-light">Tracker</span>
          </p>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="shadow-sm hover:shadow-md transition text-center">
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Total Users
                  </h2>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    {totalUsers}
                  </p>
                </CardBody>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition text-center">
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Transactions
                  </h2>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {totalTransactions}
                  </p>
                </CardBody>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition text-center">
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-700">
                    Revenue
                  </h2>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    ₹{totalRevenue}
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-md">
              <CardHeader>
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
              </CardHeader>
              <CardBody>
                <Table removeWrapper>
                  <TableHeader>
                    <TableColumn>Category</TableColumn>
                    <TableColumn>User</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Note</TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Method</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {getLastFiveReversed(transactions).map((txn) => (
                      <TableRow key={txn._id}>
                        <TableCell>{txn.category}</TableCell>
                        <TableCell>
                          {users
                            .filter((e) => txn.userId == e._id)[0]
                            .name.charAt(0)
                            .toUpperCase() +
                            users
                              .filter((e) => txn.userId == e._id)[0]
                              .name.slice(1)
                              .toLowerCase()}
                        </TableCell>
                        <TableCell className={` ${txn.type == "Income" ? " text-green-500" : " text-red-500"}`}>
                          {users.filter((e) => txn.userId == e._id)[0]
                            .currency + " "}
                          {txn.amount}
                        </TableCell>
                        <TableCell>
                          <span className={"px-2 py-1  text-xs font-medium "}>
                            {txn.note}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDateTimeFun(txn.createdAt)}
                        </TableCell>
                        <TableCell
                          className={` ${
                            txn.type == "Income"
                              ? " text-green-500"
                              : " text-red-500"
                          }`}
                        >
                          {txn.type}
                        </TableCell>
                        <TableCell>{txn.method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === "users" && (
          <Card className="shadow-md">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">User Profiles</h2>
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                startContent={<SearchIcon className="w-4 h-4 text-gray-500" />}
                className="w-40 sm:w-56"
              />
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg shadow hover:shadow-md transition"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleUserClick(user)}
                    >
                      <Avatar  size="md" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteUser(user._id)}
                    >
                      <Trash2Icon className="w-4 h-4" /> 
                    </Button>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No users found.
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Transactions Tab */}
        {selectedTab === "transactions" && (
          <Card className="shadow-md">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">All Transactions</h2>
              <Input
                placeholder="Search transactions..."
                value={txnSearch}
                onChange={(e) => setTxnSearch(e.target.value)}
                startContent={<SearchIcon className="w-4 h-4 text-gray-500" />}
                className="w-40 sm:w-56"
              />
            </CardHeader>
            <CardBody>
              <Table removeWrapper>
                <TableHeader>
                  <TableColumn>Category</TableColumn>
                  <TableColumn>User</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>Note</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Type</TableColumn>
                  <TableColumn>Method</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((txn) => (
                    <TableRow key={txn._id}>
                      <TableCell>{txn.category}</TableCell>
                      <TableCell>
                        {users
                          .filter((e) => txn.userId == e._id)[0]
                          .name.charAt(0)
                          .toUpperCase() +
                          users
                            .filter((e) => txn.userId == e._id)[0]
                            .name.slice(1)
                            .toLowerCase()}
                      </TableCell>
                      <TableCell className={` ${txn.type == "Income" ? " text-green-500" : " text-red-500"}`}>
                        {users.filter((e) => txn.userId == e._id)[0].currency +
                          " "}
                        {txn.amount}
                      </TableCell>
                      <TableCell>
                        <span className={"px-2 py-1  text-xs font-medium "}>
                          {txn.note}
                        </span>
                      </TableCell>
                      <TableCell>{formatDateTimeFun(txn.createdAt)}</TableCell>
                      <TableCell
                        className={`  ${
                          txn.type == "Income"
                            ? " text-green-500"
                            : " text-red-500"
                        }`}
                      >
                        {txn.type}
                      </TableCell>
                      <TableCell>{txn.method}</TableCell>
                    </TableRow>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-500"
                      >
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </main>

      {/* User Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold">User Details</h3>
          </ModalHeader>
          <ModalBody>
            {selectedUser && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar src={selectedUser.avatar} size="lg" />
                  <div>
                    <p className="font-semibold">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <p>
                  <span className="font-medium">Joined:</span>{" "}
                  {formatDateTimeFun(selectedUser.createdAt)}
                </p>
                <p>
                  <span className="font-medium">Total Spent:</span>{" "}
                  {selectedUser.currency + " "}
                  {totalSpentByUser(selectedUser)}
                </p>
                <p>
                  <span className="font-medium">Total Income:</span>
                  {selectedUser.currency + " "}
                  {totalIncomeByUser(selectedUser)}
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="solid" color="danger" onPress={() => setIsOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
