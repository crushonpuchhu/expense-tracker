"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  Film,
  Plus,
  Filter,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
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

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Navbar from "../../component/Nav/ResponsiveNavbar";

export default function DashboardPage() {
  // API / data state
  const [allData, setAllData] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [expenseTrendData, setExpenseTrendData] = useState([]);
  const [whichCurrentSymlobe, SetwhichCurrentSymlobe] = useState("");

  // animated counters state and targets
  const [animatedValues, setAnimatedValues] = useState({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });
  const targetsRef = useRef({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });

  // Fetch transactions + profile
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          addToast({
            title: "Error",
            description: data.message,
            color: "danger",
          });
          return;
        }

        setAllData(data.transactions);

        const currentMonth = new Date().toISOString().slice(0, 7);
        const filteredTransactions = data.transactions.filter((t) =>
          t.date.startsWith(currentMonth)
        );
        setUserTransactions(filteredTransactions);
      } catch (err) {
        addToast({
          title: "Error",
          description: "Failed to load transactions",
          color: "danger",
        });
      }

      // user profile data (currency)
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          SetwhichCurrentSymlobe(data.user.currency || "");
        } else {
          addToast({
            title: "Error",
            description: data.error,
            color: "danger",
          });
        }
      } catch (err) {
        addToast({
          title: "Error",
          description: "Something went wrong",
          color: "danger",
        });
      }
    };

    fetchTransactions();
  }, []);

  // Compute category data from userTransactions
  useEffect(() => {
    if (!userTransactions.length) {
      setCategoryData([]);
      return;
    }

    const categoryMap = {};
    function generateUniqueColor() {
      const used = (generateUniqueColor.used ??= new Set());
      let c;
      do
        c =
          "#" +
          (~~(Math.random() * 16777215))
            .toString(16)
            .padStart(6, "0")
            .toUpperCase();
      while (used.has(c));
      used.add(c);
      return c;
    }

    userTransactions.forEach((t) => {
      const category = t.category || "Uncategorized";
      const amount = Math.abs(Number(t.amount || 0));
      if (categoryMap[category]) {
        categoryMap[category].value += amount;
      } else {
        categoryMap[category] = {
          name: category,
          value: amount,
          color: generateUniqueColor() || "#000000",
        };
      }
    });

    setCategoryData(Object.values(categoryMap));
  }, [userTransactions]);

  // Generate expense trend data (current year) from allData
  useEffect(() => {
    if (!allData.length) {
      setExpenseTrendData([]);
      return;
    }

    const currentYear = new Date().getFullYear();
    const grouped = {};

    allData.forEach((t) => {
      const dateObj = new Date(t.date);
      if (dateObj.getFullYear() !== currentYear) return;
      const monthName = dateObj.toLocaleString("en-US", { month: "short" });
      if (!grouped[monthName])
        grouped[monthName] = { month: monthName, income: 0, expense: 0 };

      if (t.type === "Income") grouped[monthName].income += Number(t.amount);
      else grouped[monthName].expense += Math.abs(Number(t.amount));
    });

    const monthsOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const trendArray = monthsOrder
      .map((m) => grouped[m] || { month: m, income: 0, expense: 0 })
      .slice(0); // keep order
    setExpenseTrendData(trendArray);
  }, [allData]);

  // Update animated targets whenever data changes
  useEffect(() => {
    // compute totals from current month userTransactions
    const income = userTransactions.reduce(
      (sum, t) => (t.type === "Income" ? sum + Number(t.amount) : sum),
      0
    );
    const expenses = userTransactions.reduce(
      (sum, t) => (t.type === "Expense" ? sum + Math.abs(Number(t.amount)) : sum),
      0
    );
    const savings = Math.max(0, income - expenses);
    const totalBalance = income - expenses;

    targetsRef.current = {
      totalBalance: Math.round(totalBalance),
      income: Math.round(income),
      expenses: Math.round(expenses),
      savings: Math.round(savings),
    };

    // animate from current animatedValues to targets
    const duration = 1200;
    const steps = 60;
    const increment = duration / steps;
    let currentStep = 0;

    const start = { ...animatedValues };
    const diff = {
      totalBalance: targetsRef.current.totalBalance - start.totalBalance,
      income: targetsRef.current.income - start.income,
      expenses: targetsRef.current.expenses - start.expenses,
      savings: targetsRef.current.savings - start.savings,
    };

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        totalBalance: Math.round(start.totalBalance + diff.totalBalance * easeOut),
        income: Math.round(start.income + diff.income * easeOut),
        expenses: Math.round(start.expenses + diff.expenses * easeOut),
        savings: Math.round(start.savings + diff.savings * easeOut),
      });

      if (currentStep >= steps) clearInterval(timer);
    }, increment);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTransactions]);

  // simple chart sample fallback if no data
  const chartData = expenseTrendData.length
    ? expenseTrendData.map((d) => ({ ...d }))
    : [ // fallback demo months
        { month: "Jan", income: 0, expense: 0 },
        { month: "Feb", income: 0, expense: 0 },
        { month: "Mar", income: 0, expense: 0 },
        { month: "Apr", income: 0, expense: 0 },
        { month: "May", income: 0, expense: 0 },
        { month: "Jun", income: 0, expense: 0 },
        { month: "Jul", income: 0, expense: 0 },
        { month: "Aug", income: 0, expense: 0 },
        { month: "Sep", income: 0, expense: 0 },
        { month: "Oct", income: 0, expense: 0 },
        { month: "Nov", income: 0, expense: 0 },
        { month: "Dec", income: 0, expense: 0 },
      ];

  // Diwali decorations (top only) - small diyas + subtle fireworks
  useEffect(() => {
    // create diyas container inside this component (not body) for easier cleanup
    const root = document.getElementById("diwali-decorations-root");
    if (!root) return;

    // create floating diyas
    const diyas = [];
    for (let i = 0; i < 7; i++) {
      const d = document.createElement("div");
      d.className = "diya animate-float";
      d.style.left = `${(i / 7) * 100}%`;
      d.style.animationDelay = `${i * 0.35}s`;
      root.appendChild(d);
      diyas.push(d);
    }

    // random fireworks appended to root periodically
    const fwInterval = setInterval(() => {
      const firework = document.createElement("div");
      firework.className = "firework";
      firework.style.left = `${10 + Math.random() * 80}%`;
      firework.style.top = `${2 + Math.random() * 10}vh`;
      root.appendChild(firework);
      setTimeout(() => firework.remove(), 1400);
    }, 1100);

    return () => {
      clearInterval(fwInterval);
      diyas.forEach((d) => d.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* decorations root (top overlay) */}
      <div
        id="diwali-decorations-root"
        className="pointer-events-none fixed top-0 left-0 w-full z-40 overflow-visible"
        style={{ height: "120px" }}
      ></div>

      <Navbar />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Expense Tracker</h1>
            <p className="text-sm text-slate-600">Welcome back — here’s your financial overview.</p>
          </div>

          <div className="flex gap-3 items-center">
           
            <Link href="/Transactions">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                <Plus className="w-4 h-4" /> <span>Add Expense</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats cards (light themed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Balance */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Balance</p>
                </div>
              </div>
              <div className={`text-sm font-medium ${animatedValues.totalBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {animatedValues.totalBalance >= 0 ? "+" : "-"}
              </div>
            </div>
            <p className="text-2xl font-bold">{whichCurrentSymlobe} {animatedValues.totalBalance.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">This month</p>
          </div>

          {/* Income */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Income</p>
                </div>
              </div>
              <div className="text-sm font-medium text-green-600">+{/* placeholder */} </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{whichCurrentSymlobe} {animatedValues.income.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Received this month</p>
          </div>

          {/* Expenses */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50">
                  <CreditCard className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Expenses</p>
                </div>
              </div>
              <div className="text-sm font-medium text-red-600">-</div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{whichCurrentSymlobe} {animatedValues.expenses.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Spent this month</p>
          </div>

          {/* Savings */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <TrendingDown className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Savings</p>
                </div>
              </div>
              <div className="text-sm font-medium text-amber-600">+{""}</div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{whichCurrentSymlobe} {animatedValues.savings.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Estimated</p>
          </div>
        </div>

        {/* Charts & categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Spending Overview</h3>
              </div>
            </CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#22C55E" />
                    <Line type="monotone" dataKey="expense" stroke="#EF4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Spending by Category</CardHeader>
            <CardBody>
              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height={250}>
                  {categoryData.length ? (
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <div className="flex items-center justify-center h-52 text-gray-500">No transaction data</div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="font-medium">Recent Transactions</h3>
            <Link href="/Transactions">
              <Button color="primary">Add Expense</Button>
            </Link>
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
                {userTransactions.slice(0, 5).map((t) => (
                  <TableRow key={t._id || `${t.date}-${t.amount}`}>
                    <TableCell>{t.date ? t.date.split("T")[0] : "-"}</TableCell>
                    <TableCell>{t.note || t.description || "-"}</TableCell>
                    <TableCell>{t.category || "-"}</TableCell>
                    <TableCell className="font-semibold">
                      {whichCurrentSymlobe} {t.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </main>

      {/* Decorations CSS (diya + firework) */}
      <style jsx>{`
        /* diyas */
        #diwali-decorations-root .diya {
          position: absolute;
          top: 6px;
          transform: translateX(-50%);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #diwali-decorations-root .diya::before {
          content: "";
          width: 24px;
          height: 10px;
          background: #c4762b; /* clay base */
          border-radius: 12px 12px 6px 6px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
          position: absolute;
          bottom: 6px;
        }
        #diwali-decorations-root .diya::after {
          content: "";
          width: 6px;
          height: 10px;
          background: #ffd54a; /* flame */
          border-radius: 3px 3px 1px 1px;
          position: absolute;
          top: -4px;
          box-shadow: 0 0 8px rgba(255, 210, 70, 0.6);
          animation: flicker 1s infinite alternate;
        }

        @keyframes flicker {
          from {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          to {
            opacity: 0.6;
            transform: translateY(-2px) scaleY(0.95);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        #diwali-decorations-root .diya.animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* fireworks (simple expanding dot) */
        #diwali-decorations-root .firework {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: radial-gradient(circle, #fff9c4, #ff8a65 60%, transparent);
          box-shadow: 0 0 12px rgba(255, 138, 101, 0.8);
          transform: translate(-50%, -50%) scale(0);
          animation: explode 1.2s ease-out forwards;
          pointer-events: none;
        }

        @keyframes explode {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.2);
          }
          40% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
        }
      `}</style>
    </div>
  );
}
