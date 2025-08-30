import type { Metadata } from "next"
import { SettingsForm } from "@/components/settings/settings-form"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and profile information.",
}

export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center w-full h-full py-10">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col space-y-8 pb-16">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and profile information</p>
          </div>
          <SettingsForm />
        </div>
      </div>
    </div>
  )
}