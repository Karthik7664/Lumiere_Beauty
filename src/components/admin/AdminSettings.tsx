import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";

const AdminSettings = () => {
  // Placeholder - Stripe key will be configured later
  const stripeConfigured = false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure payment gateways and store settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Stripe Payment Gateway</CardTitle>
                <CardDescription>
                  Accept credit cards, UPI, and wallets
                </CardDescription>
              </div>
            </div>
            <Badge variant={stripeConfigured ? "default" : "secondary"}>
              {stripeConfigured ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Configured
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-dashed">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-sm">Stripe API Key Required</p>
                <p className="text-sm text-muted-foreground mt-1">
                  To enable real payments, you'll need to configure your Stripe API key.
                  The key will be securely stored and used to process payments.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe_key">Stripe Secret Key</Label>
            <Input
              id="stripe_key"
              type="password"
              placeholder="sk_live_... or sk_test_..."
              disabled
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Get your API keys from the{" "}
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Stripe Dashboard
              </a>
            </p>
          </div>

          <div className="pt-2">
            <Button disabled>
              Save Stripe Configuration
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Contact your administrator to configure payment settings.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Demo Mode</CardTitle>
          <CardDescription>
            Currently operating in demo mode for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-accent/50 rounded-lg p-4">
            <p className="text-sm">
              <strong>Demo checkout is active.</strong> Orders can be placed without real payment processing.
              This is useful for testing the complete order flow before enabling live payments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
