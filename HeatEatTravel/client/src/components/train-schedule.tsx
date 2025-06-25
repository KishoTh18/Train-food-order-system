import { useQuery } from "@tanstack/react-query";
import { Train } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainFront, Clock, Flag, Calendar, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TrainScheduleProps {
  onTrainSelect?: (train: Train) => void;
  selectedTrainId?: number;
}

export function TrainSchedule({ onTrainSelect, selectedTrainId }: TrainScheduleProps) {
  const { data: trains, isLoading, error } = useQuery<Train[]>({
    queryKey: ["/api/trains"],
  });

  if (isLoading) {
    return (
      <section id="schedule" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">Train Schedule</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your train and we'll deliver fresh meals right to your seat
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="schedule" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading train schedule. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const getTrainCardColors = (index: number) => {
    const colors = [
      { from: '#B91C1C', to: '#DC2626' }, // red-700 to red-600
      { from: '#059669', to: '#10B981' }, // emerald-600 to emerald-500
      { from: '#1D4ED8', to: '#3B82F6' }, // blue-700 to blue-500
      { from: '#EA580C', to: '#F97316' }, // orange-600 to orange-500
      { from: '#374151', to: '#4B5563' }  // gray-700 to gray-600
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="schedule" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">Train Schedule</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your train and we'll deliver fresh meals right to your seat
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {trains?.map((train, index) => (
            <Card 
              key={train.id} 
              className={`shadow-lg hover:shadow-xl transition-shadow ${
                selectedTrainId === train.id ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{
                background: `linear-gradient(to bottom right, ${getTrainCardColors(index).from}, ${getTrainCardColors(index).to})`,
                color: 'white'
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold font-serif">{train.name}</h3>
                  <TrainFront className="h-6 w-6" />
                </div>
                <div className="space-y-2 mb-4">
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Departure: {train.departureTime}
                  </p>
                  <p className="flex items-center">
                    <Flag className="h-4 w-4 mr-2" />
                    Arrival: {train.arrivalTime}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {train.frequency}
                  </p>
                  <p className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    {train.trainType}
                  </p>
                </div>
                <Button
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  onClick={() => onTrainSelect?.(train)}
                >
                  {selectedTrainId === train.id ? 'Selected' : 'Select This Train'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ticket Pricing Info */}
        <Card 
          className="text-gray-900"
          style={{
            background: 'linear-gradient(to right, #EAB308, #F59E0B)', // yellow-500 to amber-500
          }}
        >
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Train Ticket Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">2nd Class</p>
                <p className="text-2xl font-bold">LKR 900/-</p>
              </div>
              <div>
                <p className="font-semibold">3rd Class</p>
                <p className="text-2xl font-bold">LKR 460/-</p>
              </div>
              <div>
                <p className="font-semibold">Distance</p>
                <p className="text-2xl font-bold">292.39 km</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
