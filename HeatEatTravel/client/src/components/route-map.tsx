import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Station } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainFront, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RouteMapProps {
  onStationSelect?: (station: Station) => void;
  selectedStationId?: number;
}

export function RouteMap({ onStationSelect, selectedStationId }: RouteMapProps) {
  const [showAllStations, setShowAllStations] = useState(false);

  const { data: stations, isLoading, error } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  if (isLoading) {
    return (
      <section id="routes" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">Route & Stations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your pickup station along the Colombo Fort - Badulla route
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="routes" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error loading stations. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const majorStations = stations?.filter(station => 
    ['Colombo Fort', 'Kandy', 'Peradeniya', 'Gampola', 'Nawalapitiya', 'Hatton', 
     'Nanuoya', 'Ambewela', 'Ohiya', 'Haputale', 'Bandarawela', 'Ella', 'Badulla'].includes(station.name)
  ) || [];

  const firstHalf = majorStations.slice(0, Math.ceil(majorStations.length / 2));
  const secondHalf = majorStations.slice(Math.ceil(majorStations.length / 2));

  const displayStations = showAllStations ? stations : majorStations;

  return (
    <section id="routes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">Route & Stations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your pickup station along the Colombo Fort - Badulla route
          </p>
        </div>

        {/* Route Visualization */}
        <Card 
          className="mb-8"
          style={{
            background: 'linear-gradient(to right, #1E40AF, #059669)', // blue-800 to emerald-600
          }}
        >
          <CardContent className="p-8">
            <div className="text-center text-white mb-8">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
                <TrainFront className="mr-2" />
                Colombo Fort ↔ Badulla Route
              </h3>
              <p className="text-lg">292.39 km • {stations?.length || 73} Stations • 71 Weekly Trains</p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between text-white font-bold text-lg mb-4">
                <span>Colombo Fort</span>
                <span>Badulla</span>
              </div>
              <div className="w-full h-2 bg-white bg-opacity-30 rounded-full mb-6">
                <div className="h-2 rounded-full w-full relative" style={{ backgroundColor: '#EAB308' }}>
                  <div className="absolute top-0 left-0 w-3 h-3 rounded-full -mt-0.5" style={{ backgroundColor: '#B91C1C' }}></div>
                  <div className="absolute top-0 right-0 w-3 h-3 rounded-full -mt-0.5" style={{ backgroundColor: '#B91C1C' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Station Selection */}
        {showAllStations ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stations?.map((station) => (
              <div
                key={station.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedStationId === station.id ? 'text-white hover:opacity-90' : 'bg-gray-50'
                }`}
                style={{
                  backgroundColor: selectedStationId === station.id ? '#B91C1C' : '#F9FAFB'
                }}
                onClick={() => onStationSelect?.(station)}
              >
                <div>
                  <p className="font-medium">{station.name}</p>
                  <p className="text-sm opacity-75">{station.sinhalaName}</p>
                </div>
                <span className="text-sm opacity-75">{station.distanceFromColombo}km</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2" />
                Major Stations (First Half)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {firstHalf.map((station) => (
                  <div
                    key={station.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedStationId === station.id ? 'bg-sri-red text-white hover:bg-sri-red' : 'bg-gray-50'
                    }`}
                    onClick={() => onStationSelect?.(station)}
                  >
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm opacity-75">{station.sinhalaName}</p>
                    </div>
                    <span className="text-sm opacity-75">{station.distanceFromColombo}km</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2" />
                Major Stations (Second Half)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {secondHalf.map((station) => (
                  <div
                    key={station.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedStationId === station.id ? 'bg-sri-red text-white hover:bg-sri-red' : 'bg-gray-50'
                    }`}
                    onClick={() => onStationSelect?.(station)}
                  >
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm opacity-75">{station.sinhalaName}</p>
                    </div>
                    <span className="text-sm opacity-75">{station.distanceFromColombo}km</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button
            className="text-white px-8 py-3 font-semibold hover:opacity-90"
            style={{ backgroundColor: '#B91C1C' }}
            onClick={() => setShowAllStations(!showAllStations)}
          >
            {showAllStations ? 'Show Major Stations Only' : `View All ${stations?.length || 73} Stations`}
          </Button>
        </div>
      </div>
    </section>
  );
}
