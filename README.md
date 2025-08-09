# Chess & Checkers Platform 🎯

A comprehensive chess and checkers gaming platform featuring AI opponents, multiplayer gameplay, and stunning visual customization. Built with modern web technologies for an exceptional gaming experience.

![Platform Preview](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech Stack](https://img.shields.io/badge/Tech-Next.js%20%7C%20TypeScript%20%7C%20Supabase-green)

## ✨ Features

### 🎮 Core Gameplay
- **Chess & Checkers**: Complete implementations with official rules
- **AI Opponents**: Stockfish-powered chess AI with 4 difficulty levels
- **Multiplayer**: Real-time gameplay with friends via Supabase
- **Game Variations**: 3D chess, chess vs checkers, and unique modes

### 🎨 Visual Excellence
- **Multiple Themes**: Wood, marble, neon, and minimal board styles
- **Premium Piece Sets**: Classic, modern, 3D, and artistic designs
- **Smooth Animations**: Framer Motion powered piece movements
- **Dynamic Backgrounds**: Animated and static background options
- **Advanced Effects**: Lighting, shadows, and particle effects

### 🚀 Advanced Features
- **3D Chess Mode**: Fully immersive 3D gameplay experience
- **Game Analysis**: Post-game analysis with move evaluation
- **Replay System**: Cinematic game replays with annotations
- **User Profiles**: Statistics, rankings, and achievement system
- **Cross-Platform**: Responsive design for desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript with strict mode
- **Styling**: TailwindCSS 4.0+
- **UI Components**: Tailwind Plus (Catalyst UI Kit)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **3D Graphics**: Three.js (for 3D chess mode)

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **AI Engine**: Stockfish.js
- **Chess Logic**: chess.js

### Development Tools
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ LTS
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SirPenguin555/Chess-and-Checkers.git
   cd Chess-and-Checkers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase database**
   ```bash
   npm run db:setup
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📚 Project Structure

```
├── .agent-os/                 # Agent OS documentation and specs
│   ├── product/              # Product mission, roadmap, decisions
│   └── specs/                # Feature specifications and tasks
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication pages
│   ├── (game)/              # Game-related pages
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
├── components/               # Reusable components
│   ├── ui/                  # Base UI components
│   ├── game/                # Game-specific components
│   └── features/            # Feature components
├── lib/                     # Utilities and configurations
│   ├── supabase.ts         # Supabase client
│   ├── chess.ts            # Chess game logic
│   └── utils.ts            # Helper functions
├── hooks/                   # Custom React hooks
├── stores/                  # Zustand stores
├── types/                   # TypeScript definitions
└── public/                  # Static assets
```

## 🎯 Development Roadmap

### Phase 1: Core Foundation (3-4 weeks) ⏳
- [x] Project setup and configuration
- [ ] Basic chess gameplay with Stockfish AI
- [ ] Basic checkers with custom AI
- [ ] User authentication system
- [ ] Game state management

### Phase 2: Multiplayer Foundation (2-3 weeks)
- [ ] Real-time multiplayer chess/checkers
- [ ] Game room system
- [ ] Live chat during games
- [ ] Connection handling

### Phase 3: Visual Excellence (3-4 weeks)
- [ ] Advanced visual themes
- [ ] Premium piece designs
- [ ] Smooth animations and effects
- [ ] Dynamic backgrounds
- [ ] Sound system

### Phase 4: Game Variations & 3D (3-4 weeks)
- [ ] 3D chess implementation
- [ ] Chess vs checkers mode
- [ ] King of the Hill variant
- [ ] Advanced 3D controls

### Phase 5: Advanced Features (2-3 weeks)
- [ ] Game analysis and replay
- [ ] Player rankings (ELO system)
- [ ] Achievement system
- [ ] Performance dashboard

## 🧪 Testing

Run the test suite:
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:ui         # UI test runner
npm run test:e2e        # End-to-end tests
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📖 Game Rules

### Chess
- Standard FIDE rules apply
- Special moves: castling, en passant, promotion
- Draw conditions: stalemate, insufficient material, 50-move rule

### Checkers
- American checkers (English draughts) rules
- Mandatory captures
- King promotion on reaching opposite end

### Game Variations
- **3D Chess**: Three-dimensional chess with attack boards
- **Chess vs Checkers**: Hybrid gameplay combining both games
- **King of the Hill**: Alternative victory by reaching center

## 🐛 Bug Reports & Feature Requests

Please use our [Issue Tracker](https://github.com/SirPenguin555/Chess-and-Checkers/issues) to:
- Report bugs
- Request new features
- Suggest improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stockfish**: World's strongest open-source chess engine
- **chess.js**: JavaScript chess library for move generation and validation
- **Supabase**: Open-source Firebase alternative
- **Next.js**: The React framework for production
- **TailwindCSS**: Utility-first CSS framework

## 🔗 Links

- [Live Demo](https://chess-and-checkers.vercel.app) (Coming Soon)
- [Documentation](https://docs.chess-and-checkers.app) (Coming Soon)
- [Agent OS Framework](https://buildermethods.com/agent-os)

---

**Made with ❤️ using Agent OS** - Structured AI-assisted development for modern web applications.

*Join us in creating the ultimate chess and checkers gaming experience!* 🚀