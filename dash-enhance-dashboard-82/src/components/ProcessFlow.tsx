
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, CalendarCheck, Settings, Bug } from "lucide-react";

const ProcessFlow = () => {
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-16 w-full justify-between">
          <div className="process-step">
            <div className="bg-gray-200 rounded-full p-4 mb-2 relative z-10">
              <FileText className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Casting</h3>
              <p className="text-xs text-gray-500">Last updated at: Not updated yet</p>
            </div>
            <div className="process-arrow w-full bg-gray-300"></div>
          </div>
          
          <div className="process-step">
            <div className="bg-gray-200 rounded-full p-4 mb-2 relative z-10">
              <CalendarCheck className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Rolling</h3>
              <p className="text-xs text-gray-500">Last updated at: Not updated yet</p>
            </div>
            <div className="process-arrow w-full bg-gray-300"></div>
          </div>
          
          <div className="process-step">
            <div className="bg-gray-200 rounded-full p-4 mb-2 relative z-10">
              <Settings className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Cooling</h3>
              <p className="text-xs text-gray-500">Last updated at: Not updated yet</p>
            </div>
            <div className="process-arrow w-full bg-gray-300"></div>
          </div>
          
          <div className="process-step">
            <div className="bg-gray-200 rounded-full p-4 mb-2 relative z-10">
              <Bug className="w-6 h-6 text-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Result</h3>
              <p className="text-xs text-gray-500">Last updated at: Not updated yet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Start
        </button>
        
        <div className="flex-1"></div>
        
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Automate
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <h2 className="p-4 font-medium border-b">Casting Process</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Temperature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Casting Temperature (°C)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Casting Speed (m/min)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cast Bar Entry Temp (°C)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Furnace 7 Temperature (°C)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Furnace 8 Temperature (°C)</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <Card className="shadow-sm">
          <h2 className="p-4 font-medium border-b">Rolling Process</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Emulsion Temperature (°C)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Emulsion Pressure (bar)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <Card className="shadow-sm">
          <h2 className="p-4 font-medium border-b">Cooling Process</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cooling Method</TableHead>
                <TableHead>Temperature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Rod Quench Water Temperature Entry (°C)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rod Quench Water Temperature Exit (°C)</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <Card className="shadow-sm">
          <h2 className="p-4 font-medium border-b">Results</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Test Value</TableHead>
                <TableHead>Pass/Fail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>UTS (Tensile Strength)</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Conductivity</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Elongation</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default ProcessFlow;
