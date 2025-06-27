import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Church, TrendingUp, Shield, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 animate-pulse-glow">
                <Church className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-poppins">
                  PesanTech Finance
                </h1>
                <p className="text-slate-400 text-sm">Modern Financial Management</p>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-float">
              Manage Your Pesantren
              <br />
              Finances with Ease
            </h2>
            
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              A futuristic, transparent, and secure financial management system designed specifically for Islamic boarding schools. 
              Track donations, expenses, and generate comprehensive reports with role-based access control.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl hover-glow animate-glow"
              onClick={() => window.location.href = "/api/login"}
            >
              Get Started
              <TrendingUp className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card border-slate-700/50 hover-glow animate-float">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Real-time Financial Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Monitor income, expenses, and donations in real-time with intuitive dashboards and detailed analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-slate-700/50 hover-glow animate-float" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Role-based Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Secure access with different permission levels for administrators, treasurers, and staff members.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-slate-700/50 hover-glow animate-float" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Comprehensive Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Generate detailed financial reports, export data to PDF/CSV, and maintain complete transparency.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Islamic Finance Quote */}
          <div className="text-center">
            <div className="glass-card p-8 rounded-2xl border-slate-700/50 max-w-2xl mx-auto">
              <blockquote className="text-lg italic text-slate-200 mb-4">
                "And give full measure when you measure, and weigh with an even balance. That is better and fairer in the final determination."
              </blockquote>
              <cite className="text-slate-400">— Quran 17:35</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
