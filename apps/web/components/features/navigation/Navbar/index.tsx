// components/Navbar.js
"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@workspace/ui/components/navigation-menu";


export default function Navbar() {
  return (
      <NavigationMenu className="max-w-12xl mx-auto mt-1 w-full px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="text-xl font-bold">
          Dashboard
        </Link>

        {/* Connect Button */}
        <Button className="px-4">Connect</Button>
      </NavigationMenu>
  );
}

