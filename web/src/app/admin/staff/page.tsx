import { Metadata } from "next";
import StaffManagementClient from "./StaffManagementClient";

export const metadata: Metadata = {
  title: "Управление командой | Админ-панель",
  description: "Управление членами команды",
};

export const dynamic = "force-dynamic";

export default function AdminStaffPage() {
  return <StaffManagementClient />;
}


