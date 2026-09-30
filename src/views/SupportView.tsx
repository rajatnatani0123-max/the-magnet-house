import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { storage } from '../lib/storage';

export const SupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'order' | 'customization' | 'nfc' | 'shipping' | 'general'>('nfc');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How does the NFC fridge magnet work with my phone?',
      a: 'Each magnet embeds a passive NTAG213 micro-chip. Simply hold the back of your smartphone (iPhone 7+ or any modern Android phone) near the magnet. The NFC chip draws a tiny electromagnetic pulse from your phone to instantly launch your personalized Smart Link Hub or Spotify track. No battery, no charging, no custom app required.',
    },
    {
      q: 'What if someone’s phone has NFC turned off or is an older model?',
      a: 'Every single smart magnet from The Magnet House also includes a discreet, laser-etched micro QR code fallback on the reverse side. Anyone can simply point their camera app at the QR code to open the exact same digital experience.',
    },
    {
      q: 'Can I change my Spotify playlist or photos after I receive the physical magnet?',
      a: 'Yes! That is the core magic of The Magnet House. The physical magnet links to your secure digital Smart Link record. You can log into your customer dashboard anytime and update the Spotify song, wedding video link, or photo gallery without buying a new magnet.',
    },
    {
      q: 'Will the magnet scratch my stainless steel refrigerator?',
      a: 'No. All our magnets feature either polished bevel acrylic edges, flush recessed magnetic cores, or protective cork/cushion backings specifically engineered to prevent scuffs or scratches on matte and brushed refrigerator finishes.',
    },
    {
      q: 'How long does custom production and shipping take?',
      a: 'Custom magnets are laser printed, UV cured, and programmed within 24–48 hours at our Mumbai workshop. Express courier delivery takes 2–4 business days across India.',
    },
    {
      q: 'Can I order custom smart magnets in bulk for wedding invitations or corporate gifts?',
      a: 'Absolutely! We offer volume pricing for weddings, event favors, and corporate business cards. Contact our team below with your estimated quantity for custom bulk rates.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !subject || !message) return;

    const ticket = storage.createTicket({
      customerEmail: email,
      customerName: name || 'Valued Customer',
      category,
      subject,
      message,
      priority: 'medium',
    });

    setSubmittedTicket(ticket.ticketNumber);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Customer Care & Help Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-950 mt-1">
          How Can We Help You?
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2">
          Find instant answers regarding NFC compatibility, custom printing, or submit a support ticket.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold font-display text-stone-900 mb-2">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-900"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ticket form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs h-fit">
          <h3 className="text-base font-bold font-display text-stone-900 mb-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-stone-700" />
            <span>Submit a Support Ticket</span>
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Our team responds within 4 business hours.
          </p>

          {submittedTicket ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-950 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold">Ticket Submitted!</h4>
              <p>Reference Ticket ID: <span className="font-mono font-bold">{submittedTicket}</span></p>
              <p className="text-[11px] text-emerald-800">
                A confirmation has been sent to your email with direct updates.
              </p>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="mt-2 text-emerald-900 font-semibold underline text-[11px]"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sen"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Topic</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full border border-stone-300 rounded-lg p-2"
                >
                  <option value="nfc">NFC & Smart Link Configuration</option>
                  <option value="customization">Image Upload & Customization</option>
                  <option value="shipping">Shipping & Tracking</option>
                  <option value="order">Order Cancellation / Change</option>
                  <option value="general">Bulk Wedding / Corporate Inquiries</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide your order number if applicable..."
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Support Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
