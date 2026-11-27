import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import type { BottomTabId } from '../simulation/types';
import { useWinterStore } from '../store/useWinterStore';

const SOCKET_TABS: Array<{ id: BottomTabId; label: string }> = [
  { id: 'registry', label: 'REGISTRY' },
  { id: 'telemetry', label: 'TELEMETRY' },
  { id: 'events', label: 'EVENTS' },
  { id: 'diagnostics', label: 'DIAGNOSTICS' },
  { id: 'history', label: 'HISTORY' },
];

export function BottomBar() {
  const bottomMonitorOpen = useWinterStore((s) => s.bottomMonitorOpen);
  const bottomTab = useWinterStore((s) => s.bottomTab);

  const toggleApplications = useWinterStore((s) => s.toggleApplications);
  const toggleBottomMonitor = useWinterStore((s) => s.toggleBottomMonitor);
  const setBottomTab = useWinterStore((s) => s.setBottomTab);

  return (
    <footer className="relative z-30 h-[42px] shrink-0 bg-[#040C1E] border-t border-[#1D48A8] flex items-stretch justify-between select-none">
      <div className="flex items-stretch min-w-0 overflow-x-auto">
        <button
          type="button"
          onClick={() => toggleApplications()}
          className="px-3.5 shrink-0 bg-[#5E5A1C] border-r border-[#C9BC4A]/60 flex items-center gap-2 hover:bg-[#706B22] cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#F2EA9A]" />
          <span className="font-display text-[12px] font-semibold tracking-wider text-[#F2EA9A] uppercase">
            PROGRAMS
          </span>
        </button>

        {/* Socket Tab Buttons */}
        <div className="flex items-stretch gap-1 px-2 py-1">
          {SOCKET_TABS.map((tab) => {
            const active = bottomMonitorOpen && bottomTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setBottomTab(tab.id)}
                className={`px-3 flex items-center border transition-colors cursor-pointer whitespace-nowrap font-display text-[11px] font-semibold tracking-wider uppercase ${
                  active
                    ? 'bg-[#0E2B6E] border-[#72DFFF] text-white shadow-[0_0_8px_rgba(57,197,245,0.25)]'
                    : 'bg-[#06122E] border-[#1A3F8F] text-[#9AC0FF] hover:border-[#39C5F5]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Monitor Drawer Toggle */}
      <button
        type="button"
        onClick={() => toggleBottomMonitor()}
        className="px-3.5 border-l border-[#15316B] bg-[#06122E] hover:bg-[#0D255E] flex items-center gap-1.5 text-[10px] font-mono-tabular text-[#9AC0FF] hover:text-white cursor-pointer shrink-0"
        title={bottomMonitorOpen ? 'Collapse Console Drawer' : 'Expand Console Drawer'}
      >
        <span>{bottomMonitorOpen ? 'HIDE LOGS' : 'SHOW LOGS'}</span>
        {bottomMonitorOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#39C5F5]" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-[#39C5F5]" />
        )}
      </button>
    </footer>
  );
}
