
import React from 'react';
import { useOptimization } from '@/config/contexts/OptimizationContext';
import { Badge } from "@/components/ui/badge";

const ErrorIndicator = () => {
  const { currentError } = useOptimization();

  const getErrorBadgeColor = (error: number | null): string => {
    if (error === null) return "bg-gray-200";
    if (error < 5) return "bg-green-500";
    if (error < 10) return "bg-orange-500";
    return "bg-red-500";
  };

  const getErrorIcon = (error: number | null): string => {
    if (error === null) return "";
    if (error < 5) return "🔽"; // downwards arrow
    if (error < 10) return "➡️"; // right arrow
    return "🔼"; // upwards arrow
  };

  return (
    <div className="mt-6 mb-6">
      <div className="flex items-center justify-center">
        <Badge className={`px-4 py-2 text-lg ${getErrorBadgeColor(currentError)}`}>
          {currentError !== null ? `${currentError.toFixed(2)}% ${getErrorIcon(currentError)}` : "-"}
        </Badge>
      </div>
    </div>
  );
};

export default ErrorIndicator;