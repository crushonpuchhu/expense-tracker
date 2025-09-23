"use client";
import { useState, useEffect, useTransition } from "react";
import {
  Input,
  Button,
  Avatar,
  Divider,
  Switch,
  addToast,
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
        window.location.href='/';
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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* Header */}
      {load ? <Loading /> : null}
      <div className="flex items-center gap-4">
        <Avatar
          name={userdata.name ? userdata.name.charAt(0).toUpperCase() : "user"}
          size="lg"
          radius="full"
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
            {"₹ "}
            {userTranction != []
              ? DataSummery("mounth income") - DataSummery("total expence")
              : 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/40">
          <h4 className="text-sm text-gray-500">Income</h4>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">
            {/* $8,000 mounth income */}
            {"₹ "}
            {userTranction != [] ? DataSummery("mounth income") : 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/40">
          <h4 className="text-sm text-gray-500">Expenses</h4>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">
            {"₹ "}
            {userTranction != [] ? DataSummery("total expence") : 0}
          </p>
        </div>
      </div>

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
  );
}
