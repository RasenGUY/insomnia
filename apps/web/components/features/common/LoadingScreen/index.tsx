import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  fullScreen?: boolean;
}

export const LoadingScreen = ({ fullScreen = false }: LoadingScreenProps) => {
  return (
    <div 
      className={`
        relative z-10 w-full bg-background
        ${fullScreen ? 'h-screen' : 'h-full'}
      `}
    >
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};