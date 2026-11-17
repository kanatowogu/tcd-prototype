export type RedactTargetId =
  | 'f1_target1'
  | 'f1_target2'
  | 'f3_target1'
  | 'f4_target1'
  | 'f5_target1';

export type PropId = 'prop_lunchbox' | 'prop_mug' | 'prop_glass';
export type V2PropId = PropId | 'polaroid';
export type EndingARedactId = 'endA_1' | 'endA_2' | 'endA_3';

export type ActiveFileTab = 'file01' | 'file02' | 'file03' | 'file04' | 'file05' | 'compare';
export type Language = 'zh' | 'en';

export type FocusTarget =
  | 'none'
  | 'monitor'
  | 'partition'
  | 'manual'
  | 'file01'
  | 'file02'
  | 'file03'
  | 'file04'
  | 'file05'
  | 'compare'
  | 'prop_lunchbox'
  | 'prop_mug'
  | 'polaroid';

export interface GameState {
  hasLoggedIn: boolean;
  hasReadManual: boolean;
  hasReadFile02: boolean;
  redactedTargets: RedactTargetId[];
  inspectedProps: V2PropId[];
  phase2PropsInspected: V2PropId[]; // Props re-checked after #04 discrepancy flagged
  phase3PropsInspected: V2PropId[]; // Props re-checked after lensBroken === true
  file03Decrypted: boolean;         // f1_target1 && f1_target2 redacted
  file04Delivered: boolean;         // Unlocked after #01 redactions complete
  file03Target1Unlocked: boolean;   // f4_target1 flagged && phase2PropsInspected.length >= 2
  f3BleedRevealed: boolean;         // Set true 1.2s after clicking f3_target1
  file05Delivered: boolean;         // Set true once f3BleedRevealed === true
  lensBroken: boolean;              // Set true when f5_target1 is cleared
  phase4LongPressUnlocked: boolean; // Set true when lensBroken && phase3PropsInspected.length >= 3
  resignationRejected: boolean;     // Set true when long-press reaches 100%
  showFinalDecisionModal: boolean;
  endingChoice: 'A' | 'B' | null;
  endingARedacted: EndingARedactId[];
  lastResignQuoteIndex: number;
  lastIdleBanterIndex: number;
}
