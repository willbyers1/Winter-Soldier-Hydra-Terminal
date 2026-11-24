export type JointId =
  | 'shoulderPitch'
  | 'shoulderRoll'
  | 'elbowFlex'
  | 'wristFlex'
  | 'wristRotate'
  | 'thumbCmc'
  | 'thumbMcp'
  | 'thumbIp'
  | 'indexMcp'
  | 'indexPip'
  | 'indexDip'
  | 'middleMcp'
  | 'middlePip'
  | 'middleDip'
  | 'ringMcp'
  | 'ringPip'
  | 'ringDip'
  | 'littleMcp'
  | 'littlePip'
  | 'littleDip';

export type ComponentId =
  | 'WS001-SHOULDER-CAP'
  | 'WS001-SHOULDER-STAR'
  | 'WS001-UPPER-ARM'
  | 'WS001-ELBOW-JOINT'
  | 'WS001-FOREARM'
  | 'WS001-WRIST-CUFF'
  | 'WS001-HAND-PALM'
  | 'WS001-HAND-THUMB'
  | 'WS001-HAND-INDEX'
  | 'WS001-HAND-MIDDLE'
  | 'WS001-HAND-RING'
  | 'WS001-HAND-LITTLE';

export type PosePresetId =
  | 'relax'
  | 'open'
  | 'close'
  | 'fist'
  | 'point'
  | 'thumbsUp'
  | 'reset';

export type CameraPresetId =
  | 'default'
  | 'front'
  | 'side'
  | 'top'
  | 'hand'
  | 'wrist'
  | 'elbow'
  | 'shoulder';

export interface JointConfig {
  id: JointId;
  label: string;
  group: 'Arm' | 'Wrist' | 'Thumb' | 'Index' | 'Middle' | 'Ring' | 'Little';
  axis: 'x' | 'y' | 'z';
  min: number; // radians
  max: number; // radians
  defaultAngle: number; // radians
  maxSpeed: number; // rad/s
  componentId: ComponentId;
}

export interface ComponentMetadata {
  id: ComponentId;
  code: string; // e.g. K1, R2, D4
  serial: string; // e.g. NO. WS001-HND-050
  name: string;
  shortName: string;
  assembly: 'SHOULDER' | 'UPPER' | 'ELBOW' | 'FOREARM' | 'WRIST' | 'HAND';
  path: string;
  unitNumber: string;
  ipAddress: string;
  description: string;
  sourceType: 'STL-Target / Articulated Shell' | 'Procedural Detail';
  stlSourceHypothesis: string;
  relatedParts: ComponentId[];
  isMaster?: boolean;
  masterLabel?: string;
}

export const STL_SOURCE_URLS = {
  'upper-arm': 'https://raw.githubusercontent.com/willbyers1/bucky-arm-stl/main/upper-arm-7.stl',
  'lower-arm': 'https://raw.githubusercontent.com/willbyers1/bucky-arm-stl/main/lower-arm-7.stl',
  'glove-top': 'https://raw.githubusercontent.com/willbyers1/bucky-arm-stl/main/glove-top-detail.stl',
  fingers: 'https://raw.githubusercontent.com/willbyers1/bucky-arm-stl/main/fingers-fixed.stl',
} as const;

export interface StlPartTechnicalSpec {
  partKey: 'upper-arm' | 'lower-arm' | 'glove-top' | 'fingers';
  fileName: string;
  url: string;
  triangleCount: number;
  dimensionsMm: [number, number, number];
  minMm: [number, number, number];
  maxMm: [number, number, number];
  centerOfMassMm: [number, number, number];
  volumeMm3: number;
  normalizedRigLengthM: number;
}

