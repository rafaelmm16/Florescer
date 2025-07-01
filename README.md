# Florescer 🌱

Um aplicativo mobile para controle e acompanhamento de hábitos, desenvolvido com React Native e Expo.

## 📱 Funcionalidades

- ✅ **Gerenciamento de Hábitos**: Criar, visualizar e organizar seus hábitos
- 🎯 **Marcar como Concluído**: Acompanhe o progresso dos seus hábitos
- 📋 **Hábitos Concluídos**: Visualize todos os hábitos que você já completou
- 🗑️ **Lixeira**: Restaure ou exclua permanentemente hábitos removidos
- 👤 **Perfil do Usuário**: Personalize suas informações pessoais
- ⚙️ **Configurações**: Alterne entre tema claro e escuro
- 🔒 **Sistema de Login**: Autenticação simples com armazenamento local
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
- Android Studio (para emulador Android) ou Xcode (para emulador iOS)

## 🚀 Como executar o projeto

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/florescer.git
cd florescer
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**
```bash
npx expo start
```

4. **Abra no dispositivo**
- Use o aplicativo Expo Go no seu celular para escanear o QR Code
- Ou pressione `a` para abrir no emulador Android
- Ou pressione `i` para abrir no emulador iOS


## 🎨 Design System

O aplicativo utiliza um design system consistente com:

- **Cores**: Paleta adaptável para tema claro e escuro
- **Tipografia**: Hierarquia clara de textos
- **Componentes**: Interface baseada em Material Design
- **Navegação**: Sistema de abas na parte inferior

## 📱 Telas Principais

### 🏠 Tela Inicial
- Lista todos os hábitos pendentes
- Botão flutuante para adicionar novos hábitos
- Funcionalidade de arrastar e soltar para reordenar

### ✅ Hábitos Concluídos
- Visualiza todos os hábitos marcados como concluídos
- Interface limpa e organizada

### 🗑️ Lixeira
- Hábitos excluídos podem ser restaurados
- Opção de exclusão permanente

### ⚙️ Configurações
- Alternância entre tema claro e escuro
- Configurações salvas localmente

## 💾 Armazenamento

O aplicativo utiliza `AsyncStorage` para persistir dados localmente:

- Lista de hábitos
- Hábitos na lixeira
- Informações do perfil
- Configurações de tema
- Status de login

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

Desenvolvido com ❤️ por Rafael Merlo

## 🔮 Próximas Funcionalidades

- [ ] Estatísticas de progresso
- [ ] Lembretes e notificações
- [ ] Categorias de hábitos
- [ ] Backup na nuvem
- [ ] Compartilhamento de progresso
- [ ] Modo offline completo

---

**Florescer** - Transforme pequenos hábitos em grandes conquistas! 🌱✨
