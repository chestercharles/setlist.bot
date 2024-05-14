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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useRegisterMixpanel } from "@/lib/mixpanel";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    db.open();
  });

  const ui = useObservable(db.cloud.userInteraction);
  const user = useObservable(db.cloud.currentUser);

  useRegisterMixpanel(user);

  if (user?.isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <main className={cn("p-8", "flex", "justify-center")}>
      <div className={cn("w-80")}>
        <div className={cn("flex", "justify-center")}>
          <h1 className={cn("font-extrabold")}>Setlist Bot</h1>
        </div>
        <div className={cn("py-8")}>
          {ui ? <LoginForm ui={ui} /> : <LoginSkeleton />}
        </div>
      </div>
    </main>
  );
}

function LoginSkeleton() {
  return (
    <div>
      <div>
        <Skeleton className="h-6 w-80" />
      </div>
      <form>
        <div className="grid gap-4 py-4">
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-6 w-80" />
        </div>
      </form>
      <div>
        <Skeleton className="h-6 w-80" />
      </div>
    </div>
  );
}

function LoginForm({ ui }: { ui: DXCUserInteraction }) {
  const [params, setParams] = useState<{ [param: string]: string }>({});
  return (
    <div>
      <div>
        <h1>{ui.title}</h1>
      </div>
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
      <div>
        <Button type="submit" onClick={() => ui.onSubmit(params)}>
          Submit
        </Button>
        {ui.cancelLabel && (
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            {ui.cancelLabel}
          </Button>
        )}
      </div>
    </div>
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
