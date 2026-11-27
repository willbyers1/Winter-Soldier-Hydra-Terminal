import { useEffect, useState } from 'react';
import { useWinterStore } from '../store/useWinterStore';

const BOOT_LINES = [
  'WINTER-01 HYDRA MECHANICAL ANALYSIS KERNEL v2.4',
  'CHECKING CLEARANCE: LEVEL 7 // OPERATOR ADMIN-T445-A',
  'INITIALIZING WINTER-01 TERMINAL... ASSET WS-001 READY',
];

export function BootSequence() {
  const bootDone = useWinterStore((s) => s.bootDone);
  const finishBoot = useWinterStore((s) => s.finishBoot);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (bootDone) return;
    const t1 = window.setTimeout(() => setStep(2), 450);
    const t2 = window.setTimeout(() => setStep(3), 900);
    const t3 = window.setTimeout(() => finishBoot(), 1550);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [bootDone, finishBoot]);

  if (bootDone) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#020712] flex items-center justify-center p-6 font-mono-tabular">
      <div className="w-full max-w-xl border border-[#2A63D4] bg-[#06122E] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#15316B] pb-2">
          <span className="font-display text-lg font-bold tracking-[0.2em] text-[#72DFFF]">
            WINTER-01 // BOOT SEQUENCE
          </span>
          <button
            type="button"
            onClick={finishBoot}
            className="px-2.5 py-1 border border-[#C9BC4A] bg-[#5E5A1C]/70 text-[10px] text-[#F2EA9A] uppercase cursor-pointer"
          >
            SKIP &gt;
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          {BOOT_LINES.slice(0, step).map((line, i) => (
            <div
              key={line}
              className={i === BOOT_LINES.length - 1 ? 'text-[#37C98A] font-semibold' : 'text-[#CFE0FF]'}
            >
              &gt; {line}
            </div>
          ))}
        </div>

        <div className="h-1.5 w-full bg-[#020712] border border-[#15316B]">
          <div
            className="h-full bg-[#39C5F5] transition-all duration-300"
            style={{ width: `${(step / BOOT_LINES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
