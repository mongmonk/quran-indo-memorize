
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  details?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, details }) => {
  return (
    <div className="text-center p-8 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">{message}</h3>
      
      {details && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          {details}
        </p>
      )}
      
      {onRetry && (
        <Button onClick={onRetry} className="mt-4" variant="secondary">
          Coba Lagi
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
