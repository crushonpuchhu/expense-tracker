"use client";
import { useState } from "react";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Tabs,
  Tab,
} from "@heroui/react";

export default function AdminPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Mittal",
      email: "mittal@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 2,
      name: "Ravi",
      email: "ravi@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Admin",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
    },
  ]);

  const [issues] = useState([
    {
      id: 1,
      user: "Ravi",
      issue: "Payment not working",
      status: "Open",
      priority: "High",
    },
    {
      id: 2,
      user: "Mittal",
      issue: "Category not saving",
      status: "Resolved",
      priority: "Medium",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
   
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        <Tabs
          aria-label="Admin Sections"
          color="primary"
          className="bg-white shadow rounded-lg p-4"
        >
          {/* Manage Users */}
          <Tab key="users" title="Manage Users">
            <div className="mb-4 flex gap-4">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <Table
              aria-label="Users Table"
              className="mt-4 shadow-md rounded-lg overflow-hidden"
            >
              <TableHeader className="bg-blue-50">
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow
                    key={u.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      >
                        <option value="User">User</option>
                        <option value="Moderator">Moderator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        value={u.status}
                        onChange={(e) =>
                          handleStatusChange(u.id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Banned">Banned</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => deleteUser(u.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>

          {/* Analytics */}
          <Tab key="analytics" title="Usage Analytics">
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-5">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  Total Users
                </h2>
                <p className="text-2xl font-bold mb-3">{users.length}</p>
                <Progress
                  value={
                    (users.filter((u) => u.status === "Active").length /
                      users.length) *
                    100
                  }
                  color="success"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {users.filter((u) => u.status === "Active").length} active
                  users
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-5">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  Transactions Logged
                </h2>
                <p className="text-2xl font-bold mb-3">1,500</p>
                <Progress value={60} color="primary" />
              </div>
              <div className="bg-white shadow rounded-lg p-5">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  Issues Reported
                </h2>
                <p className="text-2xl font-bold mb-3">{issues.length}</p>
                <Progress
                  value={
                    (issues.filter((i) => i.status !== "Resolved").length /
                      issues.length) *
                    100
                  }
                  color="warning"
                />
              </div>
            </div>
          </Tab>

          {/* Reported Issues */}
          <Tab key="issues" title="Reported Issues">
            <Table
              aria-label="Issues Table"
              className="mt-4 shadow-md rounded-lg overflow-hidden"
            >
              <TableHeader className="bg-yellow-50">
                <TableColumn>User</TableColumn>
                <TableColumn>Issue</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Priority</TableColumn>
              </TableHeader>
              <TableBody>
                {issues.map((i) => (
                  <TableRow
                    key={i.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{i.user}</TableCell>
                    <TableCell>{i.issue}</TableCell>
                    <TableCell>{i.status}</TableCell>
                    <TableCell>{i.priority}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
        </Tabs>
      </div>
    
  );
}
