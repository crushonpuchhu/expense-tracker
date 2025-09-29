"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
} from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from "@heroui/drawer";
import { Input } from "@heroui/input";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import {
  SearchIcon,
  UsersIcon,
  LayoutDashboardIcon,
  CreditCardIcon,
  Trash2Icon,
  MenuIcon,
  XIcon,
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [txnSearch, setTxnSearch] = useState("");

  // Mock Data
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", avatar: "https://i.pravatar.cc/60?u=john", joined: "2025-01-10", totalSpent: 1200 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", avatar: "https://i.pravatar.cc/60?u=jane", joined: "2025-02-05", totalSpent: 800 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", avatar: "https://i.pravatar.cc/60?u=mike", joined: "2025-03-12", totalSpent: 540 },
  ]);

  const [transactions, setTransactions] = useState([
    { id: "TXN001", user: "John Doe", amount: 250, status: "Completed", date: "2025-09-20" },
    { id: "TXN002", user: "Jane Smith", amount: 120, status: "Pending", date: "2025-09-21" },
    { id: "TXN003", user: "Mike Johnson", amount: 400, status: "Completed", date: "2025-09-22" },
    { id: "TXN004", user: "John Doe", amount: 150, status: "Completed", date: "2025-09-23" },
    { id: "TXN005", user: "Jane Smith", amount: 300, status: "Failed", date: "2025-09-24" },
  ]);

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
        t.user.toLowerCase().includes(txnSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(txnSearch.toLowerCase())
    );
  }, [txnSearch, transactions]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleDeleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const userName = users.find(u => u.id === id)?.name;
      setUsers(users.filter((u) => u.id !== id));
      setTransactions(transactions.filter((t) => t.user !== userName));
    }
  };

  const menuItems = [
    { key: "overview", label: "Overview", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { key: "users", label: "Users", icon: <UsersIcon className="w-5 h-5" /> },
    { key: "transactions", label: "Transactions", icon: <CreditCardIcon className="w-5 h-5" /> },
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
            onClick={() => { onSelect(item.key); setDrawerOpen(false); }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex sticky top-4 h-[calc(100vh-2rem)] p-2">
        <Sidebar onSelect={setSelectedTab} />
      </aside>

      {/* Mobile Drawer */}
      <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen} placement="left">
        <DrawerContent className="w-64">
          <DrawerHeader className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Menu</h3>
            <Button variant="light" onPress={() => setDrawerOpen(false)}><XIcon className="w-5 h-5" /></Button>
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
          <Button variant="light" onPress={() => setDrawerOpen(true)}><MenuIcon className="w-6 h-6" /></Button>
        </div>

        {/* Header + Add button for desktop */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold capitalize">{selectedTab}</h1>
          <p className="font-bold">Expence <span className=" font-light">Tracker</span></p>
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="shadow-sm hover:shadow-md transition text-center">
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
                  <p className="text-3xl font-bold text-primary-600">{totalUsers}</p>
                </CardBody>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition text-center">
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-700">Transactions</h2>
                  <p className="text-3xl font-bold text-primary-600">{totalTransactions}</p>
                </CardBody>
              </Card>
              <Card className="shadow-sm hover:shadow-md transition text-center">
                <CardBody>
                  <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
                  <p className="text-3xl font-bold text-green-600">${totalRevenue}</p>
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
                    <TableColumn>ID</TableColumn>
                    <TableColumn>User</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Date</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map(txn => (
                      <TableRow key={txn.id}>
                        <TableCell>{txn.id}</TableCell>
                        <TableCell>{txn.user}</TableCell>
                        <TableCell>${txn.amount}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            txn.status === "Completed" ? "bg-green-100 text-green-600" :
                            txn.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                          }`}>{txn.status}</span>
                        </TableCell>
                        <TableCell>{txn.date}</TableCell>
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
                {filteredUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg shadow hover:shadow-md transition">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleUserClick(user)}>
                      <Avatar src={user.avatar} size="lg" />
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="light" color="error" onPress={() => handleDeleteUser(user.id)}>
                      <Trash2Icon className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                ))}
                {filteredUsers.length === 0 && <p className="text-gray-500 text-center py-4">No users found.</p>}
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
                  <TableColumn>ID</TableColumn>
                  <TableColumn>User</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Date</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map(txn => (
                    <TableRow key={txn.id}>
                      <TableCell>{txn.id}</TableCell>
                      <TableCell>{txn.user}</TableCell>
                      <TableCell>${txn.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          txn.status === "Completed" ? "bg-green-100 text-green-600" :
                          txn.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                        }`}>{txn.status}</span>
                      </TableCell>
                      <TableCell>{txn.date}</TableCell>
                    </TableRow>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">No transactions found.</TableCell>
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
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                <p><span className="font-medium">Joined:</span> {selectedUser.joined}</p>
                <p><span className="font-medium">Total Spent:</span> ${selectedUser.totalSpent}</p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
