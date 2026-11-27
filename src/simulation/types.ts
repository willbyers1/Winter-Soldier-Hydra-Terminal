import type {
  CameraPresetId,
  ComponentId,
  JointId,
  PosePresetId,
} from '../three/armConfig';

export type ModuleId =
  | 'overview'
  | 'mechanical'
  | 'motion'
  | 'diagnostics'
  | 'telemetry'
  | 'failures'
  | 'logs'
  | 'configuration';

export type RenderMode =
  | 'xray'
  | 'exterior'
  | 'realistic'
  | 'internal'
  | 'wireframe';

export type ToolMode = 'select' | 'isolate' | 'measure';

export type BottomTabId =
  | 'registry'
  | 'telemetry'
  | 'events'
  | 'diagnostics'
  | 'history';

export type ComponentStatus =
  | 'OPERATIONAL'
  | 'STANDBY'
  | 'WARNING'
  | 'CRITICAL'
  | 'OFFLINE';

export type FaultId =
  | 'MOTOR_OVERHEAT'
  | 'BATTERY_CRITICAL'
  | 'FINGER_JAM'
  | 'SENSOR_DISCONNECT'
  | 'COMM_FAILURE'
  | 'EXCESSIVE_GRIP'
  | 'WRIST_MOTOR_FAULT'
  | 'MECH_INTEGRITY_WARN';

export type EventSeverity = 'INFO' | 'WARN' | 'CRIT';
export type EventCategory =
  | 'SYSTEM'
  | 'MOTION'
  | 'TELEMETRY'
  | 'FAULT'
  | 'DIAGNOSTIC'
  | 'OPERATOR';

export interface JointState {
  id: JointId;
  angle: number;
  target: number;
  velocity: number;
  motorLoad: number; // 0..100 %
  temperature: number; // Celsius
}

export interface ComponentState {
  id: ComponentId;
  status: ComponentStatus;
  temperature: number; // Celsius
  load: number; // 0..100 %
  integrity: number; // 0..100 %
  activeFaults: FaultId[];
}

export interface FailureDefinition {
  id: FaultId;
  name: string;
  severity: 'WARNING' | 'CRITICAL';
  affectedComponents: ComponentId[];
  description: string;
  effectSummary: string;
}

export interface FailureState {
  id: FaultId;
  active: boolean;
  triggeredAt: number | null;
}

export interface TelemetrySnapshot {
  timestamp: number;
  uptimeSec: number;
  busVoltage: number; // V (nominal 28.0V)
  busCurrent: number; // A
  powerWatts: number; // W
  batteryPct: number; // 0..100 %
  peakTempC: number;
  avgLoadPct: number;
  gripForceN: number; // Newtons
  heartRateBpm: number;
  emgDeltoidMv: number;
  emgPectoralMv: number;
  emgTrapeziusMv: number;
  ecgSample: number; // normalized -0.4..1.2
  connectionIntegrityPct: number;
}

export interface TelemetryHistoryPoint {
  timeLabel: string;
  powerWatts: number;
  peakTempC: number;
  batteryPct: number;
  avgLoadPct: number;
  heartRateBpm: number;
}

export interface DiagnosticCheckItem {
  subsystem: string;
  status: 'OK' | 'WARN' | 'CRIT';
  detail: string;
}

export interface DiagnosticResult {
  id: string;
  timestamp: number;
  scope: string;
  overallStatus: 'OPERATIONAL' | 'WARNING' | 'CRITICAL';
  checks: DiagnosticCheckItem[];
}

export interface SystemEvent {
  id: string;
  timestamp: number;
  unitNumber: string;
  path: string;
  code: string;
  ipAddress: string;
  uplinkStatus: 'READY' | 'STANDBY' | 'WARN' | 'FAULT';
  category: EventCategory;
  severity: EventSeverity;
  message: string;
  componentId?: ComponentId;
}

export interface MotionCommand {
  id: string;
  timestamp: number;
  type: 'PRESET' | 'JOINT' | 'ESTOP' | 'RESET';
  summary: string;
  accepted: boolean;
  reason?: string;
}

export interface TerminalConfig {
  defaultRenderMode: RenderMode;
  defaultCameraPreset: CameraPresetId;
  telemetryRateHz: 10 | 20 | 30;
  animationSpeed: number; // 0.5..2.0
  uiDensity: 'compact' | 'standard';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  showBootSequence: boolean;
}

export interface OperatorSession {
  operatorId: string;
  sessionHash: string;
  connectionIp: string;
  terminalId: string;
  classification: string;
}

export interface ArmState {
  overallStatus: ComponentStatus;
  eStopActive: boolean;
  motionPaused: boolean;
  activePose: PosePresetId | 'custom';
  speedMultiplier: number;
  joints: Record<JointId, JointState>;
  components: Record<ComponentId, ComponentState>;
  faults: Record<FaultId, FailureState>;
  telemetry: TelemetrySnapshot;
  history: TelemetryHistoryPoint[];
  diagnosticsHistory: DiagnosticResult[];
  events: SystemEvent[];
  commandHistory: MotionCommand[];
}
