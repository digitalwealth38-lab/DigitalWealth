import React from "react";
import {
  Gift,
  Target,
  ShieldCheck,
  Clock3,
  ExternalLink,
  Info,
  Sparkles,
} from "lucide-react";
import Navbar from "./Navbar";

const EarnOffers = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8 lg:px-10 pt-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Gift size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
                Separate Rewards Program
              </p>

              <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                Earn Offers
              </h1>
            </div>
          </div>

          <p className="text-gray-500 max-w-2xl text-sm md:text-base leading-relaxed">
            Complete eligible surveys, offers, and partner activities to earn
            additional rewards. This program is completely separate from our
            investment products.
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Info size={19} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Rewards are separate from investments
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Offers shown here are provided through third-party rewards
                partners. Completing an offer does not represent an investment
                or investment return. Offer availability, eligibility,
                verification, and reward amounts may vary.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Target size={21} />
            </div>

            <h3 className="font-bold text-gray-900 mb-2">
              1. Choose an Offer
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              Browse available surveys, apps, games, and other eligible
              partner activities.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4">
              <Clock3 size={21} />
            </div>

            <h3 className="font-bold text-gray-900 mb-2">
              2. Complete the Activity
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              Follow the partner's requirements and complete the selected
              activity successfully.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Gift size={21} />
            </div>

            <h3 className="font-bold text-gray-900 mb-2">
              3. Receive Your Reward
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              Once the partner confirms the qualifying activity, the eligible
              reward can be credited according to the rewards terms.
            </p>
          </div>

        </div>

        {/* Offerwall Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Offerwall Header */}
          <div className="px-6 py-5 md:px-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={17} className="text-orange-500" />

                <h2 className="text-lg font-black text-gray-900">
                  Available Offers
                </h2>
              </div>

              <p className="text-sm text-gray-500">
                Explore available offers from our rewards partners.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <ShieldCheck size={16} className="text-green-500" />
              Partner verified activities
            </div>

          </div>

          {/* 
            ==========================================================
            OFFERWALL PROVIDER GOES HERE
            ==========================================================
            
            Later we will replace this placeholder with your actual
            Offerwall provider integration.
          */}

          <div className="min-h-[420px] flex items-center justify-center p-8">

            <div className="max-w-md text-center">

              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Gift size={36} />
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-3">
                Offers Coming Soon
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Our partner offers will appear here once the rewards system is
                connected. You'll be able to browse eligible activities and
                earn additional rewards.
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-50 text-gray-500 text-xs font-bold">
                <Clock3 size={15} />
                Rewards marketplace is being prepared
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Information */}
        <div className="mt-8 grid md:grid-cols-2 gap-5">

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={19} className="text-green-600" />

              <h3 className="font-bold text-gray-900">
                Reward Verification
              </h3>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Rewards may require verification by the third-party partner.
              Completing an activity does not necessarily mean a reward will
              be credited immediately.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <ExternalLink size={19} className="text-blue-600" />

              <h3 className="font-bold text-gray-900">
                Third-Party Offers
              </h3>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Offers are provided by independent partners. Availability,
              requirements, and reward values may change based on the partner,
              offer, and user eligibility.
            </p>
          </div>

        </div>

        {/* Footer Notice */}
        <div className="mt-8 text-center pb-6">
          <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Earn Offers is a separate rewards program and is not part of
            Digital Wealth's investment products. Rewards are subject to
            applicable partner requirements and our Rewards Terms.
          </p>
        </div>

      </div>
    </div>
  );
};

export default EarnOffers;
