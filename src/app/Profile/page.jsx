"use client";
import { useState, useEffect, useTransition } from "react";
import {
  Input,
  Button,
  Avatar,
  Divider,
  Switch,
  addToast,
  Alert,
  Skeleton,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import Loading from "../../component/LodingUi/Loding.jsx";

export default function ProfileSettings() {
  const router = useRouter();

  const [load, Setload] = useState(false);
  const [userdata, Setuserdata] = useState({});
  const [userTranction, SetuserTranction] = useState([]);

  const [name, Setname] = useState("");
  const [password, Setpassword] = useState("");
  const [currentpassword, Setcurrentpassword] = useState("");

  useEffect(() => {
    //   user data get
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          Setuserdata(data.user);
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

    //  fetch user tranction
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions"); // 👈 create this route in backend
        const data = await res.json();
        if (res.ok) {
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

    fetchProfile();
    fetchTransactions();
  }, []);

  // Normal logout
  const handleLogout = async () => {
    Setload(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      Setload(false);

      if (res.ok) {
        addToast({
          title: "Logged out",
          description: data.message,
          color: "success",
        });
        window.location.href = "/";
        // router.push("/"); // redirect to home
      } else {
        addToast({
          title: "Error",
          description: "Failed to logout",
          color: "danger",
        });
      }
    } catch (err) {
      Setload(false);
      addToast({
        title: "Error",
        description: "Something went wrong! Try again.",
        color: "danger",
      });
    }
  };

  // Logout from all devices
  const handleLogoutAll = async () => {
    Setload(true);
    try {
      const res = await fetch("/api/auth/logout?all=true", { method: "POST" });
      const data = await res.json();
      Setload(false);

      if (res.ok) {
        addToast({
          title: "Logged out",
          description: data.message,
          color: "success",
        });
        window.location.href = "/";
        // router.push("/"); // redirect to home
      } else {
        addToast({
          title: "Error",
          description: "Failed to logout from all devices",
          color: "danger",
        });
      }
    } catch (err) {
      Setload(false);
      addToast({
        title: "Error",
        description: "Something went wrong! Try again.",
        color: "danger",
      });
    }
  };

  // name update
  async function handleUpdateName() {
    if (name != "") {
      Setload(true);

      try {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name }),
        });

        const data = await res.json();
        Setload(false);
        if (res.ok) {
          addToast({
            title: "update",
            description: data.message,
            color: "success",
          });
          window.location.reload();
        } else {
          addToast({
            title: "error",
            description: "update failed",
            color: "danger",
          });
        }
      } catch (e) {
        Setload(false);
        addToast({
          title: "error",
          description: "somthing went wrong",
          color: "danger",
        });
      }
    } else {
      addToast({
        title: "error",
        description: "Name field requried",
        color: "danger",
      });
    }
  }

  // password update
  async function handleUpdatePassword() {
    if (password != "" && currentpassword != "") {
      Setload(true);
      try {
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPassword: password,
            currentPassword: currentpassword,
          }),
        });

        const data = await res.json();
        Setload(false);
        if (res.ok) {
          addToast({
            title: "update",
            description: data.message,
            color: "success",
          });
          window.location.reload();
        } else {
          addToast({
            title: "error",
            description: data.error,
            color: "danger",
          });
        }
      } catch (e) {
        Setload(false);
        addToast({
          title: "error",
          description: "somthing went wrong",
          color: "danger",
        });
      }
    } else {
      addToast({
        title: "error",
        description: "All password field requried",
        color: "danger",
      });
    }
  }

  // delete account parmanantly
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action is permanent!"
    );
    if (!confirmDelete) return;

    Setload(true);
    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      const data = await res.json();
      Setload(false);

      if (res.ok) {
        addToast({
          title: "Account Deleted",
          description: data.message,
          color: "success",
        });
        window.location.href = "/";
      } else {
        addToast({
          title: "Error",
          description: data.error || "Failed to delete account",
          color: "danger",
        });
      }
    } catch (err) {
      Setload(false);
      addToast({
        title: "Error",
        description: "Something went wrong! Try again later.",
        color: "danger",
      });
      console.error(err);
    }
  };

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

  function calculateUsedPercentage(income, spent) {
    if (income === 0) return 0; // to avoid division by zero
    const percentage = (spent / income) * 100;
    return percentage.toFixed(2); // returns value with 2 decimal places
  }

  const percentage = calculateUsedPercentage(
    DataSummery("mounth income"),
    DataSummery("total expence")
  );

  function getBarColor() {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-400";
    return "bg-red-500";
  }

  // Most frequent transaction method code -------->
  function getMostFrequentTransactionMethod(transactions) {
    if (!Array.isArray(transactions) || transactions.length === 0) return null;

    const counts = transactions.reduce((acc, { method }) => {
      if (method) acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    const [method, count] = Object.entries(counts).reduce((a, b) =>
      b[1] > a[1] ? b : a
    );

    return { method, count };
  }
  const mostFrequent = getMostFrequentTransactionMethod(userTranction);
  //---------------------->

  // random color for Aavtar background----------------------->
  function getRandomGradient() {
    const colors = [
  "#6366F1", // Indigo glow
  "#8B5CF6", // Soft purple
  "#EC4899", // Pink accent
  "#F59E0B", // Amber warmth
  "#10B981", // Emerald green
  "#06B6D4", // Cyan mint
  "#3B82F6", // Classic blue
  "#14B8A6", // Teal modern
  "#A855F7", // Vivid violet
  "#E879F9", // Light magenta
  "#F472B6", // Soft rose
  "#38BDF8", // Sky blue
];


    const c1 = colors[Math.floor(Math.random() * colors.length)];
    const c2 = colors[Math.floor(Math.random() * colors.length)];

    return `linear-gradient(135deg, ${c1}, ${c2})`;
  }
  const [avatarGradient, setAvatarGradient] = useState(null);

  // ✅ add this inside your component, right after useState definitions
  useEffect(() => {
    // Runs only on client — avoids hydration mismatch
    setAvatarGradient(getRandomGradient());
  }, []);

  //----------------------------------------------->
  
  return (
    <>
      <div className="max-w-3xl mx-auto p-6 space-y-10">
        {/* Header */}
        {load ? <Loading /> : null}
        <div className="flex items-center gap-4">
          <Avatar
            name={
              userdata.name ? userdata.name.charAt(0).toUpperCase() : "user"
            }
            size="lg"
            radius="full"
            style={{
              backgroundImage:
                avatarGradient || "linear-gradient(135deg, #ccc, #999)",
              color: "white",
            }}
          />
          <div>
            <h2 className="text-2xl font-semibold">{userdata.name}</h2>
            <p className="text-gray-500">{userdata.email}</p>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
            <h4 className="text-sm text-gray-500">Balance</h4>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {userdata.currency + " "}
              {userTranction != []
                ? DataSummery("mounth income") - DataSummery("total expence")
                : 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/40">
            <h4 className="text-sm text-gray-500">Income</h4>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
              {/* $8,000 mounth income */}
              {userdata.currency + " "}
              {userTranction != [] ? DataSummery("mounth income") : 0}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/40">
            <h4 className="text-sm text-gray-500">Expenses</h4>
            <p className="text-xl font-semibold text-red-600 dark:text-red-400">
              {userdata.currency + " "}
              {userTranction != [] ? DataSummery("total expence") : 0}
            </p>
          </div>
        </div>
        {/* percentage c
      show */}

        {userTranction.length > 0 ? (
          <div className="   space-y-10">
            {" "}
            <div className="w-full p-2  dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Income Used
                </span>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 h-4 rounded-lg overflow-hidden">
                <div
                  className={`${getBarColor()} h-4 rounded-lg transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
            <Alert
              color="warning"
              title={` You Used ${percentage}% of your Income on this mounth`}
            />
            <Alert
              color="success"
              title={
                mostFrequent
                  ? `Most frequent transaction method used by you is: ${mostFrequent.method}, ${mostFrequent.count} times`
                  : "No transactions found yet."
              }
            />
          </div>
        ) : null}

        <Divider />

        {/* Update Profile */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Update Profile</h3>
          <Input
            onChange={(e) => {
              Setname(e.target.value);
            }}
            label="Name"
            placeholder={userdata.name}
          />
          <Button
            onPress={() => {
              handleUpdateName();
            }}
            color="primary"
            className="w-fit"
          >
            Save Changes
          </Button>
        </section>

        <Divider />

        {/* Change Password */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          <Input
            type="password"
            label="Current Password"
            placeholder="••••••••"
            onChange={(e) => {
              Setcurrentpassword(e.target.value);
            }}
          />

          <Input
            type="password"
            label="New Password"
            placeholder="••••••••"
            onChange={(e) => {
              Setpassword(e.target.value);
            }}
          />
          <Button
            onPress={() => {
              handleUpdatePassword();
            }}
            color="primary"
            className="w-fit"
          >
            Update Password
          </Button>
        </section>

        <Divider />

        {/* Manage Account */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Manage Account</h3>
          <div className="flex gap-3">
            <Button onPress={handleDeleteAccount} color="danger" variant="flat">
              Delete Account
            </Button>
            <Button onPress={handleLogout} color="default" variant="ghost">
              Logout
            </Button>
            <Button onPress={handleLogoutAll} color="warning" variant="flat">
              Logout from All Devices
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
