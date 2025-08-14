# ⚔️ RPG Session Manager

Sistema completo para gerenciamento de sessões de RPG, permitindo que mestres organizem jogadores, criem guildas e administrem campanhas de forma eficiente.

## 🎯 Sobre o Projeto

O **RPG Session Manager** é uma aplicação web full-stack desenvolvida para facilitar a vida dos Game Masters (Mestres de RPG). O sistema oferece ferramentas para:

- **Gerenciamento de Jogadores**: Cadastre e organize seus jogadores com classes, níveis e histórias
- **Sessões de RPG**: Crie e administre campanhas com controle de status e participantes
- **Formação de Guildas**: Organize grupos automaticamente com balanceamento de classes
- **Confirmação de Presença**: Sistema de confirmação para jogadores participarem das sessões

## 🏗️ Arquitetura

O projeto segue uma arquitetura **monorepo** com separação clara de responsabilidades:

```
rpg-session-manager/
├── apps/
│   ├── api/          # Backend Node.js + Express
│   ├── front/        # Frontend React + Material-UI
│   └── migrations/   # Migrações do banco PostgreSQL
```

### 🚀 Stack Tecnológica

**Backend**
- Node.js + Express
- PostgreSQL + Knex.js
- JWT para autenticação
- Arquitetura em camadas (Controllers → Use Cases → Services)

**Frontend**
- React
- Material-UI (MUI)
- React Router
- Vite

**DevOps**
- Jest para testes
- ESLint para qualidade de código

## 🔧 Principais Funcionalidades

### Para Game Masters
- **Autenticação segura** com JWT
- **Sistema de jogadores** com classes (Guerreiro, Mago, Clérigo, Arqueiro)
- **Controle de sessões** com diferentes status
- **Formação automática de guildas** com balanceamento inteligente

### Sistema Inteligente de Guildas
- Distribuição equilibrada de classes essenciais
- Balanceamento por experiência (XP)
- Alertas para composições incompletas
- Estatísticas detalhadas por guilda

## ⚡ Quick Start

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Docker (opcional)

### Instalação

1. **Backend**
   ```bash
   cd apps/api
   npm install
   npm run dev
   ```

2. **Frontend**
   ```bash
   cd apps/front
   npm install
   npm run dev
   ```

3. **Migrações**
   ```bash
   cd apps/migrations
   npm install
   npm run migrations
   npm run seeds
   ```

## 📊 Modelo de Dados

O sistema trabalha com as seguintes entidades principais:

- **Game Master**: Usuário administrador do sistema
- **Player**: Jogadores com classe, nível e lore
- **Session**: Campanhas/sessões de RPG
- **Guild**: Grupos de jogadores organizados
- **Session Player Confirmation**: Confirmações de presença

---

*"Aventuras épicas começam com uma boa organização"* ⚔️🐲