export const STL_PART_SPECS: Record<StlPartTechnicalSpec['partKey'], StlPartTechnicalSpec> = {
  'upper-arm': {
    partKey: 'upper-arm',
    fileName: 'upper-arm-7.stl',
    url: STL_SOURCE_URLS['upper-arm'],
    triangleCount: 838642,
    dimensionsMm: [295.67, 228.55, 358.26],
    minMm: [-299.58, -110.32, -27.53],
    maxMm: [-3.91, 118.23, 330.74],
    centerOfMassMm: [-166.3, 7.27, 147.5],
    volumeMm3: 535781.06,
    normalizedRigLengthM: 0.4239,
  },
  'lower-arm': {
    partKey: 'lower-arm',
    fileName: 'lower-arm-7.stl',
    url: STL_SOURCE_URLS['lower-arm'],
    triangleCount: 540744,
    dimensionsMm: [261.53, 154.97, 251.04],
    minMm: [-100.88, -74.26, -173.28],
    maxMm: [160.65, 80.72, 77.76],
    centerOfMassMm: [34.96, -1.9, -56.79],
    volumeMm3: 290069.67,
    normalizedRigLengthM: 0.2801,
  },
  'glove-top': {
    partKey: 'glove-top',
    fileName: 'glove-top-detail.stl',
    url: STL_SOURCE_URLS['glove-top'],
    triangleCount: 69120,
    dimensionsMm: [52.81, 106.01, 40.77],
    minMm: [199.31, -59.15, -201.75],
    maxMm: [252.12, 46.85, -160.98],
    centerOfMassMm: [225.81, -8.54, -181.31],
    volumeMm3: 15723.5,
    normalizedRigLengthM: 0.0623,
  },
  fingers: {
    partKey: 'fingers',
    fileName: 'fingers-fixed.stl',
    url: STL_SOURCE_URLS.fingers,
    triangleCount: 610048,
    dimensionsMm: [182.27, 222.43, 101.19],
    minMm: [183.48, -133.4, -344.0],
    maxMm: [365.76, 89.03, -242.81],
    centerOfMassMm: [288.68, -12.04, -296.89],
    volumeMm3: 68982.61,
    normalizedRigLengthM: 0.1748,
  },
};

export const ARM_DIMENSIONS_M = {
  shoulderToElbow: 0.3488,
  elbowToWrist: 0.239,
  palmLength: 0.0623,
  palmWidth: 0.1058,
  gloveTopLength: 0.0528,
  gloveTopWidth: 0.106,
  gloveTopArchHeight: 0.0408,
  totalLength: 0.9348,
} as const;

