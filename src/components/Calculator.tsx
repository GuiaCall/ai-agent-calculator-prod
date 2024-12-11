import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Calculator as CalculatorIcon, Download } from "lucide-react";

interface Technology {
  id: string;
  name: string;
  isSelected: boolean;
  costPerMinute: number;
}

export function Calculator() {
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState<number>(5);
  const [totalMinutes, setTotalMinutes] = useState<number>(1000);
  const [margin, setMargin] = useState<number>(20);
  const [technologies, setTechnologies] = useState<Technology[]>([
    { id: "vapi", name: "Vapi", isSelected: false, costPerMinute: 0.05 },
    { id: "synthflow", name: "Synthflow", isSelected: false, costPerMinute: 0.03 },
    { id: "twilio", name: "Twilio", isSelected: false, costPerMinute: 0.02 },
    { id: "calcom", name: "Cal.com", isSelected: false, costPerMinute: 0.01 },
    { id: "makecom", name: "Make.com", isSelected: false, costPerMinute: 0.02 },
  ]);

  const [totalCost, setTotalCost] = useState<number | null>(null);

  const calculateCost = () => {
    const selectedTechs = technologies.filter((tech) => tech.isSelected);
    if (selectedTechs.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one technology",
        variant: "destructive",
      });
      return;
    }

    const baseCost = selectedTechs.reduce((acc, tech) => acc + tech.costPerMinute, 0);
    const totalBaseCost = baseCost * totalMinutes;
    const finalCost = totalBaseCost * (1 + margin / 100);
    setTotalCost(finalCost);
  };

  const handleTechnologyToggle = (techId: string) => {
    setTechnologies(
      technologies.map((tech) =>
        tech.id === techId ? { ...tech, isSelected: !tech.isSelected } : tech
      )
    );
  };

  const exportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your PDF is being generated...",
    });
    // PDF export logic would go here
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Cost Calculator</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Average Call Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={callDuration}
                onChange={(e) => setCallDuration(Number(e.target.value))}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total">Total Minutes</Label>
              <Input
                id="total"
                type="number"
                value={totalMinutes}
                onChange={(e) => setTotalMinutes(Number(e.target.value))}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin">Margin (%)</Label>
            <Input
              id="margin"
              type="number"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Technologies</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {technologies.map((tech) => (
                <div key={tech.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tech.id}
                    checked={tech.isSelected}
                    onCheckedChange={() => handleTechnologyToggle(tech.id)}
                  />
                  <Label htmlFor={tech.id}>{tech.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={calculateCost} className="bg-primary">
            <CalculatorIcon className="mr-2 h-4 w-4" />
            Calculate
          </Button>
          {totalCost && (
            <Button onClick={exportPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          )}
        </div>

        {totalCost && (
          <div className="mt-6 p-4 bg-secondary rounded-lg animate-fadeIn">
            <h3 className="text-xl font-heading font-semibold mb-2">Results</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                Base cost per minute: ${(totalCost / totalMinutes / (1 + margin / 100)).toFixed(4)}
              </p>
              <p className="text-gray-700">
                Cost per minute with margin: ${(totalCost / totalMinutes).toFixed(4)}
              </p>
              <p className="text-xl font-bold text-primary">
                Total Cost: ${totalCost.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}