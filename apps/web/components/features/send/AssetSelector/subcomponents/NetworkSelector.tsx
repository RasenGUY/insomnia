
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button"; 
import { ChevronDown } from "lucide-react";

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
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[140px] justify-between">
          {selectedNetwork ? `Chain ${selectedNetwork}` : "All Networks"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        <DropdownMenuItem onClick={() => onSelect(null)}>
          All Networks
        </DropdownMenuItem>
        {networks.map((network) => (
          <DropdownMenuItem
            key={network}
            onClick={() => onSelect(network)}
          >
            Chain {network}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

