import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'

interface RegisterModalProps {
  isOpen: boolean;
  onRegister: (username: string) => Promise<void>;
  isRegistering: boolean;
  error?: string;
}

export const RegisterModal = ({
  isOpen,
  onRegister,
  isRegistering,
  error,
}: RegisterModalProps) => {
  const [username, setUsername] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onRegister(username)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Registration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button
            type="submit"
            disabled={isRegistering || !username}
            className="w-full"
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
