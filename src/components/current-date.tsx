"use client";

import { useEffect, useState } from "react";

export default function CurrentDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const date = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
        timeZone: "Asia/Dhaka",
      });
      setDate(date);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return <>{date}</>;
}