export const JOINT_CONFIGS: Record<JointId, JointConfig> = {
  shoulderPitch: {
    id: 'shoulderPitch',
    label: 'Shoulder Pitch',
    group: 'Arm',
    axis: 'z',
    min: -0.45,
    max: 0.65,
    defaultAngle: 0.0,
    maxSpeed: 1.6,
    componentId: 'WS001-SHOULDER-CAP',
  },
  shoulderRoll: {
    id: 'shoulderRoll',
    label: 'Shoulder Roll',
    group: 'Arm',
    axis: 'x',
    min: -0.55,
    max: 0.55,
    defaultAngle: 0.0,
    maxSpeed: 1.6,
    componentId: 'WS001-UPPER-ARM',
  },
  elbowFlex: {
    id: 'elbowFlex',
    label: 'Elbow Flexion',
    group: 'Arm',
    axis: 'z',
    min: -1.95,
    max: 0.08,
    defaultAngle: -0.14,
    maxSpeed: 2.2,
    componentId: 'WS001-ELBOW-JOINT',
  },
  wristFlex: {
    id: 'wristFlex',
    label: 'Wrist Flexion',
    group: 'Wrist',
    axis: 'y',
    min: -0.95,
    max: 0.95,
    defaultAngle: 0.02,
    maxSpeed: 2.8,
    componentId: 'WS001-WRIST-CUFF',
  },
  wristRotate: {
    id: 'wristRotate',
    label: 'Wrist Pronation / Supination',
    group: 'Wrist',
    axis: 'x',
    min: -1.45,
    max: 1.45,
    defaultAngle: 0.0,
    maxSpeed: 3.1,
    componentId: 'WS001-WRIST-CUFF',
  },
  thumbCmc: {
    id: 'thumbCmc',
    label: 'Thumb CMC Opposition',
    group: 'Thumb',
    axis: 'y',
    min: -1.35,
    max: 1.35,
    defaultAngle: 0.0,
    maxSpeed: 3.8,
    componentId: 'WS001-HAND-THUMB',
  },
  thumbMcp: {
    id: 'thumbMcp',
    label: 'Thumb MCP',
    group: 'Thumb',
    axis: 'y',
    min: -0.55,
    max: 1.25,
    defaultAngle: 0.0,
    maxSpeed: 4.0,
    componentId: 'WS001-HAND-THUMB',
  },
  thumbIp: {
    id: 'thumbIp',
    label: 'Thumb IP',
    group: 'Thumb',
    axis: 'y',
    min: -0.55,
    max: 1.35,
    defaultAngle: 0.0,
    maxSpeed: 4.2,
    componentId: 'WS001-HAND-THUMB',
  },
  indexMcp: {
    id: 'indexMcp',
    label: 'Index MCP',
    group: 'Index',
    axis: 'y',
    min: -0.55,
    max: 1.55,
    defaultAngle: 0.0,
    maxSpeed: 4.2,
    componentId: 'WS001-HAND-INDEX',
  },
  indexPip: {
    id: 'indexPip',
    label: 'Index PIP',
    group: 'Index',
    axis: 'y',
    min: -0.55,
    max: 1.75,
    defaultAngle: 0.0,
    maxSpeed: 4.4,
    componentId: 'WS001-HAND-INDEX',
  },
  indexDip: {
    id: 'indexDip',
    label: 'Index DIP',
    group: 'Index',
    axis: 'y',
    min: -0.55,
    max: 1.35,
    defaultAngle: 0.0,
    maxSpeed: 4.5,
    componentId: 'WS001-HAND-INDEX',
  },
  middleMcp: {
    id: 'middleMcp',
    label: 'Middle MCP',
    group: 'Middle',
    axis: 'y',
    min: -0.55,
    max: 1.55,
    defaultAngle: 0.0,
    maxSpeed: 4.2,
    componentId: 'WS001-HAND-MIDDLE',
  },
  middlePip: {
    id: 'middlePip',
    label: 'Middle PIP',
    group: 'Middle',
    axis: 'y',
    min: -0.55,
    max: 1.8,
    defaultAngle: 0.0,
    maxSpeed: 4.4,
    componentId: 'WS001-HAND-MIDDLE',
  },
  middleDip: {
    id: 'middleDip',
    label: 'Middle DIP',
    group: 'Middle',
    axis: 'y',
    min: -0.55,
    max: 1.35,
    defaultAngle: 0.0,
    maxSpeed: 4.5,
    componentId: 'WS001-HAND-MIDDLE',
  },
  ringMcp: {
    id: 'ringMcp',
    label: 'Ring MCP',
    group: 'Ring',
    axis: 'y',
    min: -0.55,
    max: 1.55,
    defaultAngle: 0.0,
    maxSpeed: 4.2,
    componentId: 'WS001-HAND-RING',
  },
  ringPip: {
    id: 'ringPip',
    label: 'Ring PIP',
    group: 'Ring',
    axis: 'y',
    min: -0.55,
    max: 1.8,
    defaultAngle: 0.0,
    maxSpeed: 4.4,
    componentId: 'WS001-HAND-RING',
  },
  ringDip: {
    id: 'ringDip',
    label: 'Ring DIP',
    group: 'Ring',
    axis: 'y',
    min: -0.55,
    max: 1.35,
    defaultAngle: 0.0,
    maxSpeed: 4.5,
    componentId: 'WS001-HAND-RING',
  },
  littleMcp: {
    id: 'littleMcp',
    label: 'Little MCP',
    group: 'Little',
    axis: 'y',
    min: -0.55,
    max: 1.55,
    defaultAngle: 0.0,
    maxSpeed: 4.2,
    componentId: 'WS001-HAND-LITTLE',
  },
  littlePip: {
    id: 'littlePip',
    label: 'Little PIP',
    group: 'Little',
    axis: 'y',
    min: -0.55,
    max: 1.8,
    defaultAngle: 0.0,
    maxSpeed: 4.4,
    componentId: 'WS001-HAND-LITTLE',
  },
  littleDip: {
    id: 'littleDip',
    label: 'Little DIP',
    group: 'Little',
    axis: 'y',
    min: -0.55,
    max: 1.35,
    defaultAngle: 0.0,
    maxSpeed: 4.5,
    componentId: 'WS001-HAND-LITTLE',
  },
};

export const JOINT_IDS = Object.keys(JOINT_CONFIGS) as JointId[];

// Degree-to-radian helper for anatomical pose presets
const deg = (d: number) => (d * Math.PI) / 180;

