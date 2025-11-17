import { Metadata } from "next";
import StaffClient from "./StaffClient";

export const metadata: Metadata = {
  title: "Наша команда | Кинокомиссия",
  description: "Познакомьтесь с нашей командой профессионалов",
};

export const dynamic = "force-dynamic";

export default function StaffPage() {
  return <StaffClient />;
}


