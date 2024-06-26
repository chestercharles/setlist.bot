"use client";

import { Band, db } from "@/lib/db";
import { useEffect, useState } from "react";
import { NotFound } from "../not-found";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BandLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { bandId: string };
}>) {
  const [band, notFound] = useBand(params.bandId);

  if (notFound) {
    return <NotFound />;
  }

  if (!band) {
    return null;
  }

  const options: MenuOption[] = [
    {
      name: "Generate",
      href: `/${band.id}`,
    },
    {
      name: "Repertoire",
      href: `/${band.id}/repertoire`,
    },
    {
      name: "Settings",
      href: `/${band.id}/settings`,
    },
  ];

  return (
    <div>
      <nav>
        <div className="flex flex-wrap items-center justify-between p-8">
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            <Link href={`/${band.id}/settings`}>{band.name}</Link>
          </span>
          <MobileNavbar options={options} />
          <FullWidthNavbar options={options} />
        </div>
      </nav>
      {children}
    </div>
  );
}

function useBand(bandId: string) {
  const [notFound, setNotFound] = useState(false);
  const [band, setBand] = useState<null | Band>(null);

  useEffect(() => {
    db.bands.get(bandId).then((band) => {
      if (band) {
        setBand(band);
      } else {
        setNotFound(true);
      }
    });
  }, [bandId]);

  return [band, notFound] as const;
}

type MenuOption = {
  name: string;
  href: string;
};

function MobileNavbar({ options }: { options: MenuOption[] }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={() => setOpen((open) => !open)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem key={option.name}>
            <Link
              href={option.href}
              onClick={() => setOpen(false)}
              className="block py-2 px-3 md:border-0"
            >
              {option.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FullWidthNavbar({ options }: { options: MenuOption[] }) {
  return (
    <div className="hidden w-full md:block md:w-auto">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
        {options.map((option) => (
          <li key={option.name}>
            <Link
              href={option.href}
              className="block py-2 px-3 rounded md:border-0 md:p-0"
            >
              {option.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
