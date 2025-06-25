import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/lib/cart-context";
import { Navigation } from "@/components/navigation";
import { TrainSchedule } from "@/components/train-schedule";
import { RouteMap } from "@/components/route-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Train, Station } from "@shared/schema";
import { CreditCard, DollarSign, Phone, MapPin, TrainFront } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const checkoutSchema = z.object({
  trainId: z.number().min(1, "Please select a train"),
  stationId: z.number().min(1, "Please select a pickup station"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  seatInfo: z.string().optional(),
  paymentMethod: z.enum(["card", "cash"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function PaymentForm({ 
  orderData, 
  onSuccess 
}: { 
  orderData: any; 
  onSuccess: (orderId: number) => void; 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      const order = await orderResponse.json();

      if (orderData.paymentMethod === "cash") {
        // For cash payments, order is complete
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed. Pay cash on delivery.",
        });
        onSuccess(order.id);
        return;
      }

      // For card payments, process with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Confirm payment success on backend
        await apiRequest("POST", "/api/payment-success", { orderId: order.id });
        
        toast({
          title: "Payment Successful",
          description: "Your order has been placed and payment confirmed!",
        });
        onSuccess(order.id);
      }
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {orderData.paymentMethod === "card" && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <PaymentElement />
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-sri-red to-warm-orange text-white py-4 text-lg font-semibold"
        disabled={isProcessing || (orderData.paymentMethod === "card" && (!stripe || !elements))}
      >
        {isProcessing 
          ? "Processing..." 
          : orderData.paymentMethod === "card" 
            ? "Pay Now" 
            : "Place Order (Cash on Delivery)"
        }
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerPhone: user?.phone || "",
      seatInfo: "",
      paymentMethod: "cash",
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  // Redirect if cart is empty
  if (items.length === 0) {
    setLocation("/");
    return null;
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 100;
  const total = subtotal + deliveryFee;

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", { 
        amount: amount.toString() 
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedTrain || !selectedStation) {
      toast({
        title: "Incomplete Selection",
        description: "Please select both a train and pickup station",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      trainId: selectedTrain.id,
      stationId: selectedStation.id,
      totalAmount: total.toString(),
      deliveryFee: deliveryFee.toString(),
      paymentMethod: data.paymentMethod,
      customerPhone: data.customerPhone,
      seatInfo: data.seatInfo || "",
      items: items.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
      })),
    };

    if (data.paymentMethod === "card") {
      // Create payment intent for card payments
      createPaymentIntentMutation.mutate(total);
      form.setValue("orderData", orderData);
    } else {
      // Process cash order directly
      try {
        const response = await apiRequest("POST", "/api/orders", orderData);
        const order = await response.json();
        
        toast({
          title: "Order Placed Successfully",
          description: `Order #${order.id} has been placed. Pay cash on delivery.`,
        });
        
        clearCart();
        setLocation("/");
      } catch (error: any) {
        toast({
          title: "Order Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleOrderSuccess = (orderId: number) => {
    clearCart();
    setLocation("/");
  };

  const orderData = {
    ...form.getValues(),
    trainId: selectedTrain?.id,
    stationId: selectedStation?.id,
    totalAmount: total.toString(),
    deliveryFee: deliveryFee.toString(),
    items: items.map(item => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      price: item.menuItem.price,
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans mb-4">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600">Review your selection and choose payment method</p>
        </div>

        {/* Train Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Select Your Train</h2>
          <TrainSchedule 
            onTrainSelect={(train) => {
              setSelectedTrain(train);
              form.setValue("trainId", train.id);
            }}
            selectedTrainId={selectedTrain?.id}
          />
        </div>

        {/* Station Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Select Pickup Station</h2>
          <RouteMap 
            onStationSelect={(station) => {
              setSelectedStation(station);
              form.setValue("stationId", station.id);
            }}
            selectedStationId={selectedStation?.id}
          />
        </div>

        {/* Order Summary and Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTrain && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <TrainFront className="mr-2 h-4 w-4" />
                    Selected Train
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{selectedTrain.name}</p>
                    <p className="text-sm text-gray-600">
                      Departure: {selectedTrain.departureTime} • Arrival: {selectedTrain.arrivalTime}
                    </p>
                  </div>
                </div>
              )}

              {selectedStation && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Pickup Station
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{selectedStation.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedStation.sinhalaName} • {selectedStation.distanceFromColombo}km from Colombo Fort
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.menuItem.id} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{item.menuItem.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">
                        LKR {(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>LKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>LKR {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2" style={{ color: '#B91C1C' }}>
                  <span>Total</span>
                  <span>LKR {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>3. Payment & Contact Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <Label htmlFor="phone" className="flex items-center mb-2">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    {...form.register("customerPhone")}
                    placeholder="+94 77 123 4567"
                  />
                  {form.formState.errors.customerPhone && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.customerPhone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seat">Seat/Coach Number (Optional)</Label>
                  <Input
                    id="seat"
                    {...form.register("seatInfo")}
                    placeholder="Coach A, Seat 15"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Payment Method *</Label>
                  <RadioGroup
                    value={watchPaymentMethod}
                    onValueChange={(value) => form.setValue("paymentMethod", value as "card" | "cash")}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <CreditCard className="mr-3 h-5 w-5 text-deep-blue" />
                          <div>
                            <p className="font-semibold">Credit/Debit Card</p>
                            <p className="text-sm text-gray-600">Pay securely with your card</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <DollarSign className="mr-3 h-5 w-5 text-forest-green" />
                          <div>
                            <p className="font-semibold">Cash on Delivery</p>
                            <p className="text-sm text-gray-600">Pay when your order arrives</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.paymentMethod && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                {/* Payment Processing */}
                {watchPaymentMethod === "card" && clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm orderData={orderData} onSuccess={handleOrderSuccess} />
                  </Elements>
                ) : watchPaymentMethod === "cash" ? (
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sri-red to-warm-orange text-white py-4 text-lg font-semibold"
                    disabled={!selectedTrain || !selectedStation}
                  >
                    Place Order (Cash on Delivery)
                  </Button>
                ) : watchPaymentMethod === "card" ? (
                  <Button
                    type="submit"  
                    className="w-full bg-gradient-to-r from-sri-red to-warm-orange text-white py-4 text-lg font-semibold"
                    disabled={!selectedTrain || !selectedStation || createPaymentIntentMutation.isPending}
                  >
                    {createPaymentIntentMutation.isPending ? "Setting up payment..." : "Set up Card Payment"}
                  </Button>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
