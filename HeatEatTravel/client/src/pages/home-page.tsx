import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { TrainSchedule } from "@/components/train-schedule";
import { FoodMenu } from "@/components/food-menu";
import { RouteMap } from "@/components/route-map";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Train, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Route Alert */}
      <Alert className="bg-gradient-to-r from-red-600 to-orange-500 text-white border-none rounded-none">
        <AlertTriangle className="h-4 w-4 text-white" />
        <AlertDescription className="font-medium text-center text-white">
          <strong>Service Alert:</strong> Currently available on Colombo Fort - Badulla routes only
        </AlertDescription>
      </Alert>

      <Hero />
      <TrainSchedule />
      <FoodMenu />
      <RouteMap />

      {/* Footer */}
      <footer 
        className="text-white py-12"
        style={{ backgroundColor: '#1E40AF' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Train className="h-8 w-8 mr-2" style={{ color: '#EA580C' }} />
                <h3 className="text-2xl font-bold font-sans">
                  Heat<span style={{ color: '#EA580C' }}>&</span>Eat
                </h3>
              </div>
              <p className="text-gray-300 mb-4">
                Bringing authentic Sri Lankan flavors to your train journey. Fresh, hot meals 
                delivered right to your seat on the Colombo Fort - Badulla route.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#menu" className="text-gray-300 hover:text-white transition-colors">Menu</a></li>
                <li><a href="#schedule" className="text-gray-300 hover:text-white transition-colors">Train Schedule</a></li>
                <li><a href="#routes" className="text-gray-300 hover:text-white transition-colors">Routes</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +94 11 234 5678
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@heatandeat.lk
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Colombo Fort Railway Station
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  24/7 Service
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Heat&Eat Sri Lanka. All rights reserved. | Licensed Train Food Service Provider</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
