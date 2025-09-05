"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Globe, Shield, Zap, Star, Users, Award, Clock, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Audito</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Testimonials
              </a>
              <Link href="/">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  Try Free
                </Button>
              </Link>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 bg-blue-50 text-blue-700 border-blue-200 font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Análise de Design com IA
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transforme seus designs em{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                experiências perfeitas
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              Analise e melhore suas interfaces com insights de IA para acessibilidade, usabilidade e excelência em design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Iniciar Análise Gratuita
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl">
                Ver Demonstração
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4 font-medium">
              ✓ Teste gratuito de 14 dias • ✓ Sem cartão de crédito • ✓ Cancele a qualquer momento
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-8 font-medium">Trusted by over 10,000 designers and developers</p>
            <div className="flex items-center justify-center space-x-8 opacity-70">
              <div className="text-2xl font-bold text-gray-500">Figma</div>
              <div className="text-2xl font-bold text-gray-500">Adobe</div>
              <div className="text-2xl font-bold text-gray-500">Sketch</div>
              <div className="text-2xl font-bold text-gray-500">Framer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Features that make the difference
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Every feature is designed to accelerate your workflow and improve the quality of your designs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Análise de Acessibilidade</h3>
                <p className="text-gray-700 leading-relaxed">
                  Detecte automaticamente problemas de contraste, hierarquia visual e compatibilidade com leitores de tela.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-green-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Usability Metrics</h3>
                <p className="text-gray-700 leading-relaxed">
                  Evaluate spacing, alignment, and visual flow to ensure an intuitive user experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-purple-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Suggestions</h3>
                <p className="text-gray-700 leading-relaxed">
                  Receive specific, actionable recommendations to improve every aspect of your interface.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-orange-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Análise Instantânea</h3>
                <p className="text-gray-700 leading-relaxed">
                  Obtenha resultados em segundos, não horas. Acelere seu processo de design e ciclos de iteração.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-pink-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Team Collaboration</h3>
                <p className="text-gray-700 leading-relaxed">
                  Share analyses and insights with your team to keep everyone aligned and informed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-yellow-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Detailed Reports</h3>
                <p className="text-gray-700 leading-relaxed">
                  Export comprehensive reports to present improvements to stakeholders and clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              What our users say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed font-medium">
                  "O Audito revolucionou nosso processo de design. Agora podemos identificar e corrigir problemas de acessibilidade que antes passavam despercebidos."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Maria Silva</p>
                    <p className="text-sm text-gray-600">UX Designer, TechCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed font-medium">
                  "A velocidade da análise é impressionante. O que costumava levar horas agora leva minutos, com muito mais precisão."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">J</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">João Santos</p>
                    <p className="text-sm text-gray-600">Frontend Developer, StartupXYZ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-800 mb-6 leading-relaxed font-medium">
                  "Essential tool for any team that cares about quality. The insights are always accurate and actionable."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ana Costa</p>
                    <p className="text-sm text-gray-600">Gerente de Produto, DesignStudio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Plans for every need
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Start free and scale as your team grows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Starter</h3>
                <p className="text-gray-600 mb-6">For individual designers</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">Free</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">5 analyses per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Basic reports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  Start Free
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-500 shadow-xl relative ring-2 ring-blue-100">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1 font-medium">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Professional</h3>
                <p className="text-gray-600 mb-6">For small teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Unlimited analyses</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Advanced reports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$149</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Everything in Professional</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Custom API</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your designs?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of designers who have already improved their interfaces with Audito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-blue-50 border-blue-200 hover:border-blue-300 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-white/30 text-white hover:bg-white/10 font-semibold"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Audito</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your design companion for interface auditing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Produto</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors font-medium">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 Audito. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}