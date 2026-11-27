import { create } from 'zustand';
import {
  COMPONENT_IDS,
  type CameraPresetId,
  type ComponentId,
  type JointId,
  type PosePresetId,
} from '../three/armConfig';
import { WinterSimulationEngine } from '../simulation/WinterSimulationEngine';
import type {
  ArmState,
  BottomTabId,
  DiagnosticResult,
  EventSeverity,
  FaultId,
  ModuleId,
  OperatorSession,
  RenderMode,
  TerminalConfig,
  ToolMode,
} from '../simulation/types';
import { soundEngine } from '../utils/soundEngine';

const CONFIG_STORAGE_KEY = 'winter01.terminal.config.v2';
const LOGS_STORAGE_KEY = 'winter01.terminal.events.v1';

const DEFAULT_CONFIG: TerminalConfig = {
  defaultRenderMode: 'exterior',
  defaultCameraPreset: 'default',
  telemetryRateHz: 20,
  animationSpeed: 1.0,
  uiDensity: 'standard',
  soundEnabled: false,
  notificationsEnabled: true,
  showBootSequence: true,
};

function loadSavedConfig(): TerminalConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export const simEngine = new WinterSimulationEngine();

export interface CustomMeshUpload {
  fileName: string;
  slot: 'upper-arm' | 'lower-arm' | 'glove-top' | 'fingers' | 'full-glb';
  buffer: ArrayBuffer;
  triangleCount?: number;
}

export interface StlLoadState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  fraction: number;
  loadedBytes: number;
  totalBytes: number;
  currentPart: string;
  errorMessage: string | null;
}

export interface StlMeasuredPartSummary {
  partKey: 'upper-arm' | 'lower-arm' | 'glove-top' | 'fingers';
  triangleCount: number;
  vertexCount: number;
  sizeMm: [number, number, number];
}

export interface WinterStore {
  session: OperatorSession;
  config: TerminalConfig;
  bootDone: boolean;

  // Navigation & Viewport UI State
  activeModule: ModuleId;
  applicationsOpen: boolean;
  inputConsoleOpen: boolean;
  viewMenuOpen: boolean;
  renderMode: RenderMode;
  toolMode: ToolMode;
  selectedComponent: ComponentId | null;
  isolated: boolean;
  explodeFactor: number; // 0..1
  cameraPreset: CameraPresetId;
  cameraResetNonce: number;
  cameraLocked: boolean;
  showGrid: boolean;
  tacticalGloveVisible: boolean;

  // Dock & Monitor State
  subjectDockOpen: boolean;
  bottomMonitorOpen: boolean;
  bottomMonitorHeight: number;
  bottomTab: BottomTabId;
  telemetryStreamActive: boolean;
  logAutoscroll: boolean;
  logSearch: string;
  logSeverityFilter: 'ALL' | EventSeverity;
  selectedEventId: string | null;

  // Measure Tool State
  measurePoints: [number, number, number][];

  // Runtime Uploaded GLB Override & Asset Stream Telemetry
  uploadedMeshes: Record<string, CustomMeshUpload>;
  stlSourceStatus: 'GLB_ASSET_STREAM' | 'CUSTOM_GLB_ASSET';
  stlLoadState: StlLoadState;
  stlRetryNonce: number;
  stlMeasuredParts: Partial<Record<'upper-arm' | 'lower-arm' | 'glove-top' | 'fingers', StlMeasuredPartSummary>>;

  // Published Simulation Snapshot
  arm: ArmState;

  // Actions
  finishBoot: () => void;
  setActiveModule: (module: ModuleId) => void;
  toggleApplications: (open?: boolean) => void;
  toggleInputConsole: (open?: boolean) => void;
  toggleViewMenu: (open?: boolean) => void;
  setRenderMode: (mode: RenderMode) => void;
  setToolMode: (mode: ToolMode) => void;
  selectComponent: (id: ComponentId | null) => void;
  toggleIsolate: () => void;
  setExplodeFactor: (val: number) => void;
  toggleExplode: () => void;
  setCameraPreset: (preset: CameraPresetId) => void;
  resetCamera: () => void;
  toggleCameraLock: () => void;
  toggleGrid: () => void;
  toggleTacticalGlove: (visible?: boolean) => void;
  toggleSubjectDock: () => void;
  toggleBottomMonitor: (open?: boolean) => void;
  setBottomMonitorHeight: (px: number) => void;
  setBottomTab: (tab: BottomTabId) => void;
  toggleTelemetryStream: () => void;
  toggleLogAutoscroll: () => void;
  setLogSearch: (q: string) => void;
  setLogSeverityFilter: (sev: 'ALL' | EventSeverity) => void;
  setSelectedEventId: (id: string | null) => void;
  addMeasurePoint: (pt: [number, number, number]) => void;
  clearMeasurePoints: () => void;

