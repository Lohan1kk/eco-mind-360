# EcoMind 360 🌿📡

**Plataforma de Inteligência Territorial e Monitoramento Ambiental dos 7 Ambientes Brasileiros**

Desenvolvido para uma demonstração escolar prática de alto impacto com dados reais, rastreáveis e metodologia científica transparente. Orçamento: **R$ 0**.

---

## 🚀 Como Executar o Projeto Localmente

O projeto está localizado na pasta:
`C:\Users\Administrator\.gemini\antigravity\scratch\ecomind-360`

> 💡 **Recomendação:** No Antigravity ou VS Code, defina a pasta `ecomind-360` como o seu **Espaço de Trabalho Ativo (Active Workspace)** para navegar e editar com facilidade.

### 1. Pré-requisitos (Já configurados na máquina)
- **Node.js**: v20.18.0 LTS
- **npm**: 10.8.2
- **Git**: 2.56.0

### 2. Comandos Principais
Abra o terminal dentro da pasta `ecomind-360`:

```bash
# Modo de Desenvolvimento (Hot Reload)
npm run dev

# Compilação de Produção
npm run build

# Execução em Modo de Produção
npm run start
```

Acesse a aplicação no seu navegador: **[http://localhost:3000](http://localhost:3000)**

---

## 🗺️ Os Sete Ambientes Monitorados

1. **Amazônia**: 4.196.943 km² (49,29% do Brasil) | 79,5% veg. nativa | Queda histórica de 30,6% no PRODES 2024.
2. **Cerrado**: 2.036.448 km² (23,92% do Brasil) | 50,0% veg. nativa | "Berço das águas" e polo agrícola MATOPIBA.
3. **Mata Atlântica**: 1.110.182 km² (13,04% do Brasil) | 12,4% veg. nativa | Abriga mais de 72% da população brasileira.
4. **Caatinga**: 844.453 km² (9,92% do Brasil) | 59,0% veg. nativa | Bioma 100% exclusivo do Brasil; semiárido.
5. **Pampa**: 176.496 km² (2,07% do Brasil) | 41,9% campos nativos | Localizado no Rio Grande do Sul.
6. **Pantanal**: 150.355 km² (1,76% do Brasil) | 82,8% veg. nativa | Maior planície úmida do planeta; monitoramento de incêndios.
7. **Sistema Costeiro-Marinho**: ~514.000 km² de costa + 3.600.000 km² de Zona Econômica Exclusiva (Amazônia Azul) | Manguezais e recifes.

---

## 📡 Fontes de Dados Oficiais Integradas

| Fonte | Sistema / Coleção | Tipo de Dado |
|---|---|---|
| **INPE** | PRODES | Taxa anual auditada de desmatamento consolidado |
| **INPE** | DETER | Alertas rápidos em tempo real para fiscalização do IBAMA |
| **INPE** | BDQueimadas | Série histórica e satélite de referência de focos de calor |
| **NASA EOSDIS** | NASA FIRMS | Feed ao vivo 24h de anomalias térmicas (MODIS e VIIRS) |
| **MapBiomas** | Coleção 9 (1985-2023) | Uso e cobertura da terra e remanescentes de vegetação |
| **IBGE** | Biomas e ZEE (2024) | Malha cartográfica oficial em GeoJSON |
| **ICMBio** | CNUC / SisBio | Cadastro Nacional de Unidades de Conservação |

---

## 📋 Checklist de Funcionalidades (Missão 48 Horas)

- [x] **Ambiente Windows:** Instalação e configuração de Node.js v20 LTS e Git portáteis sem custos.
- [x] **Estrutura Base:** Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- [x] **Identidade Visual:** Tema escuro padrão elegante inspirado em Google Earth, alternância para tema claro, sidebar responsiva, cabeçalho com busca global instantânea e filtros.
- [x] **Dashboard Geral (`/dashboard`):** 4 KPIs centrais com tendências, gráfico de desmatamento PRODES (2018-2024), gráfico de uso do solo MapBiomas, grade dos 7 ambientes e feed de alertas.
- [x] **Mapa Interativo (`/mapa`):** Leaflet com controle de camadas (CartoDB Escuro, Satélite ESRI, OSM), polígonos GeoJSON oficiais do IBGE, marcadores com anéis pulsantes para focos de calor da NASA e drawer lateral detalhado ao clicar.
- [x] **Explorador dos 7 Ambientes (`/biomas` e `/biomas/[id]`):** Fichas técnicas individuais completas, matriz comparativa oficial e principais vetores de degradação.
- [x] **Tabela de Alertas (`/alertas`):** Busca em tempo real, filtros por bioma/tipo/confiança e painel lateral com laudo técnico.
- [x] **Comparador Científico (`/comparacao`):** Confronto direto lado a lado entre qualquer combinação dos 7 biomas com gráficos de barra.
- [x] **Metodologia e Transparência (`/metodologia`):** Glossário diferenciando Foco de Calor vs Área Queimada e DETER vs PRODES, limitações de satélites e links de auditoria.
- [x] **API em Tempo Real (`/api/alerts/firms`):** Ingestão do feed ao vivo da NASA com georreferenciamento para biomas brasileiros e fallback local resiliente.

---

## ☁️ Como Publicar Gratuitamente no GitHub e Vercel (R$ 0)

### Opção 1: Vercel (Recomendado para apresentação)
1. Crie uma conta gratuita em [vercel.com](https://vercel.com).
2. Instale o CLI da Vercel ou conecte ao GitHub:
   ```bash
   npx vercel
   ```
3. O deploy é automático e gera um link HTTPS público (ex: `ecomind-360.vercel.app`) para você apresentar no celular, tablet ou projetor.

### Opção 2: GitHub
1. Inicialize o repositório local:
   ```bash
   git init
   git add .
   git commit -m "feat: EcoMind 360 MVP concluído para apresentação"
   ```
2. Crie um repositório no seu GitHub e vincule com `git remote add origin <url>` e `git push -u origin main`.
