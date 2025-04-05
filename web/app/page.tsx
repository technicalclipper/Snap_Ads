"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Target, Shield, Zap } from "lucide-react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { Badge } from "./components/Badge";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              SnapAds
            </Link>
            <div className="flex space-x-4">
              <Link href="/advertiser">
                <Button variant="ghost">Advertise</Button>
              </Link>
              <Link href="/browse">
                <Button>Browse Ads</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4">
                Web3 Advertising Revolution
              </Badge>
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 gradient-text">
                The Future of <br />
                Decentralized Advertising
              </h1>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
            >
              Connect advertisers directly with viewers through blockchain
              technology. No intermediaries, transparent rewards, and verifiable
              engagement.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/advertiser">
                <Button size="lg" leftIcon={<Target className="w-5 h-5" />}>
                  Start Advertising
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  leftIcon={<Coins className="w-5 h-5" />}
                >
                  Earn Rewards
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge variant="outline" className="mb-4">
              The Problem
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Traditional Advertising is Broken
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              High fees, lack of transparency, and questionable engagement
              metrics plague traditional advertising platforms.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center h-full">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  High Platform Fees
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Traditional platforms take up to 45% of advertising budgets in
                  fees
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center h-full">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lack of Trust</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  No way to verify view counts or engagement metrics
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center h-full">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Poor Targeting</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Limited control over who sees your ads and when
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge variant="outline" className="mb-4">
              The Solution
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Web3-Native Advertising Platform
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              SnapAds leverages blockchain technology to create a transparent,
              efficient, and rewarding advertising ecosystem.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              {
                icon: <Coins className="w-6 h-6 text-green-500" />,
                title: "Direct Payments",
                description:
                  "Advertisers pay viewers directly through smart contracts",
                bgColor: "bg-green-100 dark:bg-green-900/20",
              },
              {
                icon: <Shield className="w-6 h-6 text-blue-500" />,
                title: "Verified Views",
                description:
                  "All engagements are recorded on-chain for transparency",
                bgColor: "bg-blue-100 dark:bg-blue-900/20",
              },
              {
                icon: <Target className="w-6 h-6 text-indigo-500" />,
                title: "Precise Targeting",
                description: "Choose exactly where and when your ads appear",
                bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
              },
              {
                icon: <Zap className="w-6 h-6 text-amber-500" />,
                title: "Instant Rewards",
                description: "Viewers earn crypto instantly after watching ads",
                bgColor: "bg-amber-100 dark:bg-amber-900/20",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="p-6 text-center h-full">
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Card
            variant="glass"
            className="p-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20"
          >
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Ready to Transform Your Advertising?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Join the decentralized advertising revolution today and experience
              the future of digital marketing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/advertiser">
                <Button
                  size="lg"
                  leftIcon={<Target className="w-5 h-5" />}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Start Advertising
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}
