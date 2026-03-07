import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Smartphone, CheckCircle2, Loader2, Wallet, CreditCard, Truck } from "lucide-react";
import { usePaymentSettings, useUpdatePaymentSettings } from "@/hooks/usePaymentSettings";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { data: settings, isLoading } = usePaymentSettings();
  const updateSettings = useUpdatePaymentSettings();
  const { toast } = useToast();

  const [upiId, setUpiId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [acceptCod, setAcceptCod] = useState(true);
  const [acceptUpi, setAcceptUpi] = useState(true);
  const [acceptCard, setAcceptCard] = useState(true);

  useEffect(() => {
    if (settings) {
      setUpiId(settings.upi_id);
      setReceiverName(settings.receiver_name);
      setReceiverPhone(settings.receiver_phone);
      setAcceptCod(settings.accept_cod);
      setAcceptUpi(settings.accept_upi);
      setAcceptCard(settings.accept_card);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(
      {
        upi_id: upiId,
        receiver_name: receiverName,
        receiver_phone: receiverPhone,
        accept_cod: acceptCod,
        accept_upi: acceptUpi,
        accept_card: acceptCard,
      },
      {
        onSuccess: () => toast({ title: "Payment settings saved successfully" }),
        onError: () => toast({ title: "Failed to save settings", variant: "destructive" }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Payment Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure payment methods and receiver details
        </p>
      </div>

      {/* UPI / Payment Receiver Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">UPI & Payment Receiver</CardTitle>
                <CardDescription>
                  Set UPI ID and receiver details shown at checkout
                </CardDescription>
              </div>
            </div>
            <Badge variant="default">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              This UPI ID will be displayed at checkout for customers to pay
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiverName">Receiver Name</Label>
              <Input
                id="receiverName"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Business Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiverPhone">Receiver Phone</Label>
              <Input
                id="receiverPhone"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="9876543210"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accepted Payment Methods</CardTitle>
          <CardDescription>
            Enable or disable payment options shown at checkout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Cash on Delivery (COD)</p>
                <p className="text-xs text-muted-foreground">Pay when order arrives</p>
              </div>
            </div>
            <Switch checked={acceptCod} onCheckedChange={setAcceptCod} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">UPI Payment</p>
                <p className="text-xs text-muted-foreground">Google Pay, PhonePe, Paytm, etc.</p>
              </div>
            </div>
            <Switch checked={acceptUpi} onCheckedChange={setAcceptUpi} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Credit / Debit Card</p>
                <p className="text-xs text-muted-foreground">Demo card payment</p>
              </div>
            </div>
            <Switch checked={acceptCard} onCheckedChange={setAcceptCard} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full sm:w-auto">
        {updateSettings.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Payment Settings"
        )}
      </Button>
    </div>
  );
};

export default AdminSettings;
