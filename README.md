# Florescer 🌱

Um aplicativo mobile para controle e acompanhamento de hábitos, desenvolvido com React Native e Expo.

## 📱 Funcionalidades

- ✅ **Gerenciamento de Hábitos**: Criar, visualizar, editar e reorganizar hábitos com facilidade
- 🔥 **Sistema de Ofensivas (Streaks)**: Acompanhe dias seguidos de conclusão com contadores dinâmicos e recorde pessoal
- 🔄 **Ciclo de Reset Diário Inteligente**: Zera automaticamente o progresso a cada novo dia mantendo suas ofensivas intactas
- 🎨 **Categorias, Cores e Ícones Customizados**: Organize por Saúde, Estudos, Mente, Treino, Foco ou Lazer com cores vibrantes
- ⏰ **Lembretes Diários (Notificações Locais)**: Agende horários específicos para receber notificações no celular
- 📳 **Feedback Tátil Háptico**: Vibrações táteis sutis e satisfatórias ao interagir, pontuar e concluir metas
- 📊 **Heatmap de Constância (Estilo GitHub)**: Grade visual dos últimos 28 dias para acompanhar a evolução da sua disciplina
- 🏆 **Histórico & Conquistas**: Estatísticas completas com taxa de conclusão, recordes e rotinas realizadas
- ☁️ **Sincronização em Nuvem (MongoDB Atlas)**: Backup automático e suporte multi-usuário com arquitetura offline-first
- 👤 **Perfil do Usuário**: Personalize nome, foto de perfil, e-mail e bio
- ⚙️ **Configurações & Temas**: Alterne fluidamente entre tema claro e escuro com Glassmorphism

## 🛠️ Tecnologias Utilizadas

- **React Native & Expo SDK 58** - Framework mobile de alta performance
- **TypeScript** - Tipagem estática e segura
- **Expo Router** - Roteamento declarativo baseado em arquivos
- **Zustand & AsyncStorage** - Gerenciamento de estado e persistência local offline-first
- **Node.js, Express & MongoDB Atlas** - API REST para persistência e backup em nuvem
- **Expo Notifications** - Sistema de agendamento de lembretes locais
- **Expo Haptics** - Feedback tátil para interações do usuário
- **Liquid Glass & LinearGradient** - Efeitos visuais modernos de Glassmorphism
- **React Native Draggable FlatList** - Reorganização fluida de hábitos por arrastar e soltar
- **Jest & @react-native/jest-preset** - Testes unitários automatizados para regras de negócio e streaks

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI

## 🚀 Como executar o projeto

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/florescer.git
cd florescer
```

2. **Instale as dependências**
```bash
cd florescer
npm install
```

3. **Configure as Variáveis de Ambiente (MongoDB Atlas)**
Copie o arquivo de exemplo e insira suas credenciais seguras:
```bash
cp .env.example .env
```
*(Nota: O arquivo `.env` já está no `.gitignore` e nunca será enviado para o GitHub).*

4. **Inicie o servidor de sincronização em nuvem**
```bash
npm run server
```

5. **Execute o aplicativo**
```bash
npx expo start
```

6. **Abra no dispositivo**
- Use o aplicativo Expo Go no seu celular para escanear o QR Code
- Ou pressione `a` para abrir no emulador Android
- Ou pressione `i` para abrir no emulador iOS
- Ou pressione `w` para abrir na Web


## 🎨 Design System

O aplicativo utiliza um design system consistente com:

- **Cores**: Paleta adaptável para tema claro e escuro
- **Tipografia**: Hierarquia clara de textos
- **Componentes**: Interface baseada em Material Design
- **Navegação**: Sistema de abas na parte inferior

## 👨‍💻 Autor

Desenvolvido com ❤️ por Rafael Merlo

---

**Florescer** - Transforme pequenos hábitos em grandes conquistas! 🌱✨
