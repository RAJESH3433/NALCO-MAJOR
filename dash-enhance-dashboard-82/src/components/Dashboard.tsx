
import { Card } from "@/components/ui/card";
import { LineChart, BarChart, PieChart } from "recharts";
import { Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { useLanguage } from "@/config/contexts/LanguageContext";

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const Dashboard = () => {
  const { t } = useLanguage();

  // Sample data for the dashboard
  const kpiData = [
    { id: 1, label: t('averageOfFE'), value: "0.19" },
    { id: 2, label: t('averageOfSI'), value: "0.07" },
    { id: 3, label: t('sumOfTotalOrderQuantity'), value: "28K" },
    { id: 4, label: t('averageOfElongation'), value: "16.76" },
    { id: 5, label: t('averageOfUTS'), value: "9.88" },
    { id: 6, label: t('averageOfConductivity'), value: "60.59" },
  ];

  const barData = [
    { grade: 'WC10', average: 9.9 },
  ];

  const pieData = [
    { name: 'WC10', value: 1, label: '1 (100%)' },
  ];

  const scatterData = [
    { grade: 'WC10', uts: 17, conductivity: 61, elongation: 15 },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">{t('qualityControlDashboard')}</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 shadow-sm">
          <h3 className="text-gray-500 text-sm">{t('grade')}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black"></div>
              <span>WC10</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <h3 className="text-gray-500 text-sm">{t('date')}</h3>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span>9/1/2024</span>
              <span>10/13/2024</span>
            </div>
            <div className="mt-2">
              <div className="relative w-full h-1 bg-gray-200 rounded-full">
                <div className="absolute top-0 left-1/4 w-2 h-2 bg-gray-400 rounded-full -translate-x-1/2 -translate-y-1/4"></div>
                <div className="absolute top-0 right-1/4 w-2 h-2 bg-gray-400 rounded-full translate-x-1/2 -translate-y-1/4"></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm">
          <h3 className="text-gray-500 text-sm">{t('batchNo')}</h3>
          <div className="flex justify-between items-center">
            <span className="text-lg">558121</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.id} className="p-4 flex flex-col items-center justify-center shadow-sm">
            <div className="text-4xl font-semibold">{kpi.value}</div>
            <div className="text-sm text-gray-500 text-center">{kpi.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 shadow-sm">
          <h2 className="font-semibold mb-4">{t('averageOfUTSByGrade')}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 shadow-sm">
          <h2 className="font-semibold mb-4">{t('countOfGradeByGrade')}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#FF8042" />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 shadow-sm">
          <h2 className="font-semibold mb-4 text-sm">{t('multipleAverages')}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uts" stroke="#0088FE" activeDot={{ r: 8 }} name={t('averageOfUTS')} />
              <Line type="monotone" dataKey="conductivity" stroke="#00C49F" name={t('averageOfConductivity')} />
              <Line type="monotone" dataKey="elongation" stroke="#FF8042" name={t('averageOfElongation')} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
