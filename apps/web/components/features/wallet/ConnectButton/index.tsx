import React from 'react';
import { Button } from '@workspace/ui/components/button';
import type { ButtonProps } from '@workspace/ui/components/button';
import { ConnectKitButton } from 'connectkit';

const ConnectButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => (
          <Button
            ref={ref}
            onClick={show}
            className={className}
            {...props}
          >
            {isConnected ? address : "Connect"}
          </Button>
        )}
      </ConnectKitButton.Custom>
    );
  }
);
ConnectButton.displayName = "ConnectButton";
export default ConnectButton;