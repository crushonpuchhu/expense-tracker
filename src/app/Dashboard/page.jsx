"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  addToast,
} from "@heroui/react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [allData, setAllData] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [expenseTrendData, setExpenseTrendData] = useState([]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions", { credentials: "include" });
        const data = await res.json();

        if (!res.ok) {
          return addToast({ title: "Error", description: data.message, color: "danger" });
        }

        setAllData(data.transactions);

        const currentMonth = new Date().toISOString().slice(0, 7);
        const filteredTransactions = data.transactions.filter(t => t.date.startsWith(currentMonth));
        setUserTransactions(filteredTransactions);
      } catch (err) {
        addToast({ title: "Error", description: "Failed to load transactions", color: "danger" });
      }
    };
    fetchTransactions();
  }, []);

  // Generate category chart data
  useEffect(() => {
    if (!userTransactions.length) return setCategoryData([]);

    const categoryMap = {};
    const colors = ["#F97316","#FACC15","#3B82F6","#EF4444","#10B981","#8B5CF6","#EC4899","#14B8A6"];

    userTransactions.forEach(t => {
      const category = t.category;
      const amount = Number(t.amount);
      if (categoryMap[category]) {
        categoryMap[category].value += amount;
      } else {
        categoryMap[category] = { name: category, value: amount, color: colors.shift() || "#000000" };
      }
    });

    setCategoryData(Object.values(categoryMap));
  }, [userTransactions]);

  // Generate expense trend data (current year)
  useEffect(() => {
    if (!allData.length) return;

    const currentYear = new Date().getFullYear();
    const grouped = {};

    allData.forEach(t => {
      const dateObj = new Date(t.date);
      if (dateObj.getFullYear() !== currentYear) return;

      const monthName = dateObj.toLocaleString("en-US", { month: "short" });
      if (!grouped[monthName]) grouped[monthName] = { month: monthName, income: 0, expense: 0 };

      if (t.type === "Income") grouped[monthName].income += Number(t.amount);
      else grouped[monthName].expense += Number(t.amount);
    });

    const trendArray = Object.values(grouped).sort((a, b) => {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    setExpenseTrendData(trendArray);
  }, [allData]);

  // Calculate summary
  const calcSummary = (type) => {
    if (type === "monthlyIncome") return userTransactions.reduce((sum, t) => t.type === "Income" ? sum + Number(t.amount) : sum, 0);
    if (type === "monthlyExpense") return userTransactions.reduce((sum, t) => t.type === "Expense" ? sum + Number(t.amount) : sum, 0);
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar shouldHideOnScroll>
        <NavbarBrand><h1 className="font-bold text-xl">Expense <span className="font-light">Tracker</span></h1></NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem><a href="#">Dashboard</a></NavbarItem>
          <NavbarItem><a href="/Transactions">Transactions</a></NavbarItem>
          <NavbarItem><a href="/Budget">Budgets</a></NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <Link href="/Profile"><Avatar as="button" color="primary" name="Profile" size="sm" alt="Profile"/></Link>
        </NavbarContent>
      </Navbar>

      <main className="p-6 space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card shadow="sm"><CardHeader>Total Balance</CardHeader><CardBody><p className="text-2xl font-bold">₹{calcSummary("monthlyIncome") - calcSummary("monthlyExpense")}</p></CardBody></Card>
          <Card shadow="sm"><CardHeader>Monthly Income</CardHeader><CardBody><p className="text-2xl font-bold text-green-600">₹{calcSummary("monthlyIncome")}</p></CardBody></Card>
          <Card shadow="sm"><CardHeader>Monthly Expenses</CardHeader><CardBody><p className="text-2xl font-bold text-red-600">₹{calcSummary("monthlyExpense")}</p></CardBody></Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>Spending by Category</CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                {categoryData.length ? (
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                      {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (<div className="flex items-center justify-center h-52 text-gray-500">No transaction data</div>)}
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>Expense Trends</CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={expenseTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#22C55E" />
                  <Line type="monotone" dataKey="expense" stroke="#EF4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="font-medium">Recent Transactions</h3>
            <Link href="/Transactions"><Button color="primary">Add Expense</Button></Link>
          </CardHeader>
          <CardBody>
            <Table aria-label="Recent Transactions Table">
              <TableHeader>
                <TableColumn>Date</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn>Amount</TableColumn>
              </TableHeader>
              <TableBody>
                {userTransactions.map(t => (
                  <TableRow key={t._id}>
                    <TableCell>{t.date.split("T")[0]}</TableCell>
                    <TableCell>{t.note}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell className="font-semibold">₹{t.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
