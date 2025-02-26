
import { CHAINID_TO_LABEL } from "@/lib/constants/supported-chains";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { capitalizeStr } from "@/utils/format";

interface NetworkSelectorProps {
  networks: number[];
  selectedNetwork: number | null;
  onSelect: (network: number | null) => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  networks,
  selectedNetwork,
  onSelect,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="relative ml-2 w-[fit-content] inline-flex justify-between">
          {selectedNetwork ? CHAINID_TO_LABEL[selectedNetwork] : "All Networks"}
          <ChevronDown className="h-4 w-4 ml-1 mt-1" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        <DropdownMenuItem  onClick={() => onSelect(null)}>
          All Networks
        </DropdownMenuItem>
        {networks.map((network) => (
          <DropdownMenuItem
            key={network}
            onClick={() => onSelect(network)}
          >
            {capitalizeStr(CHAINID_TO_LABEL[network]?.toLowerCase() as string)} 
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
