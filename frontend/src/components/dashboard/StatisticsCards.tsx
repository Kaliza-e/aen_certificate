import { Award, Calendar, FileText, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
  total: number;
  generatedToday: number;
  drafts: number;
  currentEvent: number;
}

const cards = [
  { key: 'total', label: 'Total Certificates', icon: Award, color: 'text-navy-900' },
  { key: 'generatedToday', label: 'Generated Today', icon: Calendar, color: 'text-aen-orange' },
  { key: 'currentEvent', label: 'Current Event', icon: Hash, color: 'text-aen-gold' },
  { key: 'drafts', label: 'Drafts', icon: FileText, color: 'text-aen-light-blue' },
];

export default function StatisticsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 shadow-sm min-w-0"
        >
          <div className={`w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 ${card.color}`}>
            <card.icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-semibold text-navy-900 leading-none">
              {(stats as any)[card.key] || 0}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{card.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
