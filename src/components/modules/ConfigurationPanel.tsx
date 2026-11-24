import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { CAMERA_PRESETS, type CameraPresetId } from '../../three/armConfig';
import type { RenderMode } from '../../simulation/types';
import { useWinterStore } from '../../store/useWinterStore';

export function ConfigurationPanel() {
  const config = useWinterStore((s) => s.config);
  const updateConfig = useWinterStore((s) => s.updateConfig);
  const resetSimulation = useWinterStore((s) => s.resetSimulation);

  return (
    <div className="space-y-3 text-[11px] font-mono-tabular">
      <div className="border border-[#15316B] bg-[#040C1E] p-2.5 space-y-2.5">
        <div className="text-[10px] text-[#39C5F5] font-semibold">VISUALIZATION DEFAULTS</div>

        <div>
          <label className="block text-[10px] text-[#6F8BC4] mb-1">DEFAULT VIEWPORT MODE</label>
          <select
            value={config.defaultRenderMode}
            onChange={(e) => updateConfig({ defaultRenderMode: e.target.value as RenderMode })}
            className="w-full bg-[#06122E] border border-[#15316B] px-2 py-1 text-[#CFE0FF]"
          >
            <option value="xray">X-RAY (FRESNEL + EDGES)</option>
            <option value="exterior">EXTERIOR (BRUSHED SILVER + RED STAR)</option>
            <option value="realistic">REALISTIC (STUDIO PBR)</option>
            <option value="internal">INTERNAL (ACTUATORS &amp; RODS)</option>
            <option value="wireframe">WIREFRAME (CAD LINES)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] text-[#6F8BC4] mb-1">DEFAULT CAMERA PRESET</label>
          <select
            value={config.defaultCameraPreset}
            onChange={(e) =>
              updateConfig({ defaultCameraPreset: e.target.value as CameraPresetId })
            }
            className="w-full bg-[#06122E] border border-[#15316B] px-2 py-1 text-[#CFE0FF]"
          >
            {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((pid) => (
              <option key={pid} value={pid}>
                {CAMERA_PRESETS[pid].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border border-[#15316B] bg-[#040C1E] p-2.5 space-y-2.5">
        <div className="text-[10px] text-[#39C5F5] font-semibold">SIMULATION &amp; TELEMETRY</div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-[#6F8BC4]">TELEMETRY PUBLISH RATE</span>
            <span className="text-[#CFE0FF]">{config.telemetryRateHz} Hz</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {([10, 20, 30] as const).map((hz) => (
              <button
                key={hz}
                type="button"
                onClick={() => updateConfig({ telemetryRateHz: hz })}
                className={`py-1 border text-[10px] cursor-pointer ${
                  config.telemetryRateHz === hz
                    ? 'bg-[#5E5A1C] border-[#C9BC4A] text-white'
                    : 'bg-[#06122E] border-[#15316B] text-[#CFE0FF]'
                }`}
              >
                {hz} HZ
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-[#6F8BC4]">ANIMATION SPEED</span>
            <span className="text-[#72DFFF]">{config.animationSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={config.animationSpeed}
            onChange={(e) => updateConfig({ animationSpeed: Number(e.target.value) })}
            className="w-full accent-[#39C5F5] cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-[10px] text-[#6F8BC4] mb-1">UI DENSITY</label>
          <div className="grid grid-cols-2 gap-1">
            {(['compact', 'standard'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => updateConfig({ uiDensity: d })}
                className={`py-1 border text-[10px] uppercase cursor-pointer ${
                  config.uiDensity === d
                    ? 'bg-[#1F56E6] border-[#72DFFF] text-white'
                    : 'bg-[#06122E] border-[#15316B] text-[#CFE0FF]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-[#15316B] bg-[#040C1E] p-2.5 space-y-2">
        <div className="text-[10px] text-[#39C5F5] font-semibold">FEEDBACK &amp; STARTUP</div>

        <button
          type="button"
          onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-[#15316B] bg-[#06122E] hover:border-[#39C5F5] cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {config.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#39C5F5]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#64748B]" />
            )}
            WEB AUDIO CONSOLE TONES
          </span>
          <span className={config.soundEnabled ? 'text-[#37C98A]' : 'text-[#64748B]'}>
            {config.soundEnabled ? 'ENABLED' : 'MUTED'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => updateConfig({ notificationsEnabled: !config.notificationsEnabled })}
          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-[#15316B] bg-[#06122E] hover:border-[#39C5F5] cursor-pointer"
        >
          <span>ALERT NOTIFICATIONS</span>
          <span className={config.notificationsEnabled ? 'text-[#37C98A]' : 'text-[#64748B]'}>
            {config.notificationsEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => updateConfig({ showBootSequence: !config.showBootSequence })}
          className="w-full flex items-center justify-between px-2.5 py-1.5 border border-[#15316B] bg-[#06122E] hover:border-[#39C5F5] cursor-pointer"
        >
          <span>STARTUP BOOT SEQUENCE</span>
          <span className={config.showBootSequence ? 'text-[#37C98A]' : 'text-[#64748B]'}>
            {config.showBootSequence ? 'ACTIVE' : 'SKIP'}
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={resetSimulation}
        className="w-full py-2 border border-[#E45B5B] bg-[#5E1111]/70 hover:bg-[#8E1616] text-[#FFE5E5] flex items-center justify-center gap-2 uppercase cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" /> RESET ENTIRE SIMULATION
      </button>
    </div>
  );
}
