"use client";

import { useEffect, useState } from "react";
import { useObservable } from "dexie-react-hooks";
import { db } from "../lib/db";
import {
  resolveText,
  DXCInputField,
  DXCUserInteraction,
  DXCAlert,
} from "dexie-cloud-addon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { useRouter, usePathname } from "next/navigation";

export function LoginGUI() {
  const ui = useObservable(db.cloud.userInteraction);
  const user = useObservable(db.cloud.currentUser);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (user?.isLoggedIn && pathname === "/") {
      router.replace("/bands");
    }
  }, [user, router, pathname]);
  if (!ui) return null; // No user interaction is requested.
  return <LoginDialog ui={ui} />;
}

function LoginDialog({ ui }: { ui: DXCUserInteraction }) {
  const [params, setParams] = useState<{ [param: string]: string }>({});
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ui.title}</DialogTitle>
        </DialogHeader>
        <DXCAlerts alerts={ui.alerts} />
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            ui.onSubmit(params);
          }}
        >
          <div className="grid gap-4 py-4">
            {(Object.entries(ui.fields) as [string, DXCInputField][]).map(
              ([fieldName, { type, label, placeholder }], idx) => (
                <div key={idx} className="grid grid-cols-4 items-center gap-4">
                  {label && (
                    <Label htmlFor={fieldName} className="text-right">
                      {label}
                    </Label>
                  )}
                  <Input
                    id={fieldName}
                    type={type}
                    name={fieldName}
                    placeholder={placeholder}
                    value={params[fieldName] || ""}
                    className={cn(label ? "col-span-3" : "col-span-4")}
                    onChange={(ev) => {
                      const value = ev.target.value;
                      let updatedParams = {
                        ...params,
                        [fieldName]: value,
                      };
                      setParams(updatedParams);
                    }}
                  />
                </div>
              )
            )}
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={() => ui.onSubmit(params)}>
            Submit
          </Button>
          {ui.cancelLabel && (
            <Button variant="secondary" onClick={ui.onCancel}>
              {ui.cancelLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DXCAlerts({ alerts }: { alerts: DXCAlert[] }) {
  return (
    <div className="space-y-4">
      {alerts.map((alert, i) => (
        <div key={i}>
          {alert.type === "error" && <ErrorAlert alert={alert} />}
          {alert.type === "info" && <InfoAlert alert={alert} />}
        </div>
      ))}
    </div>
  );
}

function ErrorAlert({ alert }: { alert: DXCAlert }) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{resolveText(alert)}</AlertDescription>
    </Alert>
  );
}

function InfoAlert({ alert }: { alert: DXCAlert }) {
  return (
    <Alert>
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>{resolveText(alert)}</AlertDescription>
    </Alert>
  );
}
