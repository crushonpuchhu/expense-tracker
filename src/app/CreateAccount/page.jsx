"use client";
import Loding from "../../component/LodingUi/Loding.jsx";
import {
  Card,
  CardBody,
  Button,
  CardFooter,
  CardHeader,
  Input,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccount() {
     const router = useRouter();
  const [name, Setname] = useState("");
  const [email, Setemail] = useState("");
  const [password, SetPassword] = useState("");
  const [phonenummber, Setphonenummber] = useState("");
  const [currency, Setcurrency] = useState("");

  

  //   for loding
  const [IsLoderOpen, SetIsLoderOpen] = useState(false);

  async function handleSubmit() {
    const fome = {
      name: name,
      email: email,
      password: password,
      phoneNumber: phonenummber,
      currency: currency,
    };

    if (
      name != "" &&
      email != "" &&
      password != "" &&
      phonenummber != "" &&
      currency != ""
    ) {
       
      SetIsLoderOpen(true);

      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fome),
        });

        const data = await res.json();
        SetIsLoderOpen(false);
        console.log(data);
        console.log(data.message)

        if (data.message) {
          addToast({
            title: "profile Created",
            description: data.message,
            color: "success",
          });
          
          router.push("/LoginPage");
          // clear all inout value write code here

          Setname("");
          Setemail("");
          SetPassword("");
          Setphonenummber("");
          Setcurrency("");
        } else {
          addToast({
            title: "Error",
            description: data.error + " try again",
            color: "danger",
          });
          // clear input data
          Setname("");
          Setemail("");
          SetPassword("");
          Setphonenummber("");
          Setcurrency("");
        }
      } catch (err) {
        alert("⚠️ Server error, please try again.");
      }
    } else {
      addToast({
        title: "Error",
        description: " All field requried try again",
        color: "danger",
      });
    }
  }

  return (
    <div className="h-screen flex flex-col gap-6 items-center justify-center  bg-gradient-to-br from-white via-blue-50 to-blue-200  px-4">
      {/* Title */}
      {IsLoderOpen ? <Loding /> : null}
      <p className="font-bold text-4xl text-foreground">
        Expense <span className="font-light">Tracker</span>
      </p>

      {/* Card */}
      <Card className="w-[380px] max-md:w-[320px] shadow-2xl rounded-2xl p-4 bg-white">
        <CardHeader className="flex flex-col items-center space-y-1">
          <p className="font-bold text-2xl">Create Account</p>
          <p className="text-sm text-gray-500">
            Fill in the details to get started
          </p>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          {/* Name */}
          <Input
            value={name}
            label="Full Name"
            size="md"
            type="text"
            variant="bordered"
            radius="lg"
            isClearable
            onChange={(e) => {
              Setname(e.target.value);
            }}
          />

          {/* Email */}
          <Input
            value={email}
            label="Email"
            size="md"
            type="email"
            variant="bordered"
            radius="lg"
            isClearable
            onChange={(e) => {
              Setemail(e.target.value);
            }}
          />

          {/* Password */}
          <Input
           maxLength={8}
            value={password}
            label="Password"
            size="md"
            type="password"
            variant="bordered"
            radius="lg"
            onChange={(e) => {
              SetPassword(e.target.value);
            }}
          />

          {/* Phone */}
          <Input
           maxLength={12}
            value={phonenummber}
            label="Phone Number"
            size="md"
            type="tel"
            variant="bordered"
            radius="lg"
            onChange={(e) => {
              Setphonenummber(e.target.value);
            }}
          />

          {/* Currency */}
          <Input
            label="Currency"
            labelPlacement="outside"
            variant="bordered"
            radius="lg"
            disabled
            placeholder="Select your currency"
            endContent={
              <select
                value={currency}
                className="outline-none border-0 bg-transparent text-default-600 text-sm"
                id="currency"
                name="currency"
                
                onChange={(e) => {
                  Setcurrency(e.target.value);
                }}
              >
               
               
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                 <option  value="INR">INR - Indian Rupee</option>
              </select>
            }
          />
        </CardBody>

        <CardFooter className="flex flex-col space-y-3">
          {/* Create account button */}
          <Button
            color="primary"
            className="w-full font-semibold rounded-lg"
            radius="lg"
            onPress={handleSubmit}
          >
            Create Account
          </Button>

          {/* Already have account */}
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/LoginPage" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
