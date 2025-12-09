import { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from '@/config/contexts/LanguageContext';
import { PredictionService, PredictionInput, PredictionResult } from "@/services/PredictionService";
import { Loader2 } from "lucide-react";

const Prediction = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);

  // Input state
  const [inputs, setInputs] = useState<PredictionInput>({
    si: 0,
    fe: 0,
    metalTemp: 0,
    castingWheelRpm: 0,
    coolingWaterPressure: 0,
    coolingWaterTemp: 0,
    castBarEntryTemp: 0,
    rollingMillRpm: 0,
    emulsionTemp: 0,
    emulsionPressure: 0,
    rodQuenchWaterPressure: 0
  });

  // Update input values
  const handleInputChange = (name: keyof PredictionInput, value: string) => {
    const numValue = parseFloat(value);  // Convert string to number
    if (!isNaN(numValue)) {
      setInputs(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setInputs(prev => ({
        ...prev,
        [name]: 0  // Default to 0 if the value is not a number
      }));
    }
  };

  // Submit prediction
  const handlePredict = async () => {
    console.log("Inputs sent to API:", inputs);  // Debugging line

    // Validate inputs
    const hasEmptyFields = Object.values(inputs).some(val => val === 0 || val === null || val === undefined);
    
    if (hasEmptyFields) {
      toast({
        title: "Validation Error",
        description: "Please fill in all input fields with valid values",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check API health first
      const health = await PredictionService.checkHealth();
      console.log("API Health Status:", health);  // Debugging line
      if (health.status !== "healthy") {
        throw new Error("API service is currently unavailable");
      }

      // Make prediction request
      const predictionResults = await PredictionService.predict(inputs);
      console.log("Prediction results received:", predictionResults);  // Debugging line
      setResults(predictionResults);

      toast({
        title: "Prediction Complete",
        description: "The prediction has been calculated successfully",
      });
    } catch (error) {
      console.error("Failed to get prediction:", error);
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title={t('prediction')}>
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('inputParameters')}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('si')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterSiValue')} 
                    value={inputs.si || ''}
                    onChange={(e) => handleInputChange('si', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('fe')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterFeValue')} 
                    value={inputs.fe || ''}
                    onChange={(e) => handleInputChange('fe', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('metalTemp')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterMetalTemp')} 
                    value={inputs.metalTemp || ''}
                    onChange={(e) => handleInputChange('metalTemp', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('castingWheelRPM')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterCastingWheelRPM')} 
                    value={inputs.castingWheelRpm || ''}
                    onChange={(e) => handleInputChange('castingWheelRpm', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('coolingWaterPressure')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterCoolingWaterPressure')} 
                    value={inputs.coolingWaterPressure || ''}
                    onChange={(e) => handleInputChange('coolingWaterPressure', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('coolingWaterTemp')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterCoolingWaterTemp')} 
                    value={inputs.coolingWaterTemp || ''}
                    onChange={(e) => handleInputChange('coolingWaterTemp', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('castBarEntryTemp')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterCastBarEntryTemp')} 
                    value={inputs.castBarEntryTemp || ''}
                    onChange={(e) => handleInputChange('castBarEntryTemp', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('rollingMillRPM')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterRollingMillRPM')} 
                    value={inputs.rollingMillRpm || ''}
                    onChange={(e) => handleInputChange('rollingMillRpm', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('emulsionTemp')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterEmulsionTemp')} 
                    value={inputs.emulsionTemp || ''}
                    onChange={(e) => handleInputChange('emulsionTemp', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('emulsionPressure')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterEmulsionPressure')} 
                    value={inputs.emulsionPressure || ''}
                    onChange={(e) => handleInputChange('emulsionPressure', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('rodQuenchWaterPressure')}</label>
                  <Input 
                    type="number"
                    placeholder={t('enterRodQuenchWaterPressure')} 
                    value={inputs.rodQuenchWaterPressure || ''}
                    onChange={(e) => handleInputChange('rodQuenchWaterPressure', e.target.value)}
                  />
                </div>
              </div>

              <Button 
                type="button" 
                className="w-full bg-nalco-blue hover:bg-nalco-darkBlue text-white mt-4"
                onClick={handlePredict}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  t('predict')
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('predictionResults')}</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium mb-2 text-gray-700">{t('uts')}</h3>
                <p className="text-3xl font-bold text-nalco-blue">
                  {results ? results.uts.toFixed(2) : "--"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium mb-2 text-gray-700">{t('elongation')}</h3>
                <p className="text-3xl font-bold text-nalco-blue">
                  {results ? results.elongation.toFixed(2) : "--"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium mb-2 text-gray-700">{t('conductivity')}</h3>
                <p className="text-3xl font-bold text-nalco-blue">
                  {results ? results.conductivity.toFixed(2) : "--"}
                </p>
              </div>

              {results && (
                <div className="text-xs text-gray-500 mt-4">
                  <p>Model Version: {results.model_version}</p>
                  <p>Timestamp: {new Date(results.timestamp).toLocaleString()}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Prediction;
