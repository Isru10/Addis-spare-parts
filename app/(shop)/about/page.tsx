import { Metadata } from "next";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  ShieldCheck, Truck, Clock, Users, Wrench, Building2 
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Addis Parts",
  description: "Learn about our mission to modernize the spare parts industry in Ethiopia.",
};

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24 space-y-16 max-w-5xl mx-auto">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
          We Keep You Moving.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Addis Parts is Ethiopia&apos;s premier digital marketplace for genuine automotive spare parts. 
          We bridge the gap between suppliers, insurers, and car owners with transparency and speed.
        </p>
      </section>

      {/* 2. CORE VALUES GRID */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-brand-orange shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <ShieldCheck className="h-10 w-10 text-brand-orange mb-2" />
            <CardTitle>Authenticity Guaranteed</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            We fight the counterfeit market. Every part listed on our platform is vetted for origin and quality, ensuring your safety on the road.
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-900 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Clock className="h-10 w-10 text-blue-900 mb-2" />
            <CardTitle>Speed & Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Downtime costs money. Our advanced logistics network ensures that in-stock items are delivered within 24 hours in Addis Ababa.
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-600 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Users className="h-10 w-10 text-green-600 mb-2" />
            <CardTitle>Fair Pricing</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            No hidden fees or middleman markups. We provide transparent, market-verified quotations that insurance companies trust.
          </CardContent>
        </Card>
      </section>

      {/* 3. WHO WE SERVE */}
      <section className="bg-slate-50 rounded-2xl p-8 md:p-12 border">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Empowering the Ecosystem</h2>
            <p className="text-muted-foreground">
              We are not just a shop; we are a platform that connects the entire automotive ecosystem.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-blue-700 mt-1" />
                <div>
                  <span className="font-semibold text-slate-900">For Insurers</span>
                  <p className="text-sm text-slate-600">Digital proforma invoices, fraud prevention, and faster claim settlements.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-brand-orange mt-1" />
                <div>
                  <span className="font-semibold text-slate-900">For Mechanics</span>
                  <p className="text-sm text-slate-600">Reliable supply chain for workshops, ensuring repairs happen on time.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-green-700 mt-1" />
                <div>
                  <span className="font-semibold text-slate-900">For Fleet Owners</span>
                  <p className="text-sm text-slate-600">Bulk ordering and maintenance tracking for logistics companies.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Visual / Statistic */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <span className="block text-3xl font-bold text-slate-900">5000+</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Parts in Stock</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
              <span className="block text-3xl font-bold text-slate-900">48h</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Avg. Delivery</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border text-center col-span-2">
              <span className="block text-3xl font-bold text-slate-900">100%</span>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Verified Suppliers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER NOTE */}
      <section className="text-center pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          Addis Parts PLC is registered in Ethiopia. TIN: 0056992211.
          <br />
          Located at Bole Sub-city, Woreda 03, Addis Ababa.
        </p>
      </section>

    </div>
  );
}