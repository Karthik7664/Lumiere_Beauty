import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddress } from "@/types/ecommerce";
import { ArrowLeft, CreditCard, Lock, Package, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/currency";
import { useSavedAddresses, useSaveAddress, useDeleteAddress, SavedAddress } from "@/hooks/useSavedAddresses";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const emptyAddress: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "India",
};

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card">("cod");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    ...emptyAddress,
    email: user?.email || "",
  });
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [saveThisAddress, setSaveThisAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");

  const { data: savedAddresses } = useSavedAddresses();
  const saveAddressMutation = useSaveAddress();
  const deleteAddressMutation = useDeleteAddress();

  const shippingCost = subtotal >= 999 ? 0 : 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const selectSavedAddress = (addr: SavedAddress) => {
    setShippingAddress({
      firstName: addr.first_name,
      lastName: addr.last_name,
      email: addr.email,
      phone: addr.phone,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code,
      country: addr.country,
    });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddressMutation.mutate(id, {
      onSuccess: () => toast({ title: "Address deleted" }),
    });
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in to checkout", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add some products to your cart first", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Save address if requested
      if (saveThisAddress) {
        saveAddressMutation.mutate({
          label: addressLabel,
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip_code: shippingAddress.zipCode,
          country: shippingAddress.country,
          is_default: !savedAddresses?.length,
        });
      }

      const orderNumber = generateOrderNumber();
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: "confirmed",
          subtotal,
          shipping_cost: shippingCost,
          tax,
          total,
          shipping_address: shippingAddress as unknown as Record<string, unknown>,
          payment_method: paymentMethod,
          payment_status: paymentMethod === "cod" ? "pending" : "paid",
        } as never)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || "Unknown Product",
        product_image: item.product?.image_url || "/placeholder.svg",
        price: item.product?.price || 0,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      await clearCart();

      toast({ title: "Order placed successfully!", description: `Your order number is ${orderNumber}` });
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Saved Addresses */}
              {savedAddresses && savedAddresses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Saved Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="flex items-start justify-between rounded-lg border border-border p-4 cursor-pointer hover:border-primary transition-colors"
                        onClick={() => selectSavedAddress(addr)}
                      >
                        <div>
                          <p className="font-medium">{addr.label} — {addr.first_name} {addr.last_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {addr.address}, {addr.city}, {addr.state} - {addr.zip_code}
                          </p>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => { setShippingAddress({ ...emptyAddress, email: user?.email || "" }); setShowAddressForm(true); }}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add New Address
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Address Form */}
              {(showAddressForm || !savedAddresses?.length) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={shippingAddress.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={shippingAddress.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={shippingAddress.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" value={shippingAddress.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={shippingAddress.address} onChange={(e) => handleInputChange("address", e.target.value)} required />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={shippingAddress.city} onChange={(e) => handleInputChange("city", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={shippingAddress.state} onChange={(e) => handleInputChange("state", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">PIN Code</Label>
                        <Input id="zipCode" value={shippingAddress.zipCode} onChange={(e) => handleInputChange("zipCode", e.target.value)} required />
                      </div>
                    </div>

                    {/* Save address option */}
                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveThisAddress}
                        onChange={(e) => setSaveThisAddress(e.target.checked)}
                        className="rounded border-border"
                      />
                      <Label htmlFor="saveAddress" className="text-sm cursor-pointer">Save this address for future orders</Label>
                      {saveThisAddress && (
                        <Input
                          placeholder="Label (e.g. Home, Office)"
                          value={addressLabel}
                          onChange={(e) => setAddressLabel(e.target.value)}
                          className="w-40 h-8 text-sm"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "cod" | "upi" | "card")} className="space-y-3">
                    <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <div>
                        <p className="font-medium">Cash on Delivery (COD)</p>
                        <p className="text-sm text-muted-foreground">Pay when your order arrives.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-muted-foreground">Instant payment confirmation.</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <div>
                        <p className="font-medium">Credit / Debit Card</p>
                        <p className="text-sm text-muted-foreground">Secure card payment.</p>
                      </div>
                    </label>
                  </RadioGroup>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 text-primary" />
                    <p>Your payment information is secure and encrypted.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.product?.image_url || "/placeholder.svg"} alt={item.product?.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product?.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">{formatPrice((item.product?.price || 0) * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing your order, you agree to our{" "}
                    <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