  // Engine Actions
  stepSimulation: (dt: number) => void;
  publishSnapshot: () => void;
  applyPose: (pose: PosePresetId) => boolean;
  setJointTarget: (jointId: JointId, rad: number) => boolean;
  setSpeedMultiplier: (speed: number) => void;
  setMotionPaused: (paused: boolean) => void;
  toggleEStop: (force?: boolean) => void;
  setFault: (faultId: FaultId, active: boolean) => void;
  clearAllFaults: () => void;
  runDiagnostics: (scope?: string) => DiagnosticResult;
  resetSimulation: () => void;
  updateConfig: (partial: Partial<TerminalConfig>) => void;
  registerUploadedMesh: (upload: CustomMeshUpload) => void;
  clearUploadedMeshes: () => void;
  setStlLoadState: (
    loadState: StlLoadState,
    measured?: Partial<Record<'upper-arm' | 'lower-arm' | 'glove-top' | 'fingers', StlMeasuredPartSummary>>,
  ) => void;
  retryStlLoad: () => void;
}

const initialConfig = loadSavedConfig();

function cloneArmSnapshot(): ArmState {
  const s = simEngine.getState();
  return {
    ...s,
    joints: { ...s.joints },
    components: { ...s.components },
    faults: { ...s.faults },
    telemetry: { ...s.telemetry },
    history: [...s.history],
    diagnosticsHistory: [...s.diagnosticsHistory],
    events: [...s.events],
    commandHistory: [...s.commandHistory],
  };
}

