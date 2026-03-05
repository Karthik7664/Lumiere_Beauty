import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 5, 2026</p>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Lumiere Beauty, we collect information you provide directly to us, including your name, email address, 
              shipping address, phone number, and payment information when you create an account, place an order, 
              or contact our support team. We also collect skin analysis data (photos and questionnaire responses) 
              when you use our AI Skin Analysis feature.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>To process and fulfill your orders, including shipping and returns</li>
              <li>To provide personalized skincare recommendations through our AI analysis</li>
              <li>To communicate with you about orders, promotions, and updates</li>
              <li>To improve our products, services, and website experience</li>
              <li>To prevent fraud and ensure platform security</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. AI Skin Analysis Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use our AI Skin Analysis feature, images you upload are processed securely to generate 
              personalized skincare recommendations. Your skin analysis data is stored in your account and is 
              never shared with third parties. You can delete your analysis history at any time from your dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing & Third Parties</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share your data with trusted service providers 
              who assist us in operating our platform (e.g., payment processors, shipping carriers). These 
              partners are contractually obligated to protect your data and use it only for the services they 
              provide to us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures including encryption, secure servers, and 
              access controls to protect your personal information. All payment transactions are processed 
              through secure, PCI-compliant payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies & Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, remember your 
              preferences, and analyze site traffic. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access, update, or delete your personal information</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Request a copy of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data for as long as your account is active or as needed to provide 
              services. Order records are kept for a minimum of 5 years for legal and accounting purposes. 
              You may request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@lumierebeauty.com" className="text-primary hover:underline">
                privacy@lumierebeauty.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
