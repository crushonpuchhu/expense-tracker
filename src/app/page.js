'use client'


import ExpenseTrackerLanding from "../component/landingPage/ExpenseTrackerLanding.jsx";
import {Button, HeroUIProvider} from "@heroui/react";

import Link from "next/link";
export default function Home() {
  return (
    <div className="  min-h-screen ">
     <HeroUIProvider>
  
      <ExpenseTrackerLanding/>
    </HeroUIProvider>
    </div>
  );
}
