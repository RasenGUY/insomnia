// components/Navbar.js
"use client";
import {
  NavigationMenu,
} from "@workspace/ui/components/navigation-menu";
import ConnectButton from "components/features/wallet/ConnectButton";

export default function Navbar() {
  return (
    <NavigationMenu className="max-w-[unset] mx-auto mt-1 w-full px-4 py-4 sm:px-6 lg:px-8 flex justify-end">
      <ConnectButton/>
    </NavigationMenu>
  );
}