export const useWinterStore = create<WinterStore>((set, get) => ({
  session: {
    operatorId: 'ADMIN-T445-A',
    sessionHash: '7778T4E3301A-3E',
    connectionIp: '34.33.21.1',
    terminalId: 'X-0035-T',
    classification: 'LEVEL 7',
  },
  config: initialConfig,
  bootDone: !initialConfig.showBootSequence,

  activeModule: 'mechanical',
  applicationsOpen: false,
  inputConsoleOpen: false,
  viewMenuOpen: false,
  renderMode: initialConfig.defaultRenderMode,
  toolMode: 'select',
  selectedComponent: null,
  isolated: false,
  explodeFactor: 0,
  cameraPreset: initialConfig.defaultCameraPreset,
  cameraResetNonce: 0,
  cameraLocked: false,
  showGrid: true,
  tacticalGloveVisible: true,

  subjectDockOpen: true,
  bottomMonitorOpen: true,
  bottomMonitorHeight: 245,
  bottomTab: 'registry',
  telemetryStreamActive: true,
  logAutoscroll: true,
  logSearch: '',
  logSeverityFilter: 'ALL',
  selectedEventId: null,

  measurePoints: [],
  uploadedMeshes: {},
  stlSourceStatus: 'GLB_ASSET_STREAM',
  stlLoadState: {
    status: 'loading',
    fraction: 0,
    loadedBytes: 0,
    totalBytes: 2_400_288,
    currentPart: 'winter-soldier-arm.glb',
    errorMessage: null,
  },
  stlRetryNonce: 0,
  stlMeasuredParts: {},

  arm: cloneArmSnapshot(),

  finishBoot: () => set({ bootDone: true }),

  setActiveModule: (module) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set({ activeModule: module, applicationsOpen: false });
  },

  toggleApplications: (open) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ applicationsOpen: open ?? !s.applicationsOpen }));
  },

  toggleInputConsole: (open) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ inputConsoleOpen: open ?? !s.inputConsoleOpen }));
  },

  toggleViewMenu: (open) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ viewMenuOpen: open ?? !s.viewMenuOpen }));
  },

  setRenderMode: (mode) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set({ renderMode: mode });
  },

  setToolMode: (mode) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({
      toolMode: mode,
      measurePoints: mode === 'measure' ? s.measurePoints : [],
    }));
  },

  selectComponent: (id) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({
      selectedComponent: id,
      isolated: id ? s.isolated : false,
    }));
  },

  toggleIsolate: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => {
      if (!s.isolated && !s.selectedComponent) {
        return { isolated: true, selectedComponent: COMPONENT_IDS[0] };
      }
      return { isolated: !s.isolated };
    });
  },

  setExplodeFactor: (val) => set({ explodeFactor: Math.max(0, Math.min(1, val)) }),

  toggleExplode: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ explodeFactor: s.explodeFactor > 0.1 ? 0 : 0.72 }));
  },

  setCameraPreset: (preset) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({
      cameraPreset: preset,
      cameraResetNonce: s.cameraResetNonce + 1,
      viewMenuOpen: false,
    }));
  },

  resetCamera: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({
      cameraPreset: get().config.defaultCameraPreset,
      cameraResetNonce: s.cameraResetNonce + 1,
      viewMenuOpen: false,
    }));
  },

  toggleCameraLock: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ cameraLocked: !s.cameraLocked }));
  },

  toggleGrid: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ showGrid: !s.showGrid }));
  },

  toggleTacticalGlove: (visible) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ tacticalGloveVisible: visible ?? !s.tacticalGloveVisible }));
  },

  toggleSubjectDock: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ subjectDockOpen: !s.subjectDockOpen }));
  },

  toggleBottomMonitor: (open) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ bottomMonitorOpen: open ?? !s.bottomMonitorOpen }));
  },

  setBottomMonitorHeight: (px) => set({ bottomMonitorHeight: Math.max(180, Math.min(420, px)) }),

  setBottomTab: (tab) => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({
      bottomTab: tab,
      bottomMonitorOpen: s.bottomTab === tab ? !s.bottomMonitorOpen : true,
    }));
  },

  toggleTelemetryStream: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ telemetryStreamActive: !s.telemetryStreamActive }));
  },

  toggleLogAutoscroll: () => {
    soundEngine.playTone('click', get().config.soundEnabled);
    set((s) => ({ logAutoscroll: !s.logAutoscroll }));
  },

  setLogSearch: (q) => set({ logSearch: q }),
  setLogSeverityFilter: (sev) => set({ logSeverityFilter: sev }),
  setSelectedEventId: (id) => set({ selectedEventId: id }),

  addMeasurePoint: (pt) =>
    set((s) => ({
      measurePoints: s.measurePoints.length >= 2 ? [pt] : [...s.measurePoints, pt],
    })),

  clearMeasurePoints: () => set({ measurePoints: [] }),

  stepSimulation: (dt) => {
    simEngine.tick(dt);
  },

  publishSnapshot: () => {
    const arm = cloneArmSnapshot();
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(arm.events.slice(0, 60)));
    } catch {
      // Ignore storage quota errors
    }
    set({ arm });
  },

  applyPose: (pose) => {
    const ok = simEngine.applyPosePreset(pose);
    soundEngine.playTone(ok ? 'confirm' : 'warn', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot() });
    return ok;
  },

  setJointTarget: (jointId, rad) => {
    const ok = simEngine.setJointTarget(jointId, rad);
    if (!ok) soundEngine.playTone('warn', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot() });
    return ok;
  },

  setSpeedMultiplier: (speed) => {
    simEngine.setSpeedMultiplier(speed);
    set({ arm: cloneArmSnapshot() });
  },

  setMotionPaused: (paused) => {
    simEngine.setMotionPaused(paused);
    soundEngine.playTone('click', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot() });
  },

  toggleEStop: (force) => {
    const next = force ?? !simEngine.getState().eStopActive;
    simEngine.triggerEStop(next);
    soundEngine.playTone(next ? 'estop' : 'confirm', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot() });
  },

  setFault: (faultId, active) => {
    simEngine.setFault(faultId, active);
    soundEngine.playTone(active ? 'warn' : 'confirm', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot() });
  },

  clearAllFaults: () => {
    simEngine.clearAllFaults();
    soundEngine.playTone('confirm', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot() });
  },

  runDiagnostics: (scope) => {
    const res = simEngine.runDiagnostics(scope);
    soundEngine.playTone(res.overallStatus === 'CRITICAL' ? 'warn' : 'confirm', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot(), bottomTab: 'diagnostics' });
    return res;
  },

  resetSimulation: () => {
    simEngine.resetSimulation();
    simEngine.setSpeedMultiplier(get().config.animationSpeed);
    soundEngine.playTone('confirm', get().config.soundEnabled);
    set({ arm: cloneArmSnapshot(), explodeFactor: 0, isolated: false });
  },

  updateConfig: (partial) => {
    const next = { ...get().config, ...partial };
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
    if (partial.animationSpeed !== undefined) {
      simEngine.setSpeedMultiplier(partial.animationSpeed);
    }
    if (partial.defaultRenderMode !== undefined) {
      set({ renderMode: partial.defaultRenderMode });
    }
    set({ config: next });
  },

  registerUploadedMesh: (upload) => {
    soundEngine.playTone('confirm', get().config.soundEnabled);
    set((s) => {
      const next = { ...s.uploadedMeshes, [upload.slot]: upload };
      return { uploadedMeshes: next, stlSourceStatus: 'CUSTOM_GLB_ASSET' };
    });
  },

  clearUploadedMeshes: () => {
    set({ uploadedMeshes: {}, stlSourceStatus: 'GLB_ASSET_STREAM' });
  },

  setStlLoadState: (stlLoadState, measured) => {
    set((s) => ({
      stlLoadState,
      stlMeasuredParts: measured ?? s.stlMeasuredParts,
    }));
  },

  retryStlLoad: () => {
    set((s) => ({
      stlRetryNonce: s.stlRetryNonce + 1,
      stlLoadState: {
        ...s.stlLoadState,
        status: 'loading',
        errorMessage: null,
      },
    }));
  },
}));
