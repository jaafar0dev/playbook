import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, Sun, Moon, Coffee } from "lucide-react";

interface WorkHoursOnboardingProps {
  onComplete: (workHours: {
    startTime: string;
    endTime: string;
    breakTime: string;
  }) => void;
}

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];

export default function WorkHoursOnboarding({
  onComplete,
}: WorkHoursOnboardingProps) {
  const [startTime, setStartTime] = useState("9:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");
  const [breakTime, setBreakTime] = useState("1:00 PM");

  const handleSubmit = () => {
    onComplete({ startTime, endTime, breakTime });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Set Your Work Hours</CardTitle>
          <CardDescription>
            This helps us schedule tasks and reminders that fit your
            availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Start Time */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              When do you typically start work?
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.slice(0, 8).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setStartTime(time)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    startTime === time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Break Time */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-orange-500" />
              When do you take your main break?
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.slice(5, 11).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setBreakTime(time)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    breakTime === time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-indigo-500" />
              When do you typically end work?
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.slice(6).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setEndTime(time)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    endTime === time
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              You'll work from <strong>{startTime}</strong> to{" "}
              <strong>{endTime}</strong>, with a break at{" "}
              <strong>{breakTime}</strong>.
            </p>
          </div>

          <Button onClick={handleSubmit} className="w-full h-11">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
