# Urban Cut Barbearia

**Autores:** Marlon Gabriel Alves Ferreira e Erick Rafael Passos  
**Tema:** Barbearia Profissional de Elite & Visagismo Urbano  
**Disciplina:** Linguagem de Programação para a Web (LPW) — 2026/2  
**Localização:** Avenida XV de Novembro / Rua Saldanha Marinho, 1420 - Centro, Guarapuava - PR  

---

## ✂️ Apresentação do Projeto

A **Urban Cut Barbearia** é a convergência entre a tradição clássica da navalha e o visagismo moderno de alto padrão. O sistema foi desenvolvido com arquitetura **Clean Code** e foco em **Design UX**, operando tanto para os clientes quanto para a gestão do negócio em duas frentes integradas:

1. **Portal do Cliente:** Experiência moderna para visualização de serviços, vitrine de cosméticos masculinos e **agendamento online com calendário interativo**, verificação de horários disponíveis em tempo real e emissão instantânea de comprovante.
2. **Painel do Proprietário (`dashboard.html`):** Centro de inteligência do gestor com métricas (KPIs de faturamento, total de atendimentos, ticket médio), agenda em tempo real com controle de status (*Confirmado*, *Concluído*, *Cancelado*) e histórico de produtos reservados.

---

## 🚀 Arquitetura Técnica & Clean Code

O projeto opera de forma 100% autônoma e offline em `localhost`, utilizando armazenamento e sincronização via `localStorage`:

* **`UrbanStorage`:** Gerenciador central de persistência para agendamentos e vendas, incluindo rotina de carga de dados demonstrativos (*seed data*).
* **`CalendarEngine`:** Gerador dinâmico de horários (09h00 às 19h30), validação de indisponibilidade por profissional (*Marlon Gabriel* ou *Erick Rafael*) e prevenção de agendamentos em horários já ocupados.
* **`CartEngine`:** Gerenciamento reativo da sacola de compras, filtros por categoria de produto sem recarregar a tela e cálculo automático de totais.
* **`DashboardEngine`:** Algoritmo que calcula faturamento total, ticket médio e taxa de distribuição dos serviços mais procurados da barbearia.
* **`NotificationSystem`:** Toasts flutuantes para feedback visual imediato ao usuário.

---

## 📁 Estrutura de Arquivos

```text
Urban Cut Barbearia/
├── logo.svg              # Logotipo vetorial em ouro e preto de alta resolução
├── index.html            # Portal do Cliente, Apresentação e Calendário de Horários
├── procedimentos.html    # Menu detalhado de serviços e experiências
├── produtos.html         # Vitrine de cosméticos com filtros e sacola de reservas
├── dashboard.html        # Painel do Proprietário com métricas e gestão
├── style.css             # Design System com tokens, variáveis CSS e efeitos glassmorphism
├── script.js             # Motor JavaScript unificado em arquitetura modular
└── README.md             # Documentação do projeto
```

---

## 💻 Como Rodar em Localhost

Você pode executar o projeto de várias formas simples:

### Opção 1: VS Code (Live Server)
1. Abra a pasta `Urban Cut Barbearia` no Visual Studio Code.
2. Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

### Opção 2: Servidor Python Local
No terminal aberto na pasta do projeto, execute:
```bash
python -m http.server 3000
```
Em seguida, abra no navegador: `http://localhost:3000`

### Opção 3: Execução Direta
Dê dois cliques no arquivo `index.html` para abrir diretamente no seu navegador preferido.

---

## 🎨 Paleta de Cores & Design Tokens

* **Fundo Principal:** `#0A0B0E` (Preto Profundo)
* **Superfícies & Cards:** `#101217` e `#141720`
* **Dourado Nobre (Accent):** `#E2B13C`
* **Bordas & Linhas:** `#232838`
* **Tipografia:** Google Fonts *Montserrat*
