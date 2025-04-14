
import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center p-8 text-red-500">
      <p>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Coba Lagi
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
