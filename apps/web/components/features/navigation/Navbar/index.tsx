// components/Navbar.js
"use client";
import {
  NavigationMenu,
} from "@workspace/ui/components/navigation-menu";
import ConnectButton from "components/features/wallet/ConnectButton";

export default function Navbar() {
  return (
    <NavigationMenu className="relative left-0 top-0 max-w-[unset] w-full mx-auto mt-1 px-4 py-4 sm:px-6 lg:px-8 flex justify-end gap-y-4">
      <ConnectButton/>
    </NavigationMenu>
  );
}

