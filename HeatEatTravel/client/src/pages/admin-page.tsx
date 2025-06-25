import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Order } from '@shared/schema';
import { Clock, Package, Phone, MapPin, Train, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface OrderWithDetails extends Order {
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ['/api/admin/orders'],
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PATCH', `/api/admin/orders/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "Order Updated",
        description: "Order status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, paymentStatus }: { id: number; paymentStatus: string }) => {
      const res = await apiRequest('PATCH', `/api/admin/orders/${id}/payment`, { paymentStatus });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "Payment Updated",
        description: "Payment status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      placed: { color: 'bg-blue-500', icon: Clock, label: 'Placed' },
      preparing: { color: 'bg-yellow-500', icon: Package, label: 'Preparing' },
      ready: { color: 'bg-green-500', icon: CheckCircle, label: 'Ready' },
      delivered: { color: 'bg-gray-500', icon: CheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.placed;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-500', label: 'Pending' },
      completed: { color: 'bg-green-500', label: 'Paid' },
      failed: { color: 'bg-red-500', label: 'Failed' }
    };
    
    const statusColor = config[status as keyof typeof config] || config.pending;
    
    return (
      <Badge className={`${statusColor.color} text-white`}>
        <DollarSign className="h-3 w-3 mr-1" />
        {statusColor.label}
      </Badge>
    );
  };

  const filteredOrders = orders?.filter(order => 
    selectedStatus === 'all' || order.orderStatus === selectedStatus
  ) || [];

  const orderStats = {
    total: orders?.length || 0,
    placed: orders?.filter(o => o.orderStatus === 'placed').length || 0,
    preparing: orders?.filter(o => o.orderStatus === 'preparing').length || 0,
    ready: orders?.filter(o => o.orderStatus === 'ready').length || 0,
    delivered: orders?.filter(o => o.orderStatus === 'delivered').length || 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management Dashboard</h1>
          <p className="text-gray-600">Manage incoming orders for Heat&Eat train delivery service</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.placed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.preparing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ready</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.ready}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="placed">New Orders</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {selectedStatus === 'all' ? 'No orders have been placed yet.' : `No ${selectedStatus} orders found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), 'PPpp')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(order.orderStatus)}
                      {getPaymentBadge(order.paymentStatus)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{order.customerPhone}</span>
                          </div>
                          {order.seatInfo && (
                            <div className="flex items-center">
                              <Train className="h-4 w-4 text-gray-400 mr-2" />
                              <span>Seat: {order.seatInfo}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Train className="h-4 w-4 text-gray-400 mr-2" />
                            <span>Train ID: {order.trainId}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span>Station ID: {order.stationId}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Payment</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                          <p><span className="font-medium">Total:</span> LKR {parseFloat(order.totalAmount).toFixed(2)}</p>
                          <p><span className="font-medium">Delivery Fee:</span> LKR {parseFloat(order.deliveryFee).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                            <span>{item.name} × {item.quantity}</span>
                            <span>LKR {(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Update Order Status
                      </label>
                      <Select
                        value={order.orderStatus}
                        onValueChange={(status) => 
                          updateOrderStatusMutation.mutate({ id: order.id, status })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="placed">Placed</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {order.paymentMethod === 'cash' && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Status
                        </label>
                        <Select
                          value={order.paymentStatus}
                          onValueChange={(paymentStatus) => 
                            updatePaymentStatusMutation.mutate({ id: order.id, paymentStatus })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}