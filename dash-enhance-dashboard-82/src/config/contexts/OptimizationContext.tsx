import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { OptimizationService, OptimizationParams } from "@/services/OptimizationService";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "./LanguageContext";

interface PredictionValues {
  uts: number;
  elongation: number;
  conductivity: number;
}

interface OptimizationHistory {
  iteration: number;
  parameter?: string;
  valueChanged?: string;
  uts: number;
  elongation: number;
  conductivity: number;
  error: number;
}

interface OptimizationContextType {
  desiredValues: OptimizationParams;
  actualValues: OptimizationParams;
  currentError: number | null;
  isOptimizing: boolean;
  optimizableParameters: { name: string; current_value: number }[];
  selectedParameter: string;
  optimizationHistory: OptimizationHistory[];
  updateDesiredValues: (values: Partial<OptimizationParams>) => void;
  setActualFromPrediction: (values: PredictionValues) => void;
  setDesiredFromActual: () => void;
  sendDesiredValues: (values: OptimizationParams) => Promise<void>; // Updated to accept values
  runOptimization: () => Promise<void>;
  undoOptimization: () => Promise<void>;
  resetOptimization: () => Promise<void>;
  setSelectedParameter: (param: string) => void;
}

const defaultContext: OptimizationContextType = {
  desiredValues: { uts: 0, elongation: 0, conductivity: 0 },
  actualValues: { uts: 0, elongation: 0, conductivity: 0 },
  currentError: null,
  isOptimizing: false,
  optimizableParameters: [],
  selectedParameter: "",
  optimizationHistory: [],
  updateDesiredValues: () => {},
  setActualFromPrediction: () => {},
  setDesiredFromActual: () => {},
  sendDesiredValues: async () => {},
  runOptimization: async () => {},
  undoOptimization: async () => {},
  resetOptimization: async () => {},
  setSelectedParameter: () => {},
};

const OptimizationContext = createContext<OptimizationContextType>(defaultContext);

export const useOptimization = () => useContext(OptimizationContext);

