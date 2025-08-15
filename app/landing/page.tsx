import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Shield, TrendingUp, Star, ArrowRight, Users, Award, Clock } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold text-foreground">Audito</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Depoimentos
              </a>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Testar Grátis
                </Button>
              </Link>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Assinar Agora
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Powered by AI
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
              Transforme suas telas em
              <span className="text-primary"> experiências perfeitas</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Audito usa inteligência artificial para analisar suas interfaces e fornecer insights precisos sobre
              acessibilidade, usabilidade e design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                  Começar Teste Grátis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg bg-transparent">
                Ver Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✓ Teste grátis por 14 dias • ✓ Sem cartão de crédito • ✓ Cancele a qualquer momento
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-muted-foreground mb-8">Confiado por mais de 10.000 designers e desenvolvedores</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-2xl font-bold">Figma</div>
              <div className="text-2xl font-bold">Adobe</div>
              <div className="text-2xl font-bold">Sketch</div>
              <div className="text-2xl font-bold">Framer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Recursos que fazem a diferença
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Cada funcionalidade foi pensada para acelerar seu workflow e melhorar a qualidade dos seus designs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Análise de Acessibilidade</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Detecta problemas de contraste, hierarquia visual e compatibilidade com leitores de tela
                  automaticamente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Métricas de Usabilidade</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Avalia espaçamentos, alinhamentos e fluxo visual para garantir uma experiência intuitiva.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Sugestões Inteligentes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receba recomendações específicas e acionáveis para melhorar cada aspecto da sua interface.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Análise Instantânea</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Resultados em segundos, não em horas. Acelere seu processo de design e iteração.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Colaboração em Equipe</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Compartilhe análises e insights com sua equipe para manter todos alinhados.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Relatórios Detalhados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Exporte relatórios completos para apresentar melhorias aos stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "Audito revolucionou nosso processo de design. Conseguimos identificar e corrigir problemas de
                  acessibilidade que passavam despercebidos."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Maria Silva</p>
                    <p className="text-sm text-muted-foreground">UX Designer, TechCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "A velocidade de análise é impressionante. O que levava horas agora leva minutos, e com muito mais
                  precisão."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent font-semibold">J</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">João Santos</p>
                    <p className="text-sm text-muted-foreground">Frontend Developer, StartupXYZ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "Ferramenta essencial para qualquer equipe que se preocupa com qualidade. Os insights são sempre
                  precisos e acionáveis."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Ana Costa</p>
                    <p className="text-sm text-muted-foreground">Product Manager, DesignStudio</p>
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
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Planos para cada necessidade
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comece grátis e escale conforme sua equipe cresce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold mb-2">Starter</h3>
                <p className="text-muted-foreground mb-6">Para designers individuais</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Grátis</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>5 análises por mês</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Relatórios básicos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Suporte por email</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">Mais Popular</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold mb-2">Professional</h3>
                <p className="text-muted-foreground mb-6">Para equipes pequenas</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">R$ 49</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Análises ilimitadas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Relatórios avançados</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Colaboração em equipe</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90">Assinar Agora</Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold mb-2">Enterprise</h3>
                <p className="text-muted-foreground mb-6">Para grandes organizações</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">R$ 149</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Tudo do Professional</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>API personalizada</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Integrações customizadas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    <span>Suporte dedicado</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-transparent">
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Pronto para transformar seus designs?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de designers que já melhoraram suas interfaces com Audito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Começar Teste Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Audito</h3>
              <p className="text-muted-foreground leading-relaxed">
                Seu companheiro de design para auditoria de telas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Carreiras
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Audito. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
