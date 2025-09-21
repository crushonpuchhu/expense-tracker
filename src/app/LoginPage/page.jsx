"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  addToast,
} from "@heroui/react";
import Loading from "../../component/LodingUi/Loding.jsx";





export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Load, SetLoad] = useState(false);

  const handleSubmit = async () => {
  SetLoad(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await res.json();
    SetLoad(false);

    if (!res.ok) {
      return addToast({
        title: "Error",
        description: data.message || "Login failed",
        color: "danger",
      });
    }

    addToast({
      title: "Login",
      description: "Login successful!",
      color: "success",
    });
     

    
    
    // Get user info
    const userRes = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
    const userData = await userRes.json();

    if (!userRes.ok || !userData.user) {
      return addToast({
        title: "Error",
        description: "Failed to fetch user info",
        color: "danger",
      });
    }
     console.log(userData.user)
    // Role-based redirect
    if (userData.user.role === "admin") {
      router.push("/Admin");
      
     
    } else {
      router.push("/Dashboard");
     
      
    }

  } catch (error) {
    SetLoad(false);
    addToast({
      title: "Error",
      description: "Something went wrong",
      color: "danger",
    });
    console.error(error);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 px-4">
      {Load && <Loading />}
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white">
        <CardHeader className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Please login to continue</p>
        </CardHeader>

        <CardBody>
          <section className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              radius="lg"
              variant="bordered"
              isClearable
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              radius="lg"
              variant="bordered"
              required
            />

            <div className="flex justify-between items-center text-sm">
              <a href="/ForgotResetPassword" className="text-indigo-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold"
              radius="lg"
              onPress={() => {
                if (email && password) {
                  handleSubmit();
                } else {
                  addToast({
                    title: "Error",
                    description: "All fields required",
                    color: "danger",
                  });
                }
              }}
            >
              Log In
            </Button>
          </section>

          <div className="flex items-center my-6">
            <Divider className="flex-1" />
            <span className="px-2 text-gray-400 text-sm">or</span>
            <Divider className="flex-1" />
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a href="/CreateAccount" className="text-indigo-600 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