export const OptimizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [desiredValues, setDesiredValues] = useState<OptimizationParams>({ uts: 0, elongation: 0, conductivity: 0 });
  const [actualValues, setActualValues] = useState<OptimizationParams>({ uts: 0, elongation: 0, conductivity: 0 });
  const [currentError, setCurrentError] = useState<number | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizableParameters, setOptimizableParameters] = useState<{ name: string; current_value: number }[]>([]);
  const [selectedParameter, setSelectedParameter] = useState("");
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationHistory[]>([]);

  // Initialize optimization state
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        const state = await OptimizationService.getCurrentState();
        if (state.optimizable_parameters) {
          setOptimizableParameters(state.optimizable_parameters);
          if (state.optimizable_parameters.length > 0) {
            setSelectedParameter(state.optimizable_parameters[0].name);
          }
        }

        if (state.original_value && state.original_value.length >= 3) {
          setOptimizationHistory([
            {
              iteration: 0,
              uts: state.actual_prediction.UTS || 0,
              elongation: state.actual_prediction.Elongation || 0,
              conductivity: state.actual_prediction.Conductivity || 0,
              error: calculateError(
                state.actual_prediction.UTS || 0, 
                state.actual_prediction.Elongation || 0, 
                state.actual_prediction.Conductivity || 0, 
                desiredValues.uts, 
                desiredValues.elongation, 
                desiredValues.conductivity
              )
            }
          ]);

          setActualValues({
            uts: state.actual_prediction.UTS || 0,
            elongation: state.actual_prediction.Elongation || 0,
            conductivity: state.actual_prediction.Conductivity || 0
          });
        }
      } catch (error) {
        console.error("Failed to initialize optimization state:", error);
      }
    };

    fetchInitialState();
  }, []);

  const calculateError = (
    actualUts: number, 
    actualElongation: number, 
    actualConductivity: number, 
    desiredUts: number, 
    desiredElongation: number, 
    desiredConductivity: number
  ) => {
    try {
      if (!desiredUts || !desiredElongation || !desiredConductivity) {
        return 0;
      }
      
      const utsError = Math.abs(actualUts - desiredUts) / desiredUts;
      const elongationError = Math.abs(actualElongation - desiredElongation) / desiredElongation;
      const conductivityError = Math.abs(actualConductivity - desiredConductivity) / desiredConductivity;
      
      return ((utsError + elongationError + conductivityError) / 3) * 100;
    } catch (err) {
      console.error("Error calculating difference:", err);
      return 0;
    }
  };

  useEffect(() => {
    if (desiredValues.uts && desiredValues.elongation && desiredValues.conductivity &&
        actualValues.uts && actualValues.elongation && actualValues.conductivity) {
      const error = calculateError(
        actualValues.uts,
        actualValues.elongation,
        actualValues.conductivity,
        desiredValues.uts,
        desiredValues.elongation,
        desiredValues.conductivity
      );
      setCurrentError(error);
    } else {
      setCurrentError(null);
    }
  }, [desiredValues, actualValues]);

  const updateDesiredValues = (values: Partial<OptimizationParams>) => {
    setDesiredValues(prev => ({ ...prev, ...values }));
  };

  const setActualFromPrediction = (values: PredictionValues) => {
    setActualValues({
      uts: values.uts,
      elongation: values.elongation,
      conductivity: values.conductivity
    });
    
    toast({
      title: t('valuesUpdated'),
      description: t('actualValuesUpdated'),
    });
  };

  const setDesiredFromActual = () => {
    setDesiredValues({
      uts: actualValues.uts,
      elongation: actualValues.elongation,
      conductivity: actualValues.conductivity
    });

    toast({
      title: t('valuesUpdated'),
      description: t('desiredValuesUpdated'),
    });
  };

  // New function to send desired values to API
  const sendDesiredValues = async (values: OptimizationParams) => {
    try {
      await OptimizationService.setDesiredValues(values);
      toast({
        title: t('valuesUpdated'),
        description: t('desiredValuesSentToAPI'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('failedToUpdateDesiredValues'),
        variant: "destructive"
      });
    }
  };

  const runOptimization = async () => {
    if (!selectedParameter) {
      toast({
        title: t('error'),
        description: t('selectParameterFirst'),
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      const result = await OptimizationService.optimize(selectedParameter);
      
      const newHistoryEntry: OptimizationHistory = {
        iteration: optimizationHistory.length,
        parameter: selectedParameter,
        valueChanged: `${result.parameter_changes[selectedParameter].original_value} → ${result.parameter_changes[selectedParameter].optimized_value} (${result.parameter_changes[selectedParameter].absolute_change})`,
        uts: result.predictions.after_optimization.uts,
        elongation: result.predictions.after_optimization.elongation,
        conductivity: result.predictions.after_optimization.conductivity,
        error: result.error_metrics.error_reduction
      };
      
      setOptimizationHistory(prev => [...prev, newHistoryEntry]);
      setActualValues({
        uts: result.predictions.after_optimization.uts,
        elongation: result.predictions.after_optimization.elongation,
        conductivity: result.predictions.after_optimization.conductivity
      });
      
      const updatedParameters = optimizableParameters.map(param => {
        if (param.name === selectedParameter) {
          return {
            ...param,
            current_value: result.all_parameters[selectedParameter]
          };
        }
        return param;
      });
      
      setOptimizableParameters(updatedParameters);
  
      toast({
        title: t('optimizationComplete'),
        description: `${t('errorReduced')}: ${result.error_metrics.original_error.toFixed(2)}% → ${result.error_metrics.optimized_error.toFixed(2)}%`,
      });
      
    } catch (error) {
      toast({
        title: t('optimizationFailed'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const undoOptimization = async () => {
    try {
      const result = await OptimizationService.undo();
      
      if (optimizationHistory.length > 1) {
        setOptimizationHistory(prev => prev.slice(0, -1));
        
        const lastEntry = optimizationHistory[optimizationHistory.length - 2];
        
        setActualValues({
          uts: lastEntry.uts,
          elongation: lastEntry.elongation,
          conductivity: lastEntry.conductivity
        });
      }
      
      const updatedParameters = optimizableParameters.map(param => ({
        ...param,
        current_value: result.current_parameters[param.name] || param.current_value
      }));
      
      setOptimizableParameters(updatedParameters);
      
      toast({
        title: t('undoComplete'),
        description: t('returnedToPreviousState'),
      });
    } catch (error) {
      toast({
        title: t('undoFailed'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: "destructive"
      });
    }
  };

  const resetOptimization = async () => {
    try {
      const result = await OptimizationService.reset();
      
      const initialState = await OptimizationService.getCurrentState();
      
      if (initialState.actual_prediction) {
        setOptimizationHistory([{
          iteration: 0,
          uts: initialState.actual_prediction.UTS,
          elongation: initialState.actual_prediction.Elongation,
          conductivity: initialState.actual_prediction.Conductivity,
          error: calculateError(
            initialState.actual_prediction.UTS, 
            initialState.actual_prediction.Elongation, 
            initialState.actual_prediction.Conductivity, 
            desiredValues.uts, 
            desiredValues.elongation, 
            desiredValues.conductivity
          )
        }]);

        setActualValues({
          uts: initialState.actual_prediction.UTS,
          elongation: initialState.actual_prediction.Elongation,
          conductivity: initialState.actual_prediction.Conductivity
        });
      }
      
      const updatedParameters = optimizableParameters.map(param => ({
        ...param,
        current_value: result.parameters[param.name] || param.current_value
      }));
      
      setOptimizableParameters(updatedParameters);
      
      toast({
        title: t('resetComplete'),
        description: t('resetToInitialState'),
      });
    } catch (error) {
      toast({
        title: t('resetFailed'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: "destructive"
      });
    }
  };

  return (
    <OptimizationContext.Provider
      value={{
        desiredValues,
        actualValues,
        currentError,
        isOptimizing,
        optimizableParameters,
        selectedParameter,
        optimizationHistory,
        updateDesiredValues,
        setActualFromPrediction,
        setDesiredFromActual,
        sendDesiredValues,
        runOptimization,
        undoOptimization,
        resetOptimization,
        setSelectedParameter,
      }}
    >
      {children}
    </OptimizationContext.Provider>
  );
};