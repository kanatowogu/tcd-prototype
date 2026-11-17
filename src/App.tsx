import React, { useEffect, useRef, useState } from 'react';
import { Act3ReviewModal } from './components/Act3ReviewModal';
import { Act4EndingModal } from './components/Act4EndingModal';
import { DeskScene } from './components/DeskScene';
import { DocumentInspector } from './components/DocumentInspector';
import { OpeningModal } from './components/OpeningModal';
import { SubtitleHUD } from './components/SubtitleHUD';
import { getNarrativeBundle } from './data/narrativeAssets';
import {
  EndingARedactId,
  FocusTarget,
  GameState,
  Language,
  RedactTargetId,
  V2PropId,
} from './types';
import { soundEngine } from './utils/soundEngine';

const INITIAL_GAME_STATE: GameState = {
  hasLoggedIn: false,
  hasReadManual: false,
  hasReadFile02: false,
  redactedTargets: [],
  inspectedProps: [],
  phase2PropsInspected: [],
  phase3PropsInspected: [],
  file03Decrypted: false,
  file04Delivered: false,
  file03Target1Unlocked: false,
  f3BleedRevealed: false,
  file05Delivered: false,
  lensBroken: false,
  phase4LongPressUnlocked: false,
  resignationRejected: false,
  showFinalDecisionModal: false,
  endingChoice: null,
  endingARedacted: [],
  lastResignQuoteIndex: -1,
  lastIdleBanterIndex: -1,
};

type InnerVoiceState =
  | { kind: 'wakeup' }
  | { kind: 'idle_banter'; index: number }
  | { kind: 'file02_read' }
  | { kind: 'redact'; id: RedactTargetId }
  | { kind: 'f3_bleed_revealed' }
  | { kind: 'prop'; id: V2PropId; stage: 1 | 2 | 3; lineIndex: number }
  | { kind: 'resign'; stage: 0 | 1 | 2; index: number }
  | { kind: 'longpress_stage'; stage: 'pct25' | 'pct55' | 'pct75_rebound' }
  | { kind: 'rejected' }
  | { kind: 'endingA_step'; id: EndingARedactId }
  | { kind: 'endingA_final' }
  | { kind: 'endingB_final' };

