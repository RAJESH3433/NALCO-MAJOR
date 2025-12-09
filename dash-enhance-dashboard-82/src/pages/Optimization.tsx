import { useState } from "react";
import Layout from '@/components/Layout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, CheckCircle2, Undo2, RefreshCw, Loader2 } from "lucide-react";
import { useLanguage } from '@/config/contexts/LanguageContext';
import { useOptimization } from '@/config/contexts/OptimizationContext';
import OptimizationTable from "@/components/OptimizationTable";
import ErrorIndicator from "@/components/ErrorIndicator";

const Optimization = () => {
  const { t } = useLanguage();
  const { 
    desiredValues, 
    actualValues, 
    currentError, 
    isOptimizing,
    optimizableParameters,
    selectedParameter,
    updateDesiredValues,
    setDesiredFromActual,
    runOptimization,
    undoOptimization,
    resetOptimization,
    setSelectedParameter,
    sendDesiredValues
  } = useOptimization();

  const handleValueChange = (field: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateDesiredValues({ [field]: numValue });
    } else {
      updateDesiredValues({ [field]: 0 });
    }
  };

  const handleSetDesired = () => {
    // First update local state to match actual values
    setDesiredFromActual();
    // Then send these values to the API
    sendDesiredValues({
      uts: actualValues.uts,
      elongation: actualValues.elongation,
      conductivity: actualValues.conductivity
    });
  };

  const handleSubmitDesired = () => {
    // Send the current desired values to the API
    sendDesiredValues(desiredValues);
  };

  return (
    <Layout title={t('optimization')}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-nalco-blue">{t('materials')}</h2>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 whitespace-nowrap">{t('optimizeParameter')}:</span>
                <Select 
                  value={selectedParameter}
                  onValueChange={setSelectedParameter}
                >
                  <SelectTrigger className="w-[200px] border-nalco-blue border">
                    <SelectValue placeholder={t('selectParameter')} />
                  </SelectTrigger>
                  <SelectContent>
                    {optimizableParameters.map((param) => (
                      <SelectItem key={param.name} value={param.name}>
                        {param.name} ({param.current_value.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* UTS Card */}
              <Card className="p-5 bg-white shadow-md rounded-lg border-t-4 border-t-nalco-blue">
                <h3 className="text-lg font-semibold mb-3 text-nalco-blue">{t('uts')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">{t('desired')}</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nalco-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <Input 
                          className="flex-1" 
                          placeholder="0.00" 
                          type="number"
                          step="0.01"
                          value={desiredValues.uts || ''}
                          onChange={(e) => handleValueChange('uts', e.target.value)}
                        />
                      </div>
                      <div className="ml-2 text-nalco-blue font-medium">{t('mpa')}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">{t('actual')}</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nalco-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <Input 
                          className="flex-1 bg-gray-50" 
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          value={actualValues.uts || ''}
                          readOnly
                        />
                      </div>
                      <div className="ml-2 text-nalco-blue font-medium">{t('mpa')}</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Elongation Card */}
              <Card className="p-5 bg-white shadow-md rounded-lg border-t-4 border-t-nalco-green">
                <h3 className="text-lg font-semibold mb-3 text-nalco-blue">{t('elongation')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">{t('desired')}</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nalco-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <Input 
                          className="flex-1" 
                          placeholder="0.00" 
                          type="number"
                          step="0.01"
                          value={desiredValues.elongation || ''}
                          onChange={(e) => handleValueChange('elongation', e.target.value)}
                        />
                      </div>
                      <div className="ml-2 text-nalco-blue font-medium">%</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">{t('actual')}</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nalco-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <Input 
                          className="flex-1 bg-gray-50" 
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          value={actualValues.elongation || ''}
                          readOnly
                        />
                      </div>
                      <div className="ml-2 text-nalco-blue font-medium">%</div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Conductivity Card */}
              <Card className="p-5 bg-white shadow-md rounded-lg border-t-4 border-t-nalco-cyan">
                <h3 className="text-lg font-semibold mb-3 text-nalco-blue">{t('conductivity')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">{t('desired')}</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nalco-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <Input 
                          className="flex-1" 
                          placeholder="0.00" 
                          type="number"
                          step="0.01"
                          value={desiredValues.conductivity || ''}
                          onChange={(e) => handleValueChange('conductivity', e.target.value)}
                        />
                      </div>
                      <div className="ml-2 text-nalco-blue font-medium">{t('iacs')}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 block mb-2">{t('actual')}</label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-nalco-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <Input 
                          className="flex-1 bg-gray-50" 
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          value={actualValues.conductivity || ''}
                          readOnly
                        />
                      </div>
                      <div className="ml-2 text-nalco-blue font-medium">{t('iacs')}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex flex-wrap justify-center mt-8 gap-4">
              {/* Set Desired from Actual Button */}
              {/* <Button 
                variant="outline" 
                className="flex items-center bg-white hover:bg-gray-100 min-w-[150px]"
                onClick={handleSetDesired}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('setDesiredFromActual')}
              </Button> */}
              
              {/* Submit Desired Values Button */}
              <Button 
                variant="outline" 
                className="flex items-center bg-white hover:bg-gray-100 min-w-[150px]"
                onClick={handleSubmitDesired}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('submitDesiredValues')}
              </Button>
              
              {/* Optimize Button */}
              <Button 
                className="bg-nalco-blue hover:bg-nalco-darkBlue text-white flex items-center min-w-[150px]"
                onClick={runOptimization}
                disabled={isOptimizing || !selectedParameter}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('optimizing')}
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    {t('optimize')}
                  </>
                )}
              </Button>
              
              {/* Undo Button */}
              <Button 
                variant="outline" 
                className="flex items-center bg-white hover:bg-gray-100 min-w-[150px]"
                onClick={undoOptimization}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                {t('undo')}
              </Button>
              
              {/* Reset Button */}
              <Button 
                variant="outline" 
                className="flex items-center bg-white hover:bg-gray-100 min-w-[150px]"
                onClick={resetOptimization}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('reset')}
              </Button>
            </div>
          </div>
          
          <ErrorIndicator />
          
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-nalco-blue mb-4">{t('optimizationHistory')}</h2>
            <OptimizationTable />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Optimization;