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

// Pie chart data
// const categoryData = [
//   { name: "Food", value: 400, color: "#3B82F6" }, // blue
//   { name: "Travel", value: 300, color: "#22C55E" }, // green
//   { name: "Bills", value: 200, color: "#F97316" }, // orange
//   { name: "Shopping", value: 250, color: "#EF4444" }, // red
//   { name: "Others", value: 150, color: "#A855F7" }, // purple
// ];

// Line chart data
// const expenseTrendData = [
//   { month: "Jan", income: 3500, expense: 2100 },
//   { month: "Feb", income: 3400, expense: 2000 },
//   { month: "Mar", income: 3600, expense: 2200 },
//   { month: "Apr", income: 3700, expense: 2300 },
// ];

export default function DashboardPage() {
  // all data
  const [alldata,Setalldata]=useState([]);
  // mounthly data 
  const [userTranction, SetuserTranction] = useState([]);

  // chart mouthly data 
  const [categoryData, SetcategoryData] = useState([]);
  // all data chart or map
  const[expenseTrendData,SetexpenseTrendData]=useState([]);

  useEffect(() => {
    //  fetch user tranction
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions"); // 👈 create this route in backend
        const data = await res.json();
        if (res.ok) {
           Setalldata(data.transactions);
          const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2024-09"
         
          const filteredTransactions = data.transactions.filter((transaction) =>
            transaction.date.startsWith(currentMonth)
          );

          SetuserTranction(filteredTransactions); // 👈 define state: const [transactions, SetTransactions] = useState([]);
        } else {
          addToast({
            title: "error",
            description: data.message,
            color: "danger",
          });
        }
      } catch (err) {
        addToast({
          title: "error",
          description: "failed to load transactions",
          color: "danger",
        });
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    
    function SETcategoryData() {

   function getRandomColor(darkMode = false) {
  // Predefined palette of bright, beautiful colors
  const baseColors = [
    "#F97316", // orange
    "#FACC15", // mustard/yellow
    "#3B82F6", // royal blue
    "#EF4444", // red
    "#10B981", // green
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#14B8A6", // teal
  ];

  // Keep a static shuffled copy of colors to ensure uniqueness
  if (!getRandomColor.colors || getRandomColor.colors.length === 0) {
    getRandomColor.colors = [...baseColors].sort(() => Math.random() - 0.5);
  }

  // Take the next color from the array
  let color = getRandomColor.colors.shift();

  if (darkMode) {
    // Convert hex to RGB
    const hex = color.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Brighten slightly for dark background
    r = Math.min(255, r + 50);
    g = Math.min(255, g + 50);
    b = Math.min(255, b + 50);

    color = `rgb(${r}, ${g}, ${b})`;
  }

  return color;
}


      if (userTranction && userTranction.length > 0) {
        const categoryMap = {};

        userTranction.forEach((transaction) => {
          const category = transaction.category;
          const amount = Number(transaction.amount); // ensure numeric

          if (categoryMap[category]) {
            categoryMap[category].value += amount; // sum amount
          } else {
            categoryMap[category] = {
              name: category,
              value: amount,
              color: getRandomColor(),
            };
          }
        });

        const newArray = Object.values(categoryMap);
        SetcategoryData(newArray);
      } else {
        SetcategoryData([]);
      }
    }

    SETcategoryData();
  }, [userTranction]);

  //   useEffect(() => {
  //   if (alldata && alldata.length > 0) {
  //     const grouped = {};

  //     alldata.forEach((transaction) => {
  //       const dateObj = new Date(transaction.date);
  //       const monthName = dateObj.toLocaleString("en-US", { month: "short" }); // Jan, Feb, ...

  //       if (!grouped[monthName]) {
  //         grouped[monthName] = { income: 0, expense: 0 };
  //       }

  //       if (transaction.type === "Income") {
  //         grouped[monthName].income += Number(transaction.amount);
  //       } else if (transaction.type === "Expense") {
  //         grouped[monthName].expense += Number(transaction.amount);
  //       }
  //     });

  //     const trendArray = Object.keys(grouped).map((month) => ({
  //       month,
  //       income: grouped[month].income,
  //       expense: grouped[month].expense,
  //     }));

  //     SetexpenseTrendData(trendArray);
      
  //   }
  // }, [alldata]);

  useEffect(() => {
  if (alldata && alldata.length > 0) {
    const grouped = {};
    const currentYear = new Date().getFullYear();

    alldata.forEach((transaction) => {
      const dateObj = new Date(transaction.date);
      const year = dateObj.getFullYear();

      // 🔹 Only include current year transactions
      if (year === currentYear) {
        const monthName = dateObj.toLocaleString("en-US", { month: "short" }); // Jan, Feb...
        if (!grouped[monthName]) {
          grouped[monthName] = { month: monthName, income: 0, expense: 0 };
        }

        if (transaction.type === "Income") {
          grouped[monthName].income += Number(transaction.amount);
        } else if (transaction.type === "Expense") {
          grouped[monthName].expense += Number(transaction.amount);
        }
      }
    });

    // 🔹 Sort months in order
    const trendArray = Object.values(grouped).sort((a, b) => {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

    SetexpenseTrendData(trendArray);
  }
}, [alldata]);



  if(expenseTrendData!=[])
  {
    console.log(expenseTrendData)
  }


  // calculate data
  function DataSummery(type) {
   
    if (type == "mounth income") {
      return userTranction.reduce((total, e) => {
        if (e.type == "Income") {
          return (total = total + Number(e.amount));
        }
        return total;
      }, 0);
    }

    if (type == "total expence") {
      return userTranction.reduce((total, e) => {
        if (e.type == "Expense") {
          return (total = total + Number(e.amount));
        }
        return total;
      }, 0);
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar shouldHideOnScroll>
        <NavbarBrand>
          <h1 className="font-bold text-xl">
            Expense <span className=" font-light ">Tracker</span>
          </h1>
        </NavbarBrand>
        <NavbarContent justify="center">
          <NavbarItem>
            <a href="#">Dashboard</a>
          </NavbarItem>
          <NavbarItem>
            <a href="/Transactions">Transactions</a>
          </NavbarItem>
          <NavbarItem>
            <a href="/Budget">Budgets</a>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <Link href="/Profile">
            <Avatar
             
              as="button"
              color="primary"
              name="Profile"
              size="sm"
              
             alt="Profile"
            />
          </Link>
        </NavbarContent>
      </Navbar>

      {/* Content */}
      <main className="p-6 space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card shadow="sm">
            <CardHeader>Total Balance</CardHeader>
            <CardBody>
              <p className="text-2xl font-bold">
               
                {"₹ "}
                {userTranction != [] ? DataSummery("mounth income")-DataSummery("total expence") : 0}
              </p>
            </CardBody>
          </Card>
          <Card shadow="sm">
            <CardHeader>Monthly Income</CardHeader>
            <CardBody>
              <p className="text-2xl font-bold text-green-600">
                {"₹ "}
                {userTranction != [] ? DataSummery("mounth income") : 0}
              </p>
            </CardBody>
          </Card>
          <Card shadow="sm">
            <CardHeader>Monthly Expenses</CardHeader>
            <CardBody>
              <p className="text-2xl font-bold text-red-600">
                {"₹ "}
                {userTranction != [] ? DataSummery("total expence") : 0}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>Spending by Category</CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={250}>
                {categoryData && categoryData.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-52 text-gray-500">
                    No transaction data
                  </div>
                )}
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

        {/* Transactions */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="font-medium">Recent Transactions</h3>
            <Link href={"/Transactions"}>
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
                {userTranction.map((t, idx) => (
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
