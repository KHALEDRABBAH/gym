"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    // Check local storage or default to English
    const savedLang = localStorage.getItem("app-lang") as "en" | "ar" || "en";
    setLang(savedLang);
    document.body.classList.remove("lang-en", "lang-ar");
    document.body.classList.add(`lang-${savedLang}`);
  }, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("app-lang", newLang);
    document.body.classList.remove("lang-en", "lang-ar");
    document.body.classList.add(`lang-${newLang}`);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLang} title="Toggle Language">
      <span className="font-bold">{lang === "en" ? "ع" : "EN"}</span>
    </Button>
  );
}
