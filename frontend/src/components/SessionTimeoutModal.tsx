import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface Props {
  secondsLeft: number;
  onStay: () => void;
  onLogout: () => void;
}

export default function SessionTimeoutModal({ secondsLeft, onStay, onLogout }: Props) {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const countdown = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-timeout-title"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-navy-950/20 border border-gray-100 p-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-aen-gold/10 rounded-full flex items-center justify-center mb-5">
            <Clock size={24} className="text-aen-gold" />
          </div>

          <h2
            id="session-timeout-title"
            className="text-xl font-serif font-semibold text-navy-900 tracking-tight"
          >
            Still there?
          </h2>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            You have been inactive for a while. For your security you will be signed out in
          </p>

          <div className="mt-4 text-4xl font-serif font-semibold text-navy-900 tabular-nums">
            {countdown}
          </div>

          <button
            onClick={onStay}
            className="mt-7 w-full py-2.5 bg-navy-900 text-white text-sm font-medium rounded-lg hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:ring-offset-2 transition-all"
          >
            Stay Signed In
          </button>

          <button
            onClick={onLogout}
            className="mt-2 w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Sign out now
          </button>
        </div>
      </motion.div>
    </div>
  );
}