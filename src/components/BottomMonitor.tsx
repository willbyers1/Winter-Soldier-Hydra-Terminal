import { useRef } from 'react';
import { Download, Minus, Search, X } from 'lucide-react';
import { COMPONENT_IDS, COMPONENT_METADATA } from '../three/armConfig';
import type { EventSeverity } from '../simulation/types';
import { useWinterStore } from '../store/useWinterStore';

export function BottomMonitor() {
  const bottomMonitorOpen = useWinterStore((s) => s.bottomMonitorOpen);
  const bottomMonitorHeight = useWinterStore((s) => s.bottomMonitorHeight);
  const bottomTab = useWinterStore((s) => s.bottomTab);
  const arm = useWinterStore((s) => s.arm);
  const selectedComponent = useWinterStore((s) => s.selectedComponent);
  const logSearch = useWinterStore((s) => s.logSearch);
  const logSeverityFilter = useWinterStore((s) => s.logSeverityFilter);
  const selectedEventId = useWinterStore((s) => s.selectedEventId);

  const toggleBottomMonitor = useWinterStore((s) => s.toggleBottomMonitor);
  const setBottomMonitorHeight = useWinterStore((s) => s.setBottomMonitorHeight);
  const selectComponent = useWinterStore((s) => s.selectComponent);
  const setLogSearch = useWinterStore((s) => s.setLogSearch);
  const setLogSeverityFilter = useWinterStore((s) => s.setLogSeverityFilter);
  const setSelectedEventId = useWinterStore((s) => s.setSelectedEventId);
  const runDiagnostics = useWinterStore((s) => s.runDiagnostics);

  const dragStartRef = useRef<{ y: number; h: number } | null>(null);

  const handleResizePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = { y: e.clientY, h: bottomMonitorHeight };
    const onMove = (ev: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dy = dragStartRef.current.y - ev.clientY;
      setBottomMonitorHeight(dragStartRef.current.h + dy);
    };
    const onUp = () => {
      dragStartRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const filteredEvents = arm.events.filter((ev) => {
    if (logSeverityFilter !== 'ALL' && ev.severity !== logSeverityFilter) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      return (
        ev.message.toLowerCase().includes(q) ||
        ev.path.toLowerCase().includes(q) ||
        ev.unitNumber.toLowerCase().includes(q) ||
        ev.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportEvents = (format: 'json' | 'csv') => {
    const content =
      format === 'json'
        ? JSON.stringify(filteredEvents, null, 2)
        : [
            'id,timestamp,unit,path,code,severity,uplink,message',
            ...filteredEvents.map(
              (e) =>
                `"${e.id}",${e.timestamp},"${e.unitNumber}","${e.path}","${e.code}","${e.severity}","${e.uplinkStatus}","${e.message.replace(/"/g, '""')}"`,
            ),
          ].join('\n');
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winter01-logs.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!bottomMonitorOpen) return null;

  const latestDiag = arm.diagnosticsHistory[0];

  return (
    <section
      style={{ height: `${bottomMonitorHeight}px` }}
      className="relative z-20 shrink-0 bg-[#040C1E] border-t border-[#2A63D4] flex flex-col overflow-hidden select-none"
    >
      {/* Top Drag-Resize Handle */}
      <div
        onPointerDown={handleResizePointerDown}
        className="h-1 cursor-row-resize bg-transparent hover:bg-[#39C5F5]/60 transition-colors"
        title="Drag to resize bottom monitor"
      />

      {/* 34px Monitor Header */}
      <div className="h-[34px] shrink-0 bg-[#08173D] border-b border-[#1D48A8] px-3 flex items-center justify-between gap-3 text-[11px] font-mono-tabular">
        <div className="flex items-center gap-6 min-w-0">
          <span className="text-[#DCE9FF] tracking-wider whitespace-nowrap">
            WS001/ASSEMBLY/REGISTRY/
          </span>
          <span className="hidden md:inline text-[#6F8BC4] tracking-wider whitespace-nowrap">
            ADMIN.LOG FILE:// [{bottomTab.toUpperCase()}]
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center bg-[#020712] border border-[#15316B] px-1.5 py-0.5">
            <Search className="w-3 h-3 text-[#6F8BC4] mr-1" />
            <input
              type="text"
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Filter logs..."
              className="bg-transparent text-[10px] text-[#CFE0FF] w-28 focus:outline-none"
            />
          </div>

          <select
            value={logSeverityFilter}
            onChange={(e) => setLogSeverityFilter(e.target.value as 'ALL' | EventSeverity)}
            className="bg-[#06122E] border border-[#15316B] text-[10px] text-[#CFE0FF] px-1.5 py-0.5 cursor-pointer"
          >
            <option value="ALL">ALL</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="CRIT">CRIT</option>
          </select>

          <button
            type="button"
            onClick={() => exportEvents('csv')}
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 border border-[#15316B] bg-[#06122E] hover:border-[#39C5F5] text-[10px] text-[#CFE0FF] cursor-pointer"
            title="Export Filtered Logs as CSV"
          >
            <Download className="w-2.5 h-2.5" /> CSV
          </button>

          <button
            type="button"
            onClick={() => exportEvents('json')}
            className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 border border-[#15316B] bg-[#06122E] hover:border-[#39C5F5] text-[10px] text-[#CFE0FF] cursor-pointer"
            title="Export Filtered Logs as JSON"
          >
            JSON
          </button>

          <button
            type="button"
            onClick={() => toggleBottomMonitor(false)}
            className="p-1 text-[#6F8BC4] hover:text-white cursor-pointer"
            title="Minimize Bottom Monitor"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleBottomMonitor(false)}
            className="p-1 text-[#6F8BC4] hover:text-[#E45B5B] cursor-pointer"
            title="Close Bottom Monitor"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dual Pane Content (42% / 58%) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        {/* Left Pane: MASTER 01 + COMPONENT LOGFILE Registry Cards */}
        <div className="w-full lg:w-[42%] h-full overflow-y-auto ws-scrollbar border-b lg:border-b-0 lg:border-r border-[#15316B] p-2 space-y-1.5">
          {COMPONENT_IDS.map((compId) => {
            const meta = COMPONENT_METADATA[compId];
            const compState = arm.components[compId];
            const isSelected = selectedComponent === compId;
            const isCrit = compState.status === 'CRITICAL' || compState.status === 'OFFLINE';
            const isWarn = compState.status === 'WARNING';

            return (
              <button
                key={compId}
                type="button"
                onClick={() => selectComponent(compId)}
                className={`w-full grid grid-cols-[120px_1fr] gap-1.5 text-left cursor-pointer transition-colors ${
                  isSelected ? 'ring-1 ring-[#C9BC4A]' : ''
                }`}
              >
                {/* MASTER Card */}
                <div
                  className={`px-2 py-1.5 flex flex-col justify-between ${
                    meta.isMaster || isSelected
                      ? 'ws-master-card'
                      : 'bg-[#081A45] border border-[#1E479E]'
                  }`}
                >
                  <div className="text-[9px] font-mono-tabular text-[#9AC0FF] border-b border-white/20 pb-0.5">
                    {meta.masterLabel ?? meta.assembly}
                  </div>
                  <div className="font-display text-[15px] font-bold tracking-wide text-white leading-tight mt-1">
                    {meta.shortName}
                  </div>
                  <div className="text-[9px] font-mono-tabular text-[#B8D2FF]">
                    {meta.code} · {compState.temperature.toFixed(1)}°C
                  </div>
                </div>

                {/* COMPONENT LOGFILE Card */}
                <div className="bg-[#08173A] border border-[#1B4296] px-2.5 py-1.5 flex flex-col justify-between relative overflow-hidden">
                  {/* Top olive progress bar showing component load */}
                  <div className="flex items-center justify-between gap-2 text-[9px] font-mono-tabular">
                    <span className="text-[#6F8BC4]">COMPONENT LOGFILE</span>
                    <div className="w-24 h-2 bg-[#020712] border border-[#15316B]">
                      <div
                        className={`h-full ${
                          isCrit ? 'bg-[#E45B5B]' : isWarn ? 'bg-[#E7B84C]' : 'bg-[#8E8A2A]'
                        }`}
                        style={{ width: `${Math.min(100, Math.round(compState.load))}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 items-center my-1 font-mono-tabular text-[10px]">
                    <div>
                      <div className="text-[#CFE0FF]">{meta.code}.0981</div>
                      <div className="text-[9px] text-[#6F8BC4]">LOAD {compState.load.toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-[#CFE0FF]">LOG.FILE: ONLINE</div>
                      <div className="text-[9px] text-[#6F8BC4] truncate">{meta.path}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          isCrit
                            ? 'text-[#E45B5B]'
                            : isWarn
                              ? 'text-[#E7B84C]'
                              : 'text-[#37C98A]'
                        }`}
                      >
                        {compState.status}
                      </div>
                      <div className="text-[9px] text-[#6F8BC4]">INT {compState.integrity.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Pane: Tabular ADMIN.LOG / Telemetry / Diagnostic / History */}
        <div className="w-full lg:w-[58%] h-full overflow-y-auto ws-scrollbar bg-[#030A1A] p-2">
          {bottomTab === 'diagnostics' ? (
            <div className="space-y-2 font-mono-tabular text-[11px]">
              <div className="flex items-center justify-between border-b border-[#15316B] pb-1.5">
                <span className="text-[#72DFFF]">DIAGNOSTIC SUITE OUTPUT</span>
                <button
                  type="button"
                  onClick={() => runDiagnostics('FULL INTEGRITY')}
                  className="px-2.5 py-0.5 bg-[#1F56E6] text-white text-[10px] cursor-pointer"
                >
                  RUN FULL CHECK
                </button>
              </div>
              {latestDiag ? (
                <div className="space-y-1">
                  {latestDiag.checks.map((chk) => (
                    <div
                      key={chk.subsystem}
                      className="flex items-center justify-between px-2 py-1 bg-[#06122E] border border-[#15316B]"
                    >
                      <span>
                        <span
                          className={
                            chk.status === 'CRIT'
                              ? 'text-[#E45B5B] font-bold'
                              : chk.status === 'WARN'
                                ? 'text-[#E7B84C] font-bold'
                                : 'text-[#37C98A] font-bold'
                          }
                        >
                          [{chk.status}]
                        </span>{' '}
                        {chk.subsystem}
                      </span>
                      <span className="text-[#6F8BC4] text-[10px]">{chk.detail}</span>
                    </div>
                  ))}
                  <div className="pt-1 text-right font-semibold">
                    OVERALL RESULT:{' '}
                    <span
                      className={
                        latestDiag.overallStatus === 'CRITICAL'
                          ? 'text-[#E45B5B]'
                          : latestDiag.overallStatus === 'WARNING'
                            ? 'text-[#E7B84C]'
                            : 'text-[#37C98A]'
                      }
                    >
                      {latestDiag.overallStatus}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[#6F8BC4] py-4 text-center">
                  No diagnostic run executed yet. Click RUN FULL CHECK to verify subsystems.
                </div>
              )}
            </div>
          ) : bottomTab === 'history' ? (
            <div className="space-y-1 font-mono-tabular text-[11px]">
              {arm.commandHistory.length === 0 ? (
                <div className="text-[#6F8BC4] py-4 text-center">No operator motion commands recorded yet.</div>
              ) : (
                arm.commandHistory.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="grid grid-cols-[70px_70px_1fr_110px] gap-2 px-2 py-1 border-b border-[#15316B]/50"
                  >
                    <span className="text-[#6F8BC4]">{cmd.id}</span>
                    <span className="text-[#39C5F5]">{cmd.type}</span>
                    <span className="text-[#CFE0FF] truncate">{cmd.summary}</span>
                    <span className={cmd.accepted ? 'text-[#37C98A] text-right' : 'text-[#E45B5B] text-right'}>
                      {cmd.accepted ? 'EXECUTED' : cmd.reason ?? 'REJECTED'}
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : bottomTab === 'telemetry' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono-tabular text-[11px]">
              <div className="bg-[#06122E] border border-[#15316B] p-2">
                <div className="text-[10px] text-[#6F8BC4]">BUS VOLTAGE / CURRENT</div>
                <div className="text-[15px] text-[#39C5F5] font-semibold">
                  {arm.telemetry.busVoltage.toFixed(2)} V · {arm.telemetry.busCurrent.toFixed(2)} A
                </div>
              </div>
              <div className="bg-[#06122E] border border-[#15316B] p-2">
                <div className="text-[10px] text-[#6F8BC4]">ARM POWER / BATTERY</div>
                <div className="text-[15px] text-[#72DFFF] font-semibold">
                  {arm.telemetry.powerWatts.toFixed(1)} W · {arm.telemetry.batteryPct.toFixed(1)}%
                </div>
              </div>
              <div className="bg-[#06122E] border border-[#15316B] p-2">
                <div className="text-[10px] text-[#6F8BC4]">GRIP FORCE / PEAK TEMP</div>
                <div className="text-[15px] text-[#C9BC4A] font-semibold">
                  {arm.telemetry.gripForceN.toFixed(0)} N · {arm.telemetry.peakTempC.toFixed(1)}°C
                </div>
              </div>
              <div className="bg-[#06122E] border border-[#15316B] p-2">
                <div className="text-[10px] text-[#6F8BC4]">CARDIAC / EMG DELT</div>
                <div className="text-[15px] text-[#37C98A] font-semibold">
                  {Math.round(arm.telemetry.heartRateBpm)} BPM · {arm.telemetry.emgDeltoidMv.toFixed(2)} mV
                </div>
              </div>
              <div className="bg-[#06122E] border border-[#15316B] p-2">
                <div className="text-[10px] text-[#6F8BC4]">AVG MOTOR LOAD</div>
                <div className="text-[15px] text-[#CFE0FF] font-semibold">
                  {arm.telemetry.avgLoadPct.toFixed(1)}%
                </div>
              </div>
              <div className="bg-[#06122E] border border-[#15316B] p-2">
                <div className="text-[10px] text-[#6F8BC4]">UPTIME</div>
                <div className="text-[15px] text-[#CFE0FF] font-semibold">
                  {arm.telemetry.uptimeSec.toFixed(1)} s
                </div>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse font-mono-tabular text-[11px]">
              <tbody>
                {filteredEvents.slice(0, 60).map((ev) => {
                  const isReady = ev.uplinkStatus === 'READY';
                  const isFault = ev.uplinkStatus === 'FAULT';
                  const isWarn = ev.uplinkStatus === 'WARN';
                  const isRowSelected = selectedEventId === ev.id;

                  return (
                    <tr
                      key={ev.id}
                      onClick={() => {
                        setSelectedEventId(ev.id);
                        if (ev.componentId) selectComponent(ev.componentId);
                      }}
                      className={`cursor-pointer border-b border-[#0A1B45]/80 transition-colors ${
                        isRowSelected
                          ? 'bg-[#1F56E6]/45 text-white'
                          : isReady
                            ? 'text-[#DCE9FF] hover:bg-[#0A1B45]'
                            : 'text-[#6F8BC4] hover:bg-[#0A1B45]/60'
                      }`}
                    >
                      <td className="py-1 pl-1.5 pr-2 w-8">
                        <span className="inline-flex gap-1 items-center">
                          <span
                            className={`w-1.5 h-1.5 inline-block ${
                              isFault
                                ? 'bg-[#E45B5B]'
                                : isWarn
                                  ? 'bg-[#E7B84C]'
                                  : isReady
                                    ? 'bg-[#39C5F5]'
                                    : 'bg-[#2A63D4]'
                            }`}
                          />
                          <span className="w-1.5 h-1.5 inline-block border border-[#39C5F5]/60" />
                        </span>
                      </td>
                      <td className="py-1 pr-2 whitespace-nowrap">{ev.unitNumber}</td>
                      <td className="py-1 pr-2 text-[#39C5F5] whitespace-nowrap">{ev.path}</td>
                      <td className="py-1 pr-2 whitespace-nowrap hidden xl:table-cell">{ev.code}</td>
                      <td className="py-1 pr-2 whitespace-nowrap hidden xl:table-cell">
                        {ev.ipAddress}
                      </td>
                      <td className="py-1 pr-2 truncate max-w-[260px]" title={ev.message}>
                        {ev.message}
                      </td>
                      <td
                        className={`py-1 pr-2 text-right whitespace-nowrap ${
                          isFault
                            ? 'text-[#E45B5B] font-semibold'
                            : isWarn
                              ? 'text-[#E7B84C]'
                              : isReady
                                ? 'text-[#DCE9FF]'
                                : 'text-[#4B6599]'
                        }`}
                      >
                        LOCAL.PORT - UPLINK: {ev.uplinkStatus}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