export const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [focusTarget, setFocusTarget] = useState<FocusTarget>('none');
  const [voiceState, setVoiceState] = useState<InnerVoiceState>({ kind: 'wakeup' });

  const [f3BleedPending, setF3BleedPending] = useState(false);
  const [subtitleLagging, setSubtitleLagging] = useState(false);
  const [propClickCounts, setPropClickCounts] = useState<Record<V2PropId, number>>({
    prop_glass: 0,
    prop_lunchbox: 0,
    prop_mug: 0,
    polaroid: 0,
  });

  // UI Modal / Popup states
  const [resignPopup, setResignPopup] = useState<{
    stage: 0 | 1 | 2;
    index: number;
  } | null>(null);
  const [showAct3ReviewModal, setShowAct3ReviewModal] = useState<boolean>(false);
  const [lastInteractionTick, setLastInteractionTick] = useState<number>(0);

  const bleedTimeoutRef = useRef<number | null>(null);

  const bundle = getNarrativeBundle(lang);
  const { ui, v2_2_3, v2_4_5 } = bundle;
  const quotaCount = (['f1_target1', 'f1_target2', 'f3_target1'] as RedactTargetId[]).filter(
    (id) => gameState.redactedTargets.includes(id)
  ).length;

  const isEndingAFullyRestored =
    gameState.endingChoice === 'A' && gameState.endingARedacted.length === 3;
  const isEffectiveLensBroken = gameState.lensBroken && !isEndingAFullyRestored;
  const isPhase2Doubt =
    !isEffectiveLensBroken && gameState.redactedTargets.includes('f4_target1');

  const bumpInteraction = () => {
    setLastInteractionTick((t) => t + 1);
  };

  const toggleLanguage = () => {
    bumpInteraction();
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  // Cleanup ink bleed timer on unmount
  useEffect(() => {
    return () => {
      if (bleedTimeoutRef.current !== null) {
        window.clearTimeout(bleedTimeoutRef.current);
      }
    };
  }, []);

  // Idle Banter Timer (25–35s of inactivity when resting on desk, never interrupts inspection)
  useEffect(() => {
    if (
      !gameState.hasLoggedIn ||
      isEffectiveLensBroken ||
      focusTarget !== 'none' ||
      gameState.showFinalDecisionModal ||
      showAct3ReviewModal ||
      resignPopup !== null
    ) {
      return;
    }

    const delayMs = 25000 + Math.floor(Math.random() * 10000);
    const timer = window.setTimeout(() => {
      const pool = v2_2_3.asset1.randomIdleBanter;
      const candidates = pool
        .map((_, idx) => idx)
        .filter((idx) => idx !== gameState.lastIdleBanterIndex);
      const chosenIndex =
        candidates[Math.floor(Math.random() * candidates.length)] ?? 0;

      setGameState((prev) => ({
        ...prev,
        lastIdleBanterIndex: chosenIndex,
      }));
      setVoiceState({ kind: 'idle_banter', index: chosenIndex });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [
    lastInteractionTick,
    gameState.hasLoggedIn,
    gameState.lastIdleBanterIndex,
    gameState.showFinalDecisionModal,
    isEffectiveLensBroken,
    focusTarget,
    showAct3ReviewModal,
    resignPopup,
    v2_2_3.asset1.randomIdleBanter,
  ]);

  // Resolve localized Inner Voice text & source dynamically based on current language
  const resolveInnerVoice = (): { text: string; source: string } => {
    const a1 = v2_2_3.asset1;
    const dossiers = v2_2_3.asset2_dossiers;

    switch (voiceState.kind) {
      case 'wakeup':
        return {
          text: a1.wakeUpInnerVoice,
          source: lang === 'zh' ? '班前开机' : 'TERMINAL ONLINE',
        };
      case 'idle_banter':
        return {
          text: a1.randomIdleBanter[voiceState.index] ?? a1.randomIdleBanter[0],
          source: lang === 'zh' ? '工位随想' : 'IDLE THOUGHT',
        };
      case 'file02_read':
        return {
          text: dossiers.file02.innerVoice,
          source: lang === 'zh' ? '档案 #02' : 'FILE #02',
        };
      case 'redact': {
        if (voiceState.id === 'f1_target1') {
          const item = dossiers.file01.entries.find(
            (e) => e.kind === 'target' && e.data.id === 'f1_target1'
          );
          return {
            text: item && item.kind === 'target' ? item.data.innerVoice : '',
            source: lang === 'zh' ? '涂黑归档 #01' : 'REDACTED #01',
          };
        }
        if (voiceState.id === 'f1_target2') {
          const item = dossiers.file01.entries.find(
            (e) => e.kind === 'target' && e.data.id === 'f1_target2'
          );
          return {
            text: item && item.kind === 'target' ? item.data.innerVoice : '',
            source: lang === 'zh' ? '涂黑归档 #01' : 'REDACTED #01',
          };
        }
        if (voiceState.id === 'f4_target1') {
          return {
            text: dossiers.file04.target1.innerVoice,
            source: lang === 'zh' ? '审计异常 #04' : 'AUDIT FLAG #04',
          };
        }
        if (voiceState.id === 'f5_target1') {
          return {
            text: dossiers.file05.target1.innerVoice,
            source: lang === 'zh' ? '滤镜碎裂 // #05' : 'LENS BROKEN // #05',
          };
        }
        return {
          text: dossiers.file03.stageB.target1.innerVoice,
          source: lang === 'zh' ? '涂黑草稿 #03' : 'REDACTED #03',
        };
      }
      case 'f3_bleed_revealed':
        return {
          text: dossiers.file03.stageB.bleedThrough.innerVoice,
          source: lang === 'zh' ? '墨迹渗出 // 02:14' : 'INK BLEED // 02:14',
        };
      case 'prop': {
        const propItem =
          v2_4_5.asset4_props.find((p) => p.id === voiceState.id) ??
          v2_4_5.asset4_props[0];
        if (voiceState.stage === 3) {
          const lines = propItem.phase3_disco.subtitleLines;
          return {
            text: lines[voiceState.lineIndex % lines.length],
            source: propItem.phase3_disco.corruptedSourceTag,
          };
        }
        if (voiceState.stage === 2) {
          return {
            text: propItem.phase2_doubt.subtitle,
            source: propItem.title,
          };
        }
        const lines = propItem.phase1_routine.subtitleLines;
        return {
          text: lines[voiceState.lineIndex % lines.length],
          source: propItem.title,
        };
      }
      case 'resign': {
        const pool =
          voiceState.stage === 0
            ? v2_4_5.asset5_resignation.stage0_mundane
            : voiceState.stage === 1
            ? v2_4_5.asset5_resignation.stage1_deflection
            : v2_4_5.asset5_resignation.stage2_viscous;
        return {
          text: pool[voiceState.index] ?? pool[0],
          source: lang === 'zh' ? '离职尝试' : 'RESIGNATION ATTEMPT',
        };
      }
      case 'longpress_stage':
        return {
          text: v2_4_5.asset5_resignation.longPressStages[voiceState.stage],
          source: lang === 'zh' ? '注销终端阻力' : 'TERMINATION LOCK',
        };
      case 'rejected':
        return {
          text: v2_4_5.asset5_resignation.protagonistRealization,
          source: lang === 'zh' ? 'ERR_CABINET_LOCK' : 'ERR_CABINET_LOCK',
        };
      case 'endingA_step': {
        const found = v2_4_5.asset6_endings.endingA.activeRedactionLines.find(
          (l) => l.id === voiceState.id
        );
        return {
          text: found?.onRedactSubtitle ?? '',
          source: lang === 'zh' ? '协议 A // 规范化修复' : 'PROTOCOL A // CONTAIN',
        };
      }
      case 'endingA_final':
        return {
          text: v2_4_5.asset6_endings.endingA.finalSubtitle,
          source: lang === 'zh' ? 'DAY 1,096 // 档案员 #302' : 'DAY 1,096 // #302',
        };
      case 'endingB_final':
        return {
          text: v2_4_5.asset6_endings.endingB.finalSubtitle,
          source: lang === 'zh' ? 'CABINET_03_MERGER' : 'CABINET_03_MERGER',
        };
    }
  };

  const { text: innerVoiceText, source: innerVoiceSource } = resolveInnerVoice();

  // 1. Login from Act I Opening Hook Modal
  const handleLogin = () => {
    bumpInteraction();
    setGameState((prev) => ({
      ...prev,
      hasLoggedIn: true,
    }));
    setVoiceState({ kind: 'wakeup' });
  };

  // 2. Focus / Pick-Up Selection Handler on 3D Desk
  const handleSelectFocus = (target: FocusTarget) => {
    bumpInteraction();
    setFocusTarget(target);

    if (target !== 'none') {
      soundEngine.playPaperRustle();
    }

    if (target === 'manual') {
      setGameState((prev) =>
        prev.hasReadManual ? prev : { ...prev, hasReadManual: true }
      );
      return;
    }

    if (target === 'file02') {
      setGameState((prev) =>
        prev.hasReadFile02 ? prev : { ...prev, hasReadFile02: true }
      );
      if (!isEffectiveLensBroken) {
        setVoiceState({ kind: 'file02_read' });
      }
      return;
    }

    if (target === 'compare') {
      setGameState((prev) =>
        prev.hasReadFile02 ? prev : { ...prev, hasReadFile02: true }
      );
      return;
    }

    if (
      target === 'prop_lunchbox' ||
      target === 'prop_mug' ||
      target === 'partition' ||
      target === 'polaroid'
    ) {
      const propId: V2PropId = target === 'partition' ? 'prop_glass' : target;
      const currentCount = propClickCounts[propId] ?? 0;

      setPropClickCounts((prev) => ({
        ...prev,
        [propId]: currentCount + 1,
      }));

      // UI Anomaly 2: Brief half-beat lag refresh in Phase 2 Doubt
      if (isPhase2Doubt) {
        setSubtitleLagging(true);
        window.setTimeout(() => setSubtitleLagging(false), 180);
      }

      const stage: 1 | 2 | 3 = isEffectiveLensBroken
        ? 3
        : isPhase2Doubt
        ? 2
        : 1;

      setGameState((prev) => {
        const nextInspected = prev.inspectedProps.includes(propId)
          ? prev.inspectedProps
          : [...prev.inspectedProps, propId];

        const nextPhase2 =
          stage === 2 && !prev.phase2PropsInspected.includes(propId)
            ? [...prev.phase2PropsInspected, propId]
            : prev.phase2PropsInspected;

        const nextPhase3 =
          stage === 3 && !prev.phase3PropsInspected.includes(propId)
            ? [...prev.phase3PropsInspected, propId]
            : prev.phase3PropsInspected;

        return {
          ...prev,
          inspectedProps: nextInspected,
          phase2PropsInspected: nextPhase2,
          phase3PropsInspected: nextPhase3,
          file03Target1Unlocked:
            prev.file03Target1Unlocked || nextPhase2.length >= 2,
          phase4LongPressUnlocked:
            prev.phase4LongPressUnlocked || nextPhase3.length >= 3,
        };
      });

      setVoiceState({
        kind: 'prop',
        id: propId,
        stage,
        lineIndex: currentCount,
      });
    }
  };

  // 3. Idempotent Redaction & 4-Phase Causal Lock Trigger Handler
  const handleRedact = (targetId: RedactTargetId) => {
    bumpInteraction();
    if (gameState.redactedTargets.includes(targetId)) {
      return;
    }

    // Phase 2 Lock on #03 end line: requires #04 flagged + >=2 props inspected
    if (targetId === 'f3_target1') {
      if (!gameState.file03Target1Unlocked || f3BleedPending) return;

      soundEngine.playStamp();
      soundEngine.playInkBleed();
      setF3BleedPending(true);
      setVoiceState({ kind: 'redact', id: 'f3_target1' });

      // 1.2s delayed ink bleed -> reveal CCTV_SectorB.png & deliver #05
      bleedTimeoutRef.current = window.setTimeout(() => {
        setF3BleedPending(false);
        soundEngine.playDossierDeliver();
        setGameState((prev) => ({
          ...prev,
          redactedTargets: prev.redactedTargets.includes('f3_target1')
            ? prev.redactedTargets
            : [...prev.redactedTargets, 'f3_target1'],
          f3BleedRevealed: true,
          file05Delivered: true,
        }));
        setVoiceState({ kind: 'f3_bleed_revealed' });
      }, 1200);
      return;
    }

    // Phase 3 Trigger on #05: lensBroken = true!
    if (targetId === 'f5_target1') {
      soundEngine.playLensBreak();
      setGameState((prev) => ({
        ...prev,
        redactedTargets: [...prev.redactedTargets, 'f5_target1'],
        lensBroken: true,
      }));
      setVoiceState({ kind: 'redact', id: 'f5_target1' });
      return;
    }

    // Normal redaction (#01 targets or #04 audit flag)
    soundEngine.playStamp();
    const updatedTargets: RedactTargetId[] = [
      ...gameState.redactedTargets,
      targetId,
    ];
    const bothFile01Done =
      updatedTargets.includes('f1_target1') &&
      updatedTargets.includes('f1_target2');

    if (bothFile01Done && !gameState.file04Delivered) {
      soundEngine.playDossierDeliver();
    }

    setGameState((prev) => ({
      ...prev,
      redactedTargets: updatedTargets,
      file03Decrypted: prev.file03Decrypted || bothFile01Done,
      file04Delivered: prev.file04Delivered || bothFile01Done,
    }));

    setVoiceState({ kind: 'redact', id: targetId });
  };

  // 4. Pre-Broken Resignation Button Handler (Stage 0/1/2 Random Excuses)
  const handleResignationClick = () => {
    bumpInteraction();
    const stage = Math.min(2, quotaCount) as 0 | 1 | 2;
    const pool =
      stage === 0
        ? v2_4_5.asset5_resignation.stage0_mundane
        : stage === 1
        ? v2_4_5.asset5_resignation.stage1_deflection
        : v2_4_5.asset5_resignation.stage2_viscous;

    const candidateIndices = pool
      .map((_, idx) => idx)
      .filter((idx) => idx !== gameState.lastResignQuoteIndex);
    const chosenIndex =
      candidateIndices[Math.floor(Math.random() * candidateIndices.length)] ??
      0;

    soundEngine.playKeyClick();
    setGameState((prev) => ({
      ...prev,
      lastResignQuoteIndex: chosenIndex,
    }));
    setVoiceState({ kind: 'resign', stage, index: chosenIndex });
    setResignPopup({ stage, index: chosenIndex });
  };

  // 5. Phase 4 Long-Press Resignation Completion
  const handleLongPressStageHint = (
    stage: 'pct25' | 'pct55' | 'pct75_rebound'
  ) => {
    bumpInteraction();
    setVoiceState({ kind: 'longpress_stage', stage });
  };

  const handleCompleteLongPressResign = () => {
    bumpInteraction();
    setGameState((prev) => ({
      ...prev,
      resignationRejected: true,
    }));
    setVoiceState({ kind: 'rejected' });
  };

  // 6. Proceed to Act IV Final Archive Protocol
  const handleProceedToFinalProtocol = () => {
    bumpInteraction();
    setShowAct3ReviewModal(false);
    setFocusTarget('none');
    setGameState((prev) => ({
      ...prev,
      showFinalDecisionModal: true,
    }));
  };

  // 7. Select Ending Branch
  const handleSelectBranch = (branch: 'A' | 'B' | null) => {
    bumpInteraction();
    setGameState((prev) => ({
      ...prev,
      endingChoice: branch,
      endingARedacted: branch === 'A' ? prev.endingARedacted : [],
    }));
    if (branch === 'B') {
      setVoiceState({ kind: 'endingB_final' });
    }
  };

  // 8. Redact Ending A Truth Lines (Extinguishes Magenta -> Cyan -> Amber)
  const handleRedactEndingA = (id: EndingARedactId) => {
    bumpInteraction();
    if (gameState.endingARedacted.includes(id)) return;
    const nextRedacted = [...gameState.endingARedacted, id];
    setGameState((prev) => ({
      ...prev,
      endingARedacted: nextRedacted,
    }));
    if (nextRedacted.length === 3) {
      setVoiceState({ kind: 'endingA_final' });
    } else {
      setVoiceState({ kind: 'endingA_step', id });
    }
  };

  // 9. Reset Game to Day 1 Loop
  const handleResetGame = () => {
    if (bleedTimeoutRef.current !== null) {
      window.clearTimeout(bleedTimeoutRef.current);
      bleedTimeoutRef.current = null;
    }
    setGameState(INITIAL_GAME_STATE);
    setFocusTarget('none');
    setF3BleedPending(false);
    setVoiceState({ kind: 'wakeup' });
    setResignPopup(null);
    setShowAct3ReviewModal(false);
    setPropClickCounts({
      prop_glass: 0,
      prop_lunchbox: 0,
      prop_mug: 0,
      polaroid: 0,
    });
  };

  const activeResignQuote = resignPopup
    ? (resignPopup.stage === 0
        ? v2_4_5.asset5_resignation.stage0_mundane
        : resignPopup.stage === 1
        ? v2_4_5.asset5_resignation.stage1_deflection
        : v2_4_5.asset5_resignation.stage2_viscous)[resignPopup.index]
    : null;

  return (
    <div
      className={`game-3d-root ${
        isEffectiveLensBroken ? 'theme-crimson-broken' : 'theme-sepia-archival'
      }`}
    >
      {/* Subtle 3% Film Grain & Soft Edge Vignette */}
      <div className="archival-grain-overlay" aria-hidden="true" />

      {/* Dimmed Backdrop when Holding a 3D Prop in Front of Camera */}
      {(focusTarget === 'prop_lunchbox' ||
        focusTarget === 'prop_mug' ||
        focusTarget === 'polaroid') && (
        <div
          className="prop-inspect-vignette"
          onClick={() => handleSelectFocus('none')}
          onContextMenu={(e) => {
            e.preventDefault();
            handleSelectFocus('none');
          }}
        />
      )}

      {/* Fullscreen First-Person 3D Low-Poly Office Desk Scene */}
      <DeskScene
        lang={lang}
        focusTarget={focusTarget}
        quotaCount={quotaCount}
        redactedTargets={gameState.redactedTargets}
        file03Decrypted={gameState.file03Decrypted}
        file04Delivered={gameState.file04Delivered}
        file05Delivered={gameState.file05Delivered}
        lensBroken={isEffectiveLensBroken}
        endingChoice={gameState.endingChoice}
        endingARedactedCount={
          gameState.endingChoice === 'A' ? gameState.endingARedacted.length : 0
        }
        onSelectFocus={handleSelectFocus}
      />

      {/* Diegetic Paper Document / Booklet / Monitor Screen Overlay */}
      <DocumentInspector
        lang={lang}
        focusTarget={focusTarget}
        quotaCount={quotaCount}
        redactedTargets={gameState.redactedTargets}
        file03Decrypted={gameState.file03Decrypted}
        file04Delivered={gameState.file04Delivered}
        file05Delivered={gameState.file05Delivered}
        file03Target1Unlocked={gameState.file03Target1Unlocked}
        phase2PropsCount={gameState.phase2PropsInspected.length}
        phase3PropsCount={gameState.phase3PropsInspected.length}
        f3BleedPending={f3BleedPending}
        f3BleedRevealed={gameState.f3BleedRevealed}
        lensBroken={isEffectiveLensBroken}
        phase4LongPressUnlocked={gameState.phase4LongPressUnlocked}
        resignationRejected={gameState.resignationRejected}
        endingARedactedCount={
          gameState.endingChoice === 'A' ? gameState.endingARedacted.length : 0
        }
        onSelectFocus={handleSelectFocus}
        onRedact={handleRedact}
        onResignationClick={handleResignationClick}
        onLongPressStageHint={handleLongPressStageHint}
        onCompleteLongPressResign={handleCompleteLongPressResign}
        onOpenAct3Review={() => setShowAct3ReviewModal(true)}
        onProceedToFinalProtocol={handleProceedToFinalProtocol}
      />

      {/* The ONLY Persistent 2D HUD: Bottom Frameless Subtitle Bar + Top-Right Lang/Exit */}
      <SubtitleHUD
        lang={lang}
        focusTarget={focusTarget}
        quotaCount={quotaCount}
        file03Decrypted={gameState.file03Decrypted}
        file04Delivered={gameState.file04Delivered}
        file05Delivered={gameState.file05Delivered}
        lensBroken={isEffectiveLensBroken}
        resignationRejected={gameState.resignationRejected}
        endingARedactedCount={
          gameState.endingChoice === 'A' ? gameState.endingARedacted.length : 0
        }
        innerVoice={innerVoiceText}
        innerVoiceSource={innerVoiceSource}
        subtitleLagging={subtitleLagging}
        onToggleLang={toggleLanguage}
        onExitFocus={() => handleSelectFocus('none')}
        onOpenAct3Review={() => setShowAct3ReviewModal(true)}
        onProceedToFinalProtocol={handleProceedToFinalProtocol}
      />

      {/* Act I Opening 5-Second Grounding Hook Modal */}
      {!gameState.hasLoggedIn && (
        <OpeningModal
          lang={lang}
          onToggleLang={toggleLanguage}
          onLogin={handleLogin}
        />
      )}

      {/* Stage 0/1/2 Resignation Monologue Popup */}
      {resignPopup && activeResignQuote && (
        <div
          className="modal-backdrop small-popup-backdrop"
          onClick={() => setResignPopup(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="small-popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="small-popup-header">
              <span>{ui.resignPopupTitle}</span>
              <span className="popup-stage-tag">
                {ui.resignPopupStageLabel(resignPopup.stage)}
              </span>
            </div>
            <div className="small-popup-body">
              <blockquote className="popup-monologue-text">
                {activeResignQuote}
              </blockquote>
            </div>
            <div className="small-popup-footer">
              <button
                type="button"
                className="btn-terminal-primary"
                onClick={() => setResignPopup(null)}
              >
                {ui.returnToWorkstationBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Act III Mandatory Retrospective Review Modal */}
      {showAct3ReviewModal && (
        <Act3ReviewModal
          lang={lang}
          resignationRejected={gameState.resignationRejected}
          onMinimizeToInspectDesk={() => setShowAct3ReviewModal(false)}
          onProceedToFinalProtocol={handleProceedToFinalProtocol}
        />
      )}

      {/* Act IV Final Archive Protocol & Dual-Ending Mirror Loop Modal */}
      {gameState.showFinalDecisionModal && (
        <Act4EndingModal
          lang={lang}
          endingChoice={gameState.endingChoice}
          endingARedacted={gameState.endingARedacted}
          onSelectBranch={handleSelectBranch}
          onRedactEndingA={handleRedactEndingA}
          onCloseToDesk={() =>
            setGameState((prev) => ({
              ...prev,
              showFinalDecisionModal: false,
            }))
          }
          onResetGame={handleResetGame}
        />
      )}
    </div>
  );
};

export default App;
