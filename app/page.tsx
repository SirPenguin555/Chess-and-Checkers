import Link from "next/link";
import { ChevronRight, Zap, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Chess & Checkers
          <span className="block text-4xl font-semibold text-blue-600 dark:text-blue-400 mt-2">
            Platform
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
          Experience the ultimate chess and checkers gaming platform with AI opponents,
          multiplayer battles, stunning 3D visuals, and endless customization possibilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 mx-auto">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Powerful AI</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Challenge Stockfish-powered chess AI and custom checkers engines
              across multiple difficulty levels.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4 mx-auto">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiplayer</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Play real-time games with friends and players worldwide with
              seamless matchmaking.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-4 mx-auto">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Excellence</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Beautiful themes, 3D chess mode, and stunning visual effects
              for an immersive experience.
            </p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/chess"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          >
            Play Chess
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
          
          <Link
            href="/checkers"
            className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
          >
            Play Checkers
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with Next.js, TypeScript, and Supabase
          </p>
        </div>
      </div>
    </main>
  );
}