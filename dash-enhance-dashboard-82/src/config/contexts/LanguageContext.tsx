import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Header translations
  selectLanguage: {
    en: "Select Language",
    hi: "भाषा चुनें"
  },
  logout: {
    en: "Logout",
    hi: "लॉग आउट"
  },
  // LLM page translations
  aiAssistant: {
    en: "AI Assistant",
    hi: "एआई सहायक"
  },
  chatWithAI: {
    en: "Chat with AI ✨",
    hi: "एआई से चैट करें ✨"
  },
  howCanIHelp: {
    en: "How can I assist you today?",
    hi: "मैं आज आपकी कैसे सहायता कर सकता हूं?"
  },
  typeMessage: {
    en: "Type your message...",
    hi: "अपना संदेश टाइप करें..."
  },
  sendMessage: {
    en: "Send Message",
    hi: "संदेश भेजें"
  },
  // Feature cards translations
  nlqInterface: {
    en: "Natural Language Query Interface",
    hi: "प्राकृतिक भाषा क्वेरी इंटरफ़ेस"
  },
  uploadDataset: {
    en: "Upload your dataset and ask questions in plain English!",
    hi: "अपना डेटासेट अपलोड करें और सरल भाषा में प्रश्न पूछें!"
  },
  pdfSummary: {
    en: "PDF Summary Generator",
    hi: "पीडीएफ सारांश जनरेटर"
  },
  uploadPdf: {
    en: "Upload PDF documents for automatic summaries and key insights!",
    hi: "स्वचालित सारांश और प्रमुख अंतर्दृष्टि के लिए पीडीएफ दस्तावेज़ अपलोड करें!"
  },
  dataViz: {
    en: "Data Visualization",
    hi: "डेटा विज़ुअलाइज़ेशन"
  },
  askForGraphs: {
    en: "Ask for graphs and visualizations with just a sentence!",
    hi: "केवल एक वाक्य के साथ ग्राफ और विज़ुअलाइज़ेशन के लिए पूछें!"
  },
  // Sidebar translations
  main: {
    en: "MAIN",
    hi: "मुख्य"
  },
  dashboard: {
    en: "Dashboard",
    hi: "डैशबोर्ड"
  },
  prediction: {
    en: "Prediction",
    hi: "पूर्वानुमान"
  },
  optimization: {
    en: "Optimization",
    hi: "अनुकूलन"
  },
  reversePrediction: {
    en: "Reverse Prediction", 
    hi: "रिवर्स पूर्वानुमान"
  },
  llm: {
    en: "LLM",
    hi: "एलएलएम"
  },
  settings: {
    en: "SETTINGS",
    hi: "सेटिंग्स"
  },
  profile: {
    en: "Profile",
    hi: "प्रोफ़ाइल"
  },
  settingsPage: {
    en: "Settings",
    hi: "सेटिंग्स"
  },
  // Dashboard translations
  qualityControlDashboard: {
    en: "Quality Control Dashboard",
    hi: "गुणवत्ता नियंत्रण डैशबोर्ड"
  },
  grade: {
    en: "Grade",
    hi: "ग्रेड"
  },
  date: {
    en: "Date",
    hi: "दिनांक"
  },
  batchNo: {
    en: "Batch No",
    hi: "बैच संख्या"
  },
  averageOfFE: {
    en: "Average of %FE",
    hi: "औसत %FE"
  },
  averageOfSI: {
    en: "Average of %SI",
    hi: "औसत %SI"
  },
  sumOfTotalOrderQuantity: {
    en: "Sum of Total order quantity",
    hi: "कुल ऑर्डर मात्रा का योग"
  },
  averageOfElongation: {
    en: "Average of Elongation",
    hi: "औसत विस्तार"
  },
  averageOfUTS: {
    en: "Average of UTS",
    hi: "औसत यूटीएस"
  },
  averageOfConductivity: {
    en: "Average of Conductivity",
    hi: "औसत चालकता"
  },
  averageOfUTSByGrade: {
    en: "Average of UTS by Grade",
    hi: "ग्रेड के अनुसार यूटीएस का औसत"
  },
  countOfGradeByGrade: {
    en: "Count of Grade by Grade",
    hi: "ग्रेड के अनुसार ग्रेड की गिनती"
  },
  multipleAverages: {
    en: "Average of UTS, Average of Conductivity and Average of Elongation by Grade",
    hi: "ग्रेड के अनुसार यूटीएस का औसत, चालकता का औसत और विस्तार का औसत"
  },
  // Prediction page translations
  inputParameters: {
    en: "Input Parameters",
    hi: "इनपुट पैरामीटर"
  },
  predictionResults: {
    en: "Prediction Results",
    hi: "पूर्वानुमान परिणाम"
  },
  si: {
    en: "SI",
    hi: "एसआई"
  },
  fe: {
    en: "FE",
    hi: "एफई"
  },
  enterSiValue: {
    en: "Enter SI value",
    hi: "एसआई मान दर्ज करें"
  },
  enterFeValue: {
    en: "Enter FE value",
    hi: "एफई मान दर्ज करें"
  },
  metalTemp: {
    en: "Metal Temp",
    hi: "धातु तापमान"
  },
  enterMetalTemp: {
    en: "Enter Metal Temp",
    hi: "धातु तापमान दर्ज करें"
  },
  castingWheelRPM: {
    en: "Casting Wheel RPM",
    hi: "कास्टिंग व्हील आरपीएम"
  },
  enterCastingWheelRPM: {
    en: "Enter Casting Wheel RPM",
    hi: "कास्टिंग व्हील आरपीएम दर्ज करें"
  },
  coolingWaterPressure: {
    en: "Cooling Water Pressure",
    hi: "शीतलन जल दबाव"
  },
  enterCoolingWaterPressure: {
    en: "Enter Cooling Water Pressure",
    hi: "शीतलन जल दबाव दर्ज करें"
  },
  coolingWaterTemp: {
    en: "Cooling Water Temp",
    hi: "शीतलन जल तापमान"
  },
  enterCoolingWaterTemp: {
    en: "Enter Cooling Water Temp",
    hi: "शीतलन जल तापमान दर्ज करें"
  },
  castBarEntryTemp: {
    en: "Cast Bar Entry Temp",
    hi: "कास्ट बार प्रवेश तापमान"
  },
  enterCastBarEntryTemp: {
    en: "Enter Cast Bar Entry Temp",
    hi: "कास्ट बार प्रवेश तापमान दर्ज करें"
  },
  rollingMillRPM: {
    en: "Rolling Mill RPM",
    hi: "रोलिंग मिल आरपीएम"
  },
  enterRollingMillRPM: {
    en: "Enter Rolling Mill RPM",
    hi: "रोलिंग मिल आरपीएम दर्ज करें"
  },
  emulsionTemp: {
    en: "Emulsion Temp",
    hi: "इमल्शन तापमान"
  },
  enterEmulsionTemp: {
    en: "Enter Emulsion Temp",
    hi: "इमल्शन तापमान दर्ज करें"
  },
  emulsionPressure: {
    en: "Emulsion Pressure",
    hi: "इमल्शन दबाव"
  },
  enterEmulsionPressure: {
    en: "Enter Emulsion Pressure",
    hi: "इमल्शन दबाव दर्ज करें"
  },
  rodQuenchWaterPressure: {
    en: "Rod Quench Water Pressure",
    hi: "रॉड क्वेंच जल दबाव"
  },
  enterRodQuenchWaterPressure: {
    en: "Enter Rod Quench Water Pressure",
    hi: "रॉड क्वेंच जल दबाव दर्ज करें"
  },
  utsValue: {
    en: "UTS",
    hi: "यूटीएस"
  },
  elongationValue: {
    en: "Elongation",
    hi: "विस्तार"
  },
  conductivityValue: {
    en: "Conductivity",
    hi: "चालकता"
  },
  predict: {
    en: "Predict",
    hi: "पूर्वानुमान करें"
  },
  // Reverse Prediction page translations
  enterUTSValue: {
    en: "Enter UTS value",
    hi: "यूटीएस मान दर्ज करें"
  },
  enterElongationValue: {
    en: "Enter Elongation value",
    hi: "विस्तार मान दर्ज करें"
  },
  enterConductivityValue: {
    en: "Enter Conductivity value",
    hi: "चालकता मान दर्ज करें"
  },
  calculate: {
    en: "Calculate",
    hi: "गणना करें"
  },
  clear: {
    en: "Clear",
    hi: "साफ़ करें"
  },
  predictedComposition: {
    en: "Predicted Composition",
    hi: "अनुमानित संरचना"
  },
  ultimateTensileStrength: {
    en: "Ultimate Tensile Strength (UTS)",
    hi: "अल्टीमेट टेन्साइल स्ट्रेंथ (यूटीएस)"
  },
  // Optimization page translations
  optimizationTitle: {
    en: "Optimization",
    hi: "अनुकूलन"
  },
  desiredValues: {
    en: "Desired Values",
    hi: "वांछित मान"
  },
  actualValues: {
    en: "Actual Values",
    hi: "वास्तविक मान"
  },
  currentError: {
    en: "Current % Error:",
    hi: "वर्तमान % त्रुटि:"
  },
  optimizeParameters: {
    en: "Optimize Parameters",
    hi: "पैरामीटर अनुकूलित करें"
  },
  suggestedOptimizationParameters: {
    en: "Suggested Optimization Parameters",
    hi: "सुझाए गए अनुकूलन पैरामीटर"
  },
  apply: {
    en: "Apply",
    hi: "लागू करें"
  },
  optimized: {
    en: "% optimized",
    hi: "% अनुकूलित"
  },
  mpa: {
    en: "MPa",
    hi: "एमपीए"
  },
  iacs: {
    en: "% IACS",
    hi: "% आईएसीएस"
  },
  inputError: {
    en: "Input Error",
    hi: "इनपुट त्रुटि"
  },
  enterAllValues: {
    en: "Please enter all values to optimize parameters",
    hi: "पैरामीटर अनुकूलित करने के लिए कृपया सभी मान दर्ज करें"
  },
  analysisComplete: {
    en: "Analysis Complete",
    hi: "विश्लेषण पूरा"
  },
  optimizationSuggestionsReady: {
    en: "Optimization suggestions are ready",
    hi: "अनुकूलन सुझाव तैयार हैं"
  },
  optimizationApplied: {
    en: "Optimization Applied",
    hi: "अनुकूलन लागू किया गया"
  },
  parametersAdjusted: {
    en: "Parameters adjusted with",
    hi: "पैरामीटर समायोजित किए गए"
  },
  improvement: {
    en: "% improvement",
    hi: "% सुधार"
  },
  optimizationError: {
    en: "Optimization Error",
    hi: "अनुकूलन त्रुटि"
  },
  couldNotApply: {
    en: "Could not apply the optimization",
    hi: "अनुकूलन लागू नहीं किया जा सका"
  },
  increaseCastingTemperature: {
    en: "Increase Casting Temperature by 7°C",
    hi: "कास्टिंग तापमान 7°C बढ़ाएँ"
  },
  increaseEmulsionTemperature: {
    en: "Increase Emulsion Temperature by 3°C",
    hi: "इमल्शन तापमान 3°C बढ़ाएँ"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};