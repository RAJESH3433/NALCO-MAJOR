
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLanguage } from '@/config/contexts/LanguageContext';
import { ReversePredictionService, ReversePredictionResult } from '@/services/ReversePredictionService';
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  uts: z.string().min(1, { message: "Required" }),
  conductivity: z.string().min(1, { message: "Required" }),
  elongation: z.string().min(1, { message: "Required" }),
});

const ReversePrediction = () => {
  const { t } = useLanguage();
  const [predictionResult, setPredictionResult] = useState<ReversePredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uts: "",
      conductivity: "",
      elongation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Check API health first
      const health = await ReversePredictionService.checkHealth();
      console.log("API Health Status:", health);
      
      if (health.status !== "healthy") {
        throw new Error("API service is currently unavailable");
      }

      // Convert string inputs to numbers
      const input = {
        uts: parseFloat(values.uts),
        conductivity: parseFloat(values.conductivity),
        elongation: parseFloat(values.elongation),
      };

      // Make prediction request
      const result = await ReversePredictionService.predict(input);
      console.log("Reverse prediction results:", result);
      setPredictionResult(result);

      toast({
        title: "Calculation Complete",
        description: "The reverse prediction has been calculated successfully",
      });
    } catch (error) {
      console.error("Failed to get reverse prediction:", error);
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    form.reset();
    setPredictionResult(null);
  };

  return (
    <Layout title={t('reversePrediction')}>
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('inputParameters')}</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('ultimateTensileStrength')}</label>
                  <Input 
                    {...form.register("uts")} 
                    placeholder={t('enterUTSValue')} 
                    type="number" 
                    step="0.01" 
                  />
                  {form.formState.errors.uts && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.uts.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('elongation')}</label>
                  <Input 
                    {...form.register("elongation")} 
                    placeholder={t('enterElongationValue')} 
                    type="number" 
                    step="0.01" 
                  />
                  {form.formState.errors.elongation && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.elongation.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('conductivity')}</label>
                  <Input 
                    {...form.register("conductivity")} 
                    placeholder={t('enterConductivityValue')} 
                    type="number" 
                    step="0.01" 
                  />
                  {form.formState.errors.conductivity && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.conductivity.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-nalco-blue hover:bg-nalco-darkBlue text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('calculating')}...
                    </>
                  ) : (
                    t('calculate')
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClear} 
                  className="flex-1 border-nalco-blue text-nalco-blue hover:bg-nalco-blue/10"
                  disabled={isLoading}
                >
                  {t('clear')}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('predictedComposition')}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('si')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.si.toFixed(2)}%` : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('fe')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.fe.toFixed(2)}%` : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('metalTemp')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.metalTemp.toFixed(1)}°C` : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('castingWheelRPM')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? predictionResult.castingWheelRpm.toFixed(0) : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('coolingWaterPressure')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.coolingWaterPressure.toFixed(1)} bar` : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('coolingWaterTemp')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.coolingWaterTemp.toFixed(1)}°C` : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('castBarEntryTemp')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.castBarEntryTemp.toFixed(1)}°C` : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('rollingMillRPM')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? predictionResult.rollingMillRpm.toFixed(0) : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('emulsionTemp')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.emulsionTemp.toFixed(1)}°C` : '-'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium mb-1 text-gray-700">{t('emulsionPressure')}</h3>
                <p className="text-xl font-bold text-nalco-blue">{predictionResult ? `${predictionResult.emulsionPressure.toFixed(1)} bar` : '-'}</p>
              </div>
              
              {predictionResult && (
                <div className="col-span-2 text-xs text-gray-500 mt-2">
                  <p>Model Version: {predictionResult.model_version}</p>
                  <p>Timestamp: {new Date(predictionResult.timestamp).toLocaleString()}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ReversePrediction;