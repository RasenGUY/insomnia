import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle } from 'lucide-react';
import { usernameSchema } from '@/lib/validations/auth';
import { GradientAvatar } from '@/components/features/common/GradientAvatar';
import { z } from 'zod';

interface RegisterModalProps {
  isOpen: boolean;
  handleRegister: (username: string) => Promise<void>;
  isRegistering: boolean;
  error?: string;
}

export const RegisterModal = ({
  isOpen,
  handleRegister,
  isRegistering,
  error,
}: RegisterModalProps) => {
  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateUsername = (value: string) => {
    try {
      usernameSchema.parse(value);
      setValidationError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0]?.message ?? 'Invalid username');
      }
      return false;
    }
  };

  useEffect(() => {
    if (username) {
      validateUsername(username);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUsername(username)) {
      await handleRegister(username);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Registration</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 mb-4">
          <div className="rounded-full overflow-hidden border-4 border-background shadow-lg">
            <GradientAvatar 
              seed={username} 
              size={80} 
              className="border-4 border-background shadow-lg"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Your unique profile avatar
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Enter username"
              className="w-full"
              disabled={isRegistering}
            />
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isRegistering || !username || !!validationError}
            className="w-full"
          >
            {isRegistering ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;