export const POSE_PRESETS: Record<PosePresetId, { label: string; angles: Partial<Record<JointId, number>> }> = {
  relax: {
    label: 'Relax',
    angles: Object.fromEntries(JOINT_IDS.map((id) => [id, JOINT_CONFIGS[id].defaultAngle])),
  },
  open: {
    label: 'Open',
    angles: {
      shoulderPitch: 0,
      shoulderRoll: 0,
      elbowFlex: -0.05,
      wristFlex: 0,
      wristRotate: 0,
      thumbCmc: deg(-8),
      thumbMcp: deg(-12),
      thumbIp: deg(-14),
      indexMcp: deg(-12),
      indexPip: deg(-16),
      indexDip: deg(-10),
      middleMcp: deg(-12),
      middlePip: deg(-16),
      middleDip: deg(-10),
      ringMcp: deg(-12),
      ringPip: deg(-16),
      ringDip: deg(-10),
      littleMcp: deg(-12),
      littlePip: deg(-16),
      littleDip: deg(-10),
    },
  },
  close: {
    label: 'Close',
    angles: {
      thumbCmc: deg(42),
      thumbMcp: deg(36),
      thumbIp: deg(38),
      indexMcp: deg(52),
      indexPip: deg(58),
      indexDip: deg(40),
      middleMcp: deg(54),
      middlePip: deg(60),
      middleDip: deg(42),
      ringMcp: deg(56),
      ringPip: deg(62),
      ringDip: deg(42),
      littleMcp: deg(58),
      littlePip: deg(64),
      littleDip: deg(44),
    },
  },
  fist: {
    label: 'Fist',
    angles: {
      elbowFlex: -0.42,
      wristFlex: 0.08,
      thumbCmc: deg(62),
      thumbMcp: deg(48),
      thumbIp: deg(52),
      indexMcp: deg(75),
      indexPip: deg(82),
      indexDip: deg(55),
      middleMcp: deg(75),
      middlePip: deg(82),
      middleDip: deg(55),
      ringMcp: deg(75),
      ringPip: deg(82),
      ringDip: deg(55),
      littleMcp: deg(75),
      littlePip: deg(82),
      littleDip: deg(55),
    },
  },
  point: {
    label: 'Point',
    angles: {
      elbowFlex: -0.18,
      wristFlex: 0.0,
      thumbCmc: deg(66),
      thumbMcp: deg(52),
      thumbIp: deg(56),
      indexMcp: deg(-10),
      indexPip: deg(-15),
      indexDip: deg(-10),
      middleMcp: deg(75),
      middlePip: deg(82),
      middleDip: deg(55),
      ringMcp: deg(75),
      ringPip: deg(82),
      ringDip: deg(55),
      littleMcp: deg(75),
      littlePip: deg(82),
      littleDip: deg(55),
    },
  },
  thumbsUp: {
    label: 'Thumbs Up',
    angles: {
      elbowFlex: -0.35,
      wristRotate: -0.45,
      thumbCmc: deg(-66),
      thumbMcp: deg(-12),
      thumbIp: deg(-18),
      indexMcp: deg(75),
      indexPip: deg(82),
      indexDip: deg(55),
      middleMcp: deg(75),
      middlePip: deg(82),
      middleDip: deg(55),
      ringMcp: deg(75),
      ringPip: deg(82),
      ringDip: deg(55),
      littleMcp: deg(75),
      littlePip: deg(82),
      littleDip: deg(55),
    },
  },
  reset: {
    label: 'Reset',
    angles: Object.fromEntries(JOINT_IDS.map((id) => [id, JOINT_CONFIGS[id].defaultAngle])),
  },
};

export const CAMERA_PRESETS: Record<
  CameraPresetId,
  { label: string; position: [number, number, number]; target: [number, number, number] }
> = {
  default: { label: 'Default Side', position: [0.0, 0.05, 1.24], target: [0.0, 0.0, 0.0] },
  side: { label: 'Lateral Side', position: [0.0, 0.02, 1.26], target: [0.0, 0.0, 0.0] },
  front: { label: 'Anterior Front', position: [-1.05, 0.14, 0.52], target: [-0.04, 0.0, 0.0] },
  top: { label: 'Dorsal Top', position: [0.0, 1.18, 0.18], target: [0.0, 0.0, 0.0] },
  hand: { label: 'Hand Close-Up', position: [-0.34, 0.02, 0.42], target: [-0.34, 0.0, 0.01] },
  wrist: { label: 'Wrist Gimbal', position: [-0.18, 0.04, 0.36], target: [-0.18, -0.01, 0.01] },
  elbow: { label: 'Elbow Actuator', position: [0.07, 0.04, 0.42], target: [0.07, -0.01, 0.0] },
  shoulder: { label: 'Shoulder / Star', position: [0.35, 0.04, 0.42], target: [0.35, 0.0, 0.02] },
};

export const COMPONENT_METADATA: Record<ComponentId, ComponentMetadata> = {
  'WS001-SHOULDER-CAP': {
    id: 'WS001-SHOULDER-CAP',
    code: 'D4',
    serial: 'NO. WS001-SHD-001',
    name: 'Deltoid Armor Dome & Mount',
    shortName: 'CMPNT 008',
    assembly: 'SHOULDER',
    path: 'C://WS001/SHOULDER/DELTOID',
    unitNumber: 'UNIT #757',
    ipAddress: '6 - 815.096.088',
    description:
      'Multi-tiered titanium-steel deltoid cap anchoring the bionic socket interface and hosting the Soviet red star emblem.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'models/upper-arm-7.stl',
    relatedParts: ['WS001-SHOULDER-STAR', 'WS001-UPPER-ARM'],
    isMaster: true,
    masterLabel: 'MASTER 01',
  },
  'WS001-SHOULDER-STAR': {
    id: 'WS001-SHOULDER-STAR',
    code: 'S1',
    serial: 'NO. WS001-STR-002',
    name: 'Extruded Red Star Insignia',
    shortName: 'STAR INSIG',
    assembly: 'SHOULDER',
    path: 'C://WS001/SHOULDER/STAR',
    unitNumber: 'UNIT #674',
    ipAddress: '6 - 815.098.024',
    description:
      '1.5 mm proud beveled five-pointed crimson star inset into the lateral deltoid dome plate.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'upper-arm-7.stl (shader-etched SDF star decal)',
    relatedParts: ['WS001-SHOULDER-CAP'],
  },
  'WS001-UPPER-ARM': {
    id: 'WS001-UPPER-ARM',
    code: 'U2',
    serial: 'NO. WS001-UPR-010',
    name: 'Bicep / Tricep Overlapping Plates',
    shortName: 'CMPNT 114',
    assembly: 'UPPER',
    path: 'C://WS001/UPPER/BICEP',
    unitNumber: 'UNIT #228',
    ipAddress: '7 - 815.096.098',
    description:
      'Stacked horizontal articulated armor bands from upper-arm-7.stl.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'upper-arm-7.stl',
    relatedParts: ['WS001-SHOULDER-CAP', 'WS001-ELBOW-JOINT'],
    isMaster: true,
    masterLabel: 'MASTER 01',
  },
  'WS001-ELBOW-JOINT': {
    id: 'WS001-ELBOW-JOINT',
    code: 'E3',
    serial: 'NO. WS001-ELB-020',
    name: 'Rotary Elbow Actuator Housing',
    shortName: 'CMPNT 862',
    assembly: 'ELBOW',
    path: 'C://WS001/ELBOW/ACTUATOR',
    unitNumber: 'UNIT #314',
    ipAddress: '8 - 815.091.021',
    description:
      'High-torque elbow hinge interface computed from upper-arm-7 / lower-arm-7 STL seam.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'lower-arm-7.stl (proximal seam pivot)',
    relatedParts: ['WS001-UPPER-ARM', 'WS001-FOREARM'],
    isMaster: true,
    masterLabel: 'MASTER 01',
  },
  'WS001-FOREARM': {
    id: 'WS001-FOREARM',
    code: 'F4',
    serial: 'NO. WS001-FRM-030',
    name: 'Diagonal Shingled Forearm Chassis',
    shortName: 'FOREARM SHL',
    assembly: 'FOREARM',
    path: 'C://WS001/FOREARM/CHASSIS',
    unitNumber: 'UNIT #201',
    ipAddress: '7 - 815.096.011',
    description:
      'Sweeping oblique brushed-metal forearm plates from lower-arm-7.stl.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'lower-arm-7.stl',
    relatedParts: ['WS001-ELBOW-JOINT', 'WS001-WRIST-CUFF'],
  },
  'WS001-WRIST-CUFF': {
    id: 'WS001-WRIST-CUFF',
    code: 'W5',
    serial: 'NO. WS001-WRS-040',
    name: '2-DOF Gimbal Wrist Collar',
    shortName: 'WRIST GIMB',
    assembly: 'WRIST',
    path: 'C://WS001/WRIST/GIMBAL',
    unitNumber: 'UNIT #815',
    ipAddress: '7 - 815.498.011',
    description:
      'Continuous pronation/supination wrist rim computed at distal lower-arm-7.stl cuff.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'lower-arm-7.stl (distal wrist rim)',
    relatedParts: ['WS001-FOREARM', 'WS001-HAND-PALM'],
  },
  'WS001-HAND-PALM': {
    id: 'WS001-HAND-PALM',
    code: 'P1',
    serial: 'NO. WS001-HND-050',
    name: 'Metacarpal Frame & Dorsal Armor',
    shortName: 'PALM FRAME',
    assembly: 'HAND',
    path: 'C://WS001/HAND/PALM',
    unitNumber: 'UNIT #114',
    ipAddress: '8 - 815.196.027',
    description:
      'Sculpted 1:1 STL-calibrated left-hand metacarpal housing topped by the 52.8×106.0×40.8 mm arched horseshoe glove-top bridge with central U-cutout.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'models/glove-top-detail.stl',
    relatedParts: [
      'WS001-WRIST-CUFF',
      'WS001-HAND-THUMB',
      'WS001-HAND-INDEX',
      'WS001-HAND-MIDDLE',
      'WS001-HAND-RING',
      'WS001-HAND-LITTLE',
    ],
  },
  'WS001-HAND-THUMB': {
    id: 'WS001-HAND-THUMB',
    code: 'T1',
    serial: 'NO. WS001-THM-051',
    name: 'Opposable Thumb Assembly (CMC/MCP/IP)',
    shortName: 'THUMB ASSY',
    assembly: 'HAND',
    path: 'C://WS001/HAND/THUMB',
    unitNumber: 'UNIT #256',
    ipAddress: '7 - 815.204.019',
    description: 'Three-axis radial opposable thumb with armored dorsal phalanx plates.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'models/fingers-fixed.stl',
    relatedParts: ['WS001-HAND-PALM'],
  },
  'WS001-HAND-INDEX': {
    id: 'WS001-HAND-INDEX',
    code: 'K1',
    serial: 'NO. WS001-IDX-052',
    name: 'Index Digit Chain (MCP/PIP/DIP)',
    shortName: 'INDEX DGT',
    assembly: 'HAND',
    path: 'C://WS001/HAND/INDEX',
    unitNumber: 'UNIT #402',
    ipAddress: '8 - 815.212.044',
    description: 'High-precision three-phalanx metallic index finger with tactile pressure tip.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'models/fingers-fixed.stl',
    relatedParts: ['WS001-HAND-PALM'],
  },
  'WS001-HAND-MIDDLE': {
    id: 'WS001-HAND-MIDDLE',
    code: 'R2',
    serial: 'NO. WS001-MID-053',
    name: 'Middle Digit Chain (MCP/PIP/DIP)',
    shortName: 'MIDDLE DGT',
    assembly: 'HAND',
    path: 'C://WS001/HAND/MIDDLE',
    unitNumber: 'UNIT #403',
    ipAddress: '8 - 815.212.045',
    description: 'Primary load-bearing central digit with reinforced titanium linkage.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'models/fingers-fixed.stl',
    relatedParts: ['WS001-HAND-PALM'],
  },
  'WS001-HAND-RING': {
    id: 'WS001-HAND-RING',
    code: 'R3',
    serial: 'NO. WS001-RNG-054',
    name: 'Ring Digit Chain (MCP/PIP/DIP)',
    shortName: 'RING DGT',
    assembly: 'HAND',
    path: 'C://WS001/HAND/RING',
    unitNumber: 'UNIT #404',
    ipAddress: '8 - 815.212.046',
    description: 'Articulated ring digit synchronized with palm grip torque sensors.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'models/fingers-fixed.stl',
    relatedParts: ['WS001-HAND-PALM'],
  },
  'WS001-HAND-LITTLE': {
    id: 'WS001-HAND-LITTLE',
    code: 'L5',
    serial: 'NO. WS001-LTL-055',
    name: 'Little Digit Chain (MCP/PIP/DIP)',
    shortName: 'LITTLE DGT',
    assembly: 'HAND',
    path: 'C://WS001/HAND/LITTLE',
    unitNumber: 'UNIT #405',
    ipAddress: '8 - 815.212.047',
    description: 'Ulnar fifth digit completing full cylindrical and spherical grip closure.',
    sourceType: 'STL-Target / Articulated Shell',
    stlSourceHypothesis: 'models/fingers-fixed.stl',
    relatedParts: ['WS001-HAND-PALM'],
  },
};

export const COMPONENT_IDS = Object.keys(COMPONENT_METADATA) as ComponentId[];
