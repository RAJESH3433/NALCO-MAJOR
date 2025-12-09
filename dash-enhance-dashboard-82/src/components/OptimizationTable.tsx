
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from '@/config/contexts/LanguageContext';
import { useOptimization } from '@/config/contexts/OptimizationContext';
import { Badge } from "@/components/ui/badge";

const OptimizationTable = () => {
  const { t } = useLanguage();
  const { optimizationHistory } = useOptimization();

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      <ScrollArea className="h-[350px]">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-50">
            <TableRow className="border-b border-slate-200">
              <TableHead className="w-[80px] py-3 text-center font-bold">{t('iteration')}</TableHead>
              <TableHead className="w-[150px] py-3 font-bold">{t('optimizedParameter')}</TableHead>
              <TableHead className="w-[170px] py-3 font-bold">{t('valueChanged')}</TableHead>
              <TableHead className="w-[80px] py-3 font-bold text-center">{t('uts')}</TableHead>
              <TableHead className="w-[100px] py-3 font-bold text-center">{t('elongation')}</TableHead>
              <TableHead className="w-[120px] py-3 font-bold text-center">{t('conductivity')}</TableHead>
              <TableHead className="w-[100px] py-3 text-right font-bold">{t('error')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimizationHistory.map((row, index) => {
              const isLatest = index === optimizationHistory.length - 1;
              const improved = index > 0 && row.error < optimizationHistory[index-1].error;
              
              return (
                <TableRow 
                  key={index}
                  className={`
                    ${isLatest ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}
                    ${improved ? "text-green-700" : ""}
                    transition-colors
                  `}
                >
                  <TableCell className="font-medium text-center">{row.iteration}</TableCell>
                  <TableCell>{row.parameter || "-"}</TableCell>
                  <TableCell className="font-mono text-sm">{row.valueChanged || "-"}</TableCell>
                  <TableCell className="text-center">{row.uts.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{row.elongation.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{row.conductivity.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={improved ? "bg-green-500" : "bg-slate-500"}>
                      {row.error.toFixed(2)}%
                      {improved && " 🔽"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {optimizationHistory.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  {t('noOptimizationHistory')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default OptimizationTable;