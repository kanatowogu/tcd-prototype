import { Language } from '../types';
import {
  EXPANDED_SCRIPT_ITEMS_2_3,
  ExpandedItem2And3Assets,
} from './narrativeV2_items2_3';
import {
  EXPANDED_SCRIPT_ITEMS_4_5,
  ExpandedItem4And5Assets,
} from './narrativeV2_items4_5';

export interface UnifiedUIStrings {
  workstationLabel: string;
  filterActive: string;
  filterBroken: string;
  operatorActive: string;
  operatorCorrupted: string;
  cognitiveQuotaLabel: (count: number, broken: boolean) => string;
  clearanceSynced: string;
  clearanceLocked: string;
  stampNormalized: string;
  stampDataAbsorbed: string;
  stampPhysicallyStapled: string;
  stampInkOverflow: string;
  clickToRedactViolation: string;
  clickToFlagDiscrepancy: string;
  clickToConfirmClear: string;
  phase2NeedPropsLock: (doneCount: number) => string;
  phase3NeedPropsHint: (doneCount: number) => string;
  phase3PropsReadyHint: string;
  compareTabLabel: string;
  openCompareInlineBtn: string;
  goToFile01Btn: string;
  goToFile04Btn: string;
  stageBDecryptedStrip: string;
  retrospectiveHeader: string;
  evidence1Caption: string;
  evidence2Caption: string;
  evidence3Caption: string;
  resignBtnLocked: (count: number) => string;
  resignPopupTitle: string;
  resignPopupStageLabel: (count: number) => string;
  returnToWorkstationBtn: string;
  bottomHintIncomplete: (remaining: number) => string;
  bottomHintPhase2Audit: string;
  bottomHintPhase3Ready: string;
  viewAct3ReviewBtn: string;
  reopenAct3ReviewBtn: string;
  act3ModalTitle: string;
  minimizeReviewBtn: string;
  returnToDeskInspectBtn: string;
  act3LeftColHeader: string;
  act3RightColHeader: string;
  act4ChoiceModalTitle: string;
  returnToDeskShortBtn: string;
  branchATag: string;
  selectBranchABtn: string;
  branchBTag: string;
  selectBranchBBtn: string;
  filterRestoreMeter: (percent: number, count: number) => string;
  targetIdPrefix: string;
  clickToRedactTruth: string;
  endingAPhotoRestoredCaption: string;
  backToProtocolSelectionBtn: string;
  endingBMatrixTag: string;
  endingBPhotoCaption: string;
  holdingLabel: string;
  stayOnDutyLabel: string;
  manualLateNoteHeader: string;
  dossierDeliveredBanner: (num: string) => string;
}

export interface UnifiedNarrativeBundle {
  ui: UnifiedUIStrings;
  v2_2_3: ExpandedItem2And3Assets;
  v2_4_5: ExpandedItem4And5Assets;
}

const UI_STRINGS: Record<Language, UnifiedUIStrings> = {
  zh: {
    workstationLabel: '工位 #302 // 地下市政B区',
    filterActive: '认知滤镜：正常运转',
    filterBroken: '认知滤镜：已碎裂',
    operatorActive: '操作员：档案员 #302',
    operatorCorrupted: '操作员：合并索引点',
    cognitiveQuotaLabel: (count, broken) =>
      broken ? `今日配额：4/3 (索引溢出)` : `今日认知配额：${count}/3`,
    clearanceSynced: '权限状态：已同步',
    clearanceLocked: '权限状态：0/1（待同步）',
    stampNormalized: '[记录已规范化]',
    stampDataAbsorbed: '[数据已吸收]',
    stampPhysicallyStapled: '[物理装订已完成]',
    stampInkOverflow: '[墨迹未干 // 底层显影]',
    clickToRedactViolation: '[点击涂黑违规语句]',
    clickToFlagDiscrepancy: '[点击标出审计矛盾]',
    clickToConfirmClear: '[点击确认并核销此项]',
    phase2NeedPropsLock: (doneCount) =>
      `[阶段锁定：请先在《档案 #04》标出矛盾并复核至少 2 件桌面实物 (${doneCount}/2)]`,
    phase3NeedPropsHint: (doneCount) =>
      `请先拿起并复核桌面上已异变的实物（${doneCount}/3），随后解锁离职长按协议`,
    phase3PropsReadyHint: '三阶实物复核已完成，长按下方按钮提交离职 / 自毁申请',
    compareTabLabel: '双栏比对 (#02 vs #03)',
    openCompareInlineBtn: '[开启 #02 与 #03 双栏比对]',
    goToFile01Btn: '[前往 #01 执行常规脱敏]',
    goToFile04Btn: '[前往 #04 查看能耗与打卡对账]',
    stageBDecryptedStrip: '>>> 权限已同步 —— #03 草稿已解封，#04 审计表已递送至桌面',
    retrospectiveHeader: '【回溯真相层 —— 原章已剥落（DIGESTION-LOG-302）】',
    evidence1Caption: '证物 #1：Family_Photo.jpg（班前视觉校准照片）',
    evidence2Caption: '证物 #2：CCTV_SectorB.png —— B区走廊 02:14 监控静帧',
    evidence3Caption: '证物 #3：Photo_Truth.png —— 红订书钉贯穿装订的证件与传单',
    resignBtnLocked: (count) => `[申请离职 / 自我注销] (配额进度 ${count}/3)`,
    resignPopupTitle: '离职 / 自我注销审批终端反馈',
    resignPopupStageLabel: (count) => `阶段 ${count}/3 —— 当班配额未满`,
    returnToWorkstationBtn: '[返回工位继续作业]',
    bottomHintIncomplete: (remaining) =>
      `请依序处理桌角卷宗，尚余 ${remaining} 处核心涂黑待完成`,
    bottomHintPhase2Audit: '请查看桌面新递送的《档案 #05》，核销最终遥测记录',
    bottomHintPhase3Ready: '长按并按住下方按钮，提交工位 #302 注销申请',
    viewAct3ReviewBtn: '[查看回溯清单]',
    reopenAct3ReviewBtn: '[打开 #01 回溯层与真相证物对比]',
    act3ModalTitle: '!! 认知滤镜碎裂 —— 3号档案柜底层清点 !!',
    minimizeReviewBtn: '[返回桌面复核实物]',
    returnToDeskInspectBtn: '[返回办公桌 —— 逐一端详便当盒 / 马克杯 / 隔断玻璃 / 照片]',
    act3LeftColHeader: '档案 #01 —— 印章剥落回溯层（DIGESTION-LOG-302）',
    act3RightColHeader: 'Family_Photo.jpg —— 订书钉装订真相（Photo_Truth.png）',
    act4ChoiceModalTitle: '最终归档裁决协议 —— 决定档案命运',
    returnToDeskShortBtn: '[返回桌面]',
    branchATag: '协议 A // 抹除与封存（心理学防御镜像）',
    selectBranchABtn: '[选择协议 A：抹除异常 · 维持完美记录]',
    branchBTag: '协议 B // 保留与同化（超自然深渊镜像）',
    selectBranchBBtn: '[选择协议 B：保留矛盾 · 暴露底层索引]',
    filterRestoreMeter: (percent, count) => `认知滤镜修复进度：${percent}% (${count}/3)`,
    targetIdPrefix: '底档编号：',
    clickToRedactTruth: '[点击亲手涂黑此条真相]',
    endingAPhotoRestoredCaption: 'Family_Photo.jpg —— 认知滤镜已 100% 修复',
    backToProtocolSelectionBtn: '[返回最终归档协议选择]',
    endingBMatrixTag: '行政表皮：已剥落 // 索引树：裸露',
    endingBPhotoCaption: '家庭索引归并完毕 —— 预留空位等待订书钉',
    holdingLabel: '按住不放……',
    stayOnDutyLabel: '[保持在岗]',
    manualLateNoteHeader: '【蓝黑圆珠笔手写批注】',
    dossierDeliveredBanner: (num) => `>>> 桌面新递送卷宗：${num}`,
  },
  en: {
    workstationLabel: 'DESK #302 // SUB-LEVEL SECTOR B',
    filterActive: 'FILTER: ACTIVE',
    filterBroken: 'FILTER: BROKEN',
    operatorActive: 'OPERATOR: ARCHIVIST #302',
    operatorCorrupted: 'OPERATOR: MERGER NODE',
    cognitiveQuotaLabel: (count, broken) =>
      broken ? 'SHIFT QUOTA: 4/3 (OVERFLOW)' : `COGNITIVE QUOTA: ${count}/3`,
    clearanceSynced: 'CLEARANCE: SYNCED',
    clearanceLocked: 'CLEARANCE: 0/1',
    stampNormalized: '[RECORD NORMALIZED]',
    stampDataAbsorbed: '[DATA ABSORBED]',
    stampPhysicallyStapled: '[PHYSICALLY STAPLED]',
    stampInkOverflow: '[INK UNSET // UNDERLAYER]',
    clickToRedactViolation: '[CLICK TO REDACT LINE]',
    clickToFlagDiscrepancy: '[CLICK TO FLAG AUDIT CONFLICT]',
    clickToConfirmClear: '[CLICK TO CONFIRM & CLEAR]',
    phase2NeedPropsLock: (doneCount) =>
      `[LOCKED: Flag File #04 & inspect ≥2 desk items first (${doneCount}/2)]`,
    phase3NeedPropsHint: (doneCount) =>
      `Inspect mutated desk items (${doneCount}/3) to unlock resignation hold`,
    phase3PropsReadyHint: 'Re-examination complete. Press and hold below to resign',
    compareTabLabel: 'Compare (#02 vs #03)',
    openCompareInlineBtn: '[COMPARE #02 & #03 SIDE-BY-SIDE]',
    goToFile01Btn: '[OPEN FILE #01 TO REDACT]',
    goToFile04Btn: '[OPEN FILE #04 UTILITY AUDIT]',
    stageBDecryptedStrip: '>>> CLEARANCE SYNCED — FILE #03 UNLOCKED & FILE #04 DELIVERED',
    retrospectiveHeader: '[RETROSPECTIVE LAYER — STAMP PEELED (DIGESTION-LOG-302)]',
    evidence1Caption: 'EVIDENCE #1: Family_Photo.jpg (Pre-Shift Visual Check)',
    evidence2Caption: 'EVIDENCE #2: CCTV_SectorB.png — 02:14 CORRIDOR STILL',
    evidence3Caption: 'EVIDENCE #3: Photo_Truth.png — STAPLED BADGES & M-04 FLYER',
    resignBtnLocked: (count) => `[APPLY FOR RESIGNATION] (${count}/3)`,
    resignPopupTitle: 'RESIGNATION / SELF-TERMINATION RESPONSE',
    resignPopupStageLabel: (count) => `STAGE ${count}/3 — QUOTA INCOMPLETE`,
    returnToWorkstationBtn: '[RETURN TO DESK #302]',
    bottomHintIncomplete: (remaining) =>
      `Process dossiers on your desk (${remaining} core redaction(s) remaining)`,
    bottomHintPhase2Audit: 'Inspect newly delivered File #05 to clear final telemetry',
    bottomHintPhase3Ready: 'Press and hold below to submit Workstation #302 termination',
    viewAct3ReviewBtn: '[CABINET #3 AUDIT]',
    reopenAct3ReviewBtn: '[OPEN #01 RETROSPECTIVE & PHOTO COMPARISON]',
    act3ModalTitle: '!! LENS SHATTERED — CABINET #3 INVENTORY !!',
    minimizeReviewBtn: '[RETURN TO DESK PROPS]',
    returnToDeskInspectBtn: '[RETURN TO DESK — INSPECT LUNCHBOX / MUG / GLASS / PHOTO]',
    act3LeftColHeader: 'FILE #01 — PEELED RETROSPECTIVE (DIGESTION-LOG-302)',
    act3RightColHeader: 'Family_Photo.jpg — STAPLED TRUTH (Photo_Truth.png)',
    act4ChoiceModalTitle: 'FINAL ARCHIVE PROTOCOL — DISPOSITION',
    returnToDeskShortBtn: '[RETURN TO DESK]',
    branchATag: 'PROTOCOL A // CONTAINMENT (PSYCHOLOGICAL MIRROR)',
    selectBranchABtn: '[SELECT PROTOCOL A: ERASE & CONTAIN]',
    branchBTag: 'PROTOCOL B // ASSIMILATION (COSMIC MIRROR)',
    selectBranchBBtn: '[SELECT PROTOCOL B: PRESERVE & RECONSTRUCT]',
    filterRestoreMeter: (percent, count) =>
      `FILTER RESTORATION: ${percent}% (${count}/3)`,
    targetIdPrefix: 'RECORD ID: ',
    clickToRedactTruth: '[CLICK TO REDACT TRUTH]',
    endingAPhotoRestoredCaption: 'Family_Photo.jpg — FILTER 100% RESTORED',
    backToProtocolSelectionBtn: '[BACK TO PROTOCOL SELECTION]',
    endingBMatrixTag: 'UI SHELL: PEELED // INDEX: EXPOSED',
    endingBPhotoCaption: 'MERGER COMPLETE — OPEN SLOT AWAITING STAPLE',
    holdingLabel: 'HOLDING...',
    stayOnDutyLabel: '[STAY ON DUTY]',
    manualLateNoteHeader: '[BLUE-BLACK BALLPOINT NOTE]',
    dossierDeliveredBanner: (num) => `>>> NEW DOSSIER DELIVERED TO DESK: ${num}`,
  },
};

export function getNarrativeBundle(lang: Language): UnifiedNarrativeBundle {
  return {
    ui: UI_STRINGS[lang],
    v2_2_3: EXPANDED_SCRIPT_ITEMS_2_3[lang],
    v2_4_5: EXPANDED_SCRIPT_ITEMS_4_5[lang],
  };
}
