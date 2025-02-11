import { ConnectKitButton } from "connectkit"; 
import { Button } from "@workspace/ui/components/button"


type SignInProps = Record<string, never>

const ConnectButton: React.FC<SignInProps> = () => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        return (
          <Button className="px-4" onClick={show}>
            {isConnected ? address : "Connect"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  )
}

export default ConnectButton
