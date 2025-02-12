import { AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { VerifyResponseDto } from 'types/auth'

interface VerifyAccountModalProps {
  isOpen: boolean
  onVerify: () => Promise<VerifyResponseDto>
  isVerifying: boolean
  error?: string
}

export const VerifyAccountModal = ({
  isOpen,
  onVerify,
  isVerifying,
  error
}: VerifyAccountModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Wallet</DialogTitle>
          <DialogDescription>
            Sign a message with your wallet to verify ownership and access your account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">What happens when you sign?</p>
              <ul className="mt-2 list-disc pl-4 text-muted-foreground">
                <li>This proves you own this wallet address</li>
                <li>No transaction will be created</li>
                <li>No gas fees are involved</li>
              </ul>
            </div>
          </div>

          <Button 
            onClick={onVerify}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />{" "}
                  Verifying...
              </>
            ) : (
              'Sign Message'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}