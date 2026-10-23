# Florescer 🌱

Um aplicativo mobile para controle e acompanhamento de hábitos, desenvolvido com React Native e Expo.

## 📱 Funcionalidades

- ✅ **Gerenciamento de Hábitos**: Criar, visualizar e organizar seus hábitos
- 🎯 **Marcar como Concluído**: Acompanhe o progresso dos seus hábitos
- 📋 **Hábitos Concluídos**: Visualize todos os hábitos que você já completou
- 👤 **Perfil do Usuário**: Personalize suas informações pessoais
- ⚙️ **Configurações**: Alterne entre tema claro e escuro
- 📱 **Interface Responsiva**: Design adaptado para diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Linguagem tipada baseada em JavaScript
- **React Native Paper** - Biblioteca de componentes Material Design
- **Expo Router** - Sistema de navegação baseado em arquivos
- **AsyncStorage** - Armazenamento local persistente
- **React Native Draggable FlatList** - Funcionalidade de arrastar e soltar

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
