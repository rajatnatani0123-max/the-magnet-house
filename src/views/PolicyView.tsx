import React, { useState } from 'react';
import { ShieldCheck, FileText, Truck, RotateCcw, Cpu } from 'lucide-react';

interface PolicyViewProps {
  initialDoc?: string;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ initialDoc = 'terms' }) => {
  const [activeDoc, setActiveDoc] = useState(initialDoc);

  const docs = [
    { id: 'terms', title: 'Terms of Service', icon: FileText },
    { id: 'privacy', title: 'Privacy Policy', icon: ShieldCheck },
    { id: 'shipping', title: 'Shipping & Delivery', icon: Truck },
    { id: 'refund', title: 'Returns & Replacement', icon: RotateCcw },
    { id: 'nfc-guide', title: 'NFC Technology & Guarantee', icon: Cpu },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-stone-200 pb-6 mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Legal & Transparency
        </span>
        <h1 className="text-3xl font-bold font-display text-stone-950 mt-1">
          Policies & Guarantees
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                activeDoc === doc.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <doc.icon className="w-4 h-4 shrink-0" />
              <span>{doc.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6 text-xs text-stone-700 leading-relaxed">
          {activeDoc === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display text-stone-900">Terms of Service</h2>
              <p>
                Welcome to The Magnet House. By ordering custom personalized products or using our digital Smart Link services, you agree to these terms.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">1. Customized Products & Intellectual Property</h3>
              <p>
                Customers retain full copyright to personal photos uploaded. You affirm that uploaded media does not infringe copyright, trademark, or contain unlawful material. We reserve the right to decline production of offensive content.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">2. Smart Link Hub Hosting</h3>
              <p>
                Every purchased smart magnet includes permanent hosting of its associated digital destination. The Magnet House guarantees uptime and allows users to update destination URLs at any time free of charge.
              </p>
            </div>
          )}

          {activeDoc === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display text-stone-900">Privacy Policy</h2>
              <p>
                We treat your memories with utmost confidentiality. Photos uploaded for custom magnet printing are stored strictly for fulfillment and preview rendering. We do not sell or share customer media with third parties.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">Analytics & NFC Taps</h3>
              <p>
                When a smartphone taps an NFC magnet, only privacy-safe aggregate data (timestamp, tap count, link clicked) is tracked for the owner&apos;s dashboard. No invasive trackers or cross-site fingerprinting scripts are used.
              </p>
            </div>
          )}

          {activeDoc === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display text-stone-900">Shipping Policy</h2>
              <p>
                All smart fridge magnets are custom manufactured in our Mumbai studio within 24 to 48 hours of order confirmation.
              </p>
              <p>
                Standard courier delivery is handled via BlueDart Express and Delhivery Air. Estimated delivery across metro cities is 2–4 business days. Free shipping is automatically applied on all orders above ₹999.
              </p>
            </div>
          )}

          {activeDoc === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display text-stone-900">Returns & Replacement Policy</h2>
              <p>
                Because magnets are customized with personal photos, physical returns for change-of-mind are not supported.
              </p>
              <h3 className="font-bold text-stone-900 text-sm">Print & Hardware Guarantee</h3>
              <p>
                However, if your magnet arrives damaged in shipping, with print blemishes, or with a malfunctioning NFC chip, notify our support within 7 days with a photograph. We will immediately manufacture and rush-ship a replacement magnet 100% free of charge.
              </p>
            </div>
          )}

          {activeDoc === 'nfc-guide' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-display text-stone-900">NFC Technology & Phone Compatibility</h2>
              <p>
                <strong>Hardware:</strong> Genuine NXP NTAG213 contactless microchips with dual-point tuned loop antennas.
              </p>
              <p>
                <strong>Compatibility:</strong> Compatible natively with iPhone 7 and above running iOS 14+, and all NFC-enabled Android devices running Android 5.0+.
              </p>
              <p>
                <strong>QR Redundancy:</strong> All units carry an archival laser-etched fallback QR code on reverse to guarantee 100% accessibility on any camera-equipped device.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
