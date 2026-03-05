import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 5, 2026</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Lumiere Beauty website and services, you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed">
              To place orders or use certain features (such as AI Skin Analysis), you must create an account. 
              You are responsible for maintaining the confidentiality of your account credentials and for all 
              activities that occur under your account. You must provide accurate and complete information 
              during registration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Products & Pricing</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>All prices are displayed in Indian Rupees (₹) and include applicable taxes unless stated otherwise</li>
              <li>We reserve the right to modify prices at any time without prior notice</li>
              <li>Product descriptions and images are as accurate as possible but may vary slightly</li>
              <li>We reserve the right to limit quantities or refuse any order</li>
              <li>Promotional offers and discounts are subject to specific terms and may expire</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Orders & Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you place an order, you are making an offer to purchase. We reserve the right to accept 
              or decline your order. Payment must be completed at the time of order placement (for online 
              payments) or upon delivery (for Cash on Delivery). We accept UPI, credit/debit cards, and 
              Cash on Delivery as payment methods.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Shipping & Delivery</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Free shipping on orders above ₹999</li>
              <li>Standard shipping fee of ₹99 applies to orders below ₹999</li>
              <li>Estimated delivery times are provided at checkout and may vary</li>
              <li>We are not liable for delays caused by shipping carriers or force majeure events</li>
              <li>Risk of loss passes to you upon delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Returns & Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              We accept returns within 30 days of delivery for unopened products in original packaging. 
              Opened products may be returned within 14 days if you experience an adverse reaction. 
              Refunds will be processed to the original payment method within 7-10 business days after 
              we receive the returned item. Shipping costs for returns are borne by the customer unless 
              the return is due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. AI Skin Analysis</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our AI Skin Analysis feature provides personalized skincare recommendations based on the 
              information you provide. These recommendations are for informational purposes only and should 
              not be considered medical advice. Always consult a dermatologist for specific skin conditions 
              or concerns. We are not liable for any adverse reactions resulting from product recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on the Lumiere Beauty website, including text, graphics, logos, images, and 
              software, is the property of Lumiere Beauty or its content suppliers and is protected by 
              intellectual property laws. You may not reproduce, distribute, or create derivative works 
              without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Lumiere Beauty shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from your use of our services. Our total liability shall not exceed the 
              amount paid by you for the specific product or service giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service are governed by the laws of India. Any disputes shall be subject to 
              the exclusive jurisdiction of the courts in New Delhi, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any questions regarding these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@lumierebeauty.com" className="text-primary hover:underline">
                legal@lumierebeauty.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
