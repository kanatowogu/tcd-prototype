import React, { useEffect, useRef, useState } from 'react';
import { getNarrativeBundle } from '../data/narrativeAssets';
import { FocusTarget, Language, RedactTargetId } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { EvidenceArtwork } from './EvidenceArtwork';

interface DocumentInspectorProps {
  lang: Language;
  focusTarget: FocusTarget;
  quotaCount: number;
  redactedTargets: RedactTargetId[];
  file03Decrypted: boolean;
  file04Delivered: boolean;
  file05Delivered: boolean;
  file03Target1Unlocked: boolean;
  phase2PropsCount: number;
  phase3PropsCount: number;
  f3BleedPending: boolean;
  f3BleedRevealed: boolean;
  lensBroken: boolean;
  phase4LongPressUnlocked: boolean;
  resignationRejected: boolean;
  endingARedactedCount: number;
  onSelectFocus: (target: FocusTarget) => void;
  onRedact: (targetId: RedactTargetId) => void;
  onResignationClick: () => void;
  onLongPressStageHint: (stage: 'pct25' | 'pct55' | 'pct75_rebound') => void;
  onCompleteLongPressResign: () => void;
  onOpenAct3Review: () => void;
  onProceedToFinalProtocol: () => void;
}

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({
  lang,
  focusTarget,
  quotaCount,
  redactedTargets,
  file03Decrypted,
  file04Delivered,
  file05Delivered,
  file03Target1Unlocked,
  phase2PropsCount,
  phase3PropsCount,
  f3BleedPending,
  f3BleedRevealed,
  lensBroken,
  phase4LongPressUnlocked,
  resignationRejected,
  endingARedactedCount,
  onSelectFocus,
  onRedact,
  onResignationClick,
  onLongPressStageHint,
  onCompleteLongPressResign,
  onOpenAct3Review,
  onProceedToFinalProtocol,
}) => {
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [compareDateFlicker, setCompareDateFlicker] = useState(false);
  const [stampMisprintFlash, setStampMisprintFlash] = useState(false);

  // Long-press state for Phase 4 resignation
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasRebounded, setHasRebounded] = useState(false);
  const [reboundShaking, setReboundShaking] = useState(false);
  const [holdStageLabel, setHoldStageLabel] = useState<string | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const holdProgressRef = useRef(0);
  const hasReboundedRef = useRef(false);
  const lastStageEmittedRef = useRef<string | null>(null);

  const { ui, v2_2_3, v2_4_5 } = getNarrativeBundle(lang);
  const { asset1, asset2_dossiers } = v2_2_3;
  const { asset5_resignation } = v2_4_5;

  const isF1T1Redacted = redactedTargets.includes('f1_target1');
  const isF1T2Redacted = redactedTargets.includes('f1_target2');
  const isF3T1Redacted = redactedTargets.includes('f3_target1');
  const isF4T1Redacted = redactedTargets.includes('f4_target1');
  const isF5T1Redacted = redactedTargets.includes('f5_target1');

  // UI Anomaly 1: Brief 1-frame date flicker (11/13 <-> 11/17) when entering Compare View
  useEffect(() => {
    if (focusTarget === 'compare') {
      setCompareDateFlicker(true);
      soundEngine.playGlitch();
      const timer = window.setTimeout(() => setCompareDateFlicker(false), 180);
      return () => window.clearTimeout(timer);
    }
  }, [focusTarget]);

  // UI Anomaly 3: Brief stamp misprint "[DATA ABSORBED]" when clicking f3_target1
  useEffect(() => {
    if (f3BleedPending) {
      setStampMisprintFlash(true);
      const timer = window.setTimeout(() => setStampMisprintFlash(false), 450);
      return () => window.clearTimeout(timer);
    }
  }, [f3BleedPending]);

  // Cleanup long-press interval on unmount or focus change
  useEffect(() => {
    return () => {
      if (holdTimerRef.current !== null) {
        window.clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  const stopLongPress = () => {
    setIsHolding(false);
    setReboundShaking(false);
    if (holdTimerRef.current !== null) {
      window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (holdProgressRef.current < 100) {
      holdProgressRef.current = 0;
      setHoldProgress(0);
      setHoldStageLabel(null);
      hasReboundedRef.current = false;
      setHasRebounded(false);
      lastStageEmittedRef.current = null;
    }
  };

  const startLongPress = () => {
    if (!phase4LongPressUnlocked || resignationRejected) return;
    setIsHolding(true);
    holdProgressRef.current = 0;
    hasReboundedRef.current = false;
    lastStageEmittedRef.current = null;
    setHasRebounded(false);
    setHoldProgress(2);
    setHoldStageLabel(asset5_resignation.longPressStages.pct25);
    onLongPressStageHint('pct25');
    soundEngine.playKeyClick();

    holdTimerRef.current = window.setInterval(() => {
      let next = holdProgressRef.current + 1.65;

      // Physical resistance rebound at 75% (78% -> 62%)
      if (!hasReboundedRef.current && next >= 76) {
        hasReboundedRef.current = true;
        setHasRebounded(true);
        setReboundShaking(true);
        next = 62;
        soundEngine.playLongPressRebound();
        setHoldStageLabel(asset5_resignation.longPressStages.pct75_rebound);
        if (lastStageEmittedRef.current !== 'pct75') {
          lastStageEmittedRef.current = 'pct75';
          onLongPressStageHint('pct75_rebound');
        }
        window.setTimeout(() => setReboundShaking(false), 420);
      } else if (next >= 35 && next < 75 && !hasReboundedRef.current) {
        setHoldStageLabel(asset5_resignation.longPressStages.pct55);
        if (lastStageEmittedRef.current !== 'pct55') {
          lastStageEmittedRef.current = 'pct55';
          onLongPressStageHint('pct55');
        }
      }

      if (next >= 100) {
        holdProgressRef.current = 100;
        setHoldProgress(100);
        setIsHolding(false);
        if (holdTimerRef.current !== null) {
          window.clearInterval(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        soundEngine.playStamp();
        onCompleteLongPressResign();
        return;
      }

      holdProgressRef.current = next;
      setHoldProgress(next);
    }, 50);
  };

  const isPaperHeld =
    focusTarget === 'manual' ||
    focusTarget === 'file01' ||
    focusTarget === 'file02' ||
    focusTarget === 'file03' ||
    focusTarget === 'file04' ||
    focusTarget === 'file05' ||
    focusTarget === 'compare';

  if (!isPaperHeld && focusTarget !== 'monitor') {
    return null;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    setTilt({
      rx: -ny * 6.5,
      ry: nx * 8.5,
    });
  };

  const showCorruptedOperator = lensBroken && endingARedactedCount < 2;

  /* ==========================================================================
     A. MONITOR TERMINAL SCREEN OVERLAY (When Camera Dollies into Monitor)
     ========================================================================== */
  if (focusTarget === 'monitor') {
    return (
      <div
        className="diegetic-overlay-backdrop monitor-dolly-backdrop"
        onClick={() => {
          stopLongPress();
          onSelectFocus('none');
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          stopLongPress();
          onSelectFocus('none');
        }}
      >
        <div
          className={`diegetic-monitor-screen ${
            lensBroken ? 'screen-broken-mode' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="monitor-os-header">
            <span>
              TCD-OS v3.02 //{' '}
              {showCorruptedOperator ? ui.operatorCorrupted : ui.operatorActive}
            </span>
            <span className="os-filter-tag">
              {lensBroken ? ui.filterBroken : ui.filterActive}
            </span>
          </div>

          <div className="monitor-os-body">
            <div className="os-wakeup-line">{asset1.systemWakeUp}</div>

            <div className="os-telemetry-grid">
              <div className="os-telemetry-box">
                <div className="os-box-label">
                  {ui.cognitiveQuotaLabel(quotaCount, lensBroken)}
                </div>
                <div className="os-quota-bars">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`os-quota-seg ${
                        lensBroken || i < quotaCount ? 'seg-active' : ''
                      }`}
                    />
                  ))}
                  {lensBroken && (
                    <span className="os-quota-seg seg-overflow-fourth" />
                  )}
                </div>
              </div>

              <div className="os-telemetry-box">
                <div className="os-box-label">
                  {file03Decrypted ? ui.clearanceSynced : ui.clearanceLocked}
                </div>
                <div className="os-sub-status">
                  {lensBroken
                    ? phase4LongPressUnlocked
                      ? ui.phase3PropsReadyHint
                      : ui.phase3NeedPropsHint(phase3PropsCount)
                    : file03Decrypted
                    ? ui.stageBDecryptedStrip
                    : asset2_dossiers.file03.stageA.systemLock}
                </div>
              </div>
            </div>

            {/* Quick Dossier & Comparison Launchers */}
            <div className="os-dossier-shortcuts">
              <button
                type="button"
                className="btn-os-shortcut"
                onClick={() => onSelectFocus('manual')}
              >
                [ {asset1.manualTitle} ]
              </button>
              <button
                type="button"
                className="btn-os-shortcut"
                onClick={() => onSelectFocus('file01')}
              >
                [ #01 ]
              </button>
              <button
                type="button"
                className="btn-os-shortcut"
                onClick={() => onSelectFocus('file02')}
              >
                [ #02 ]
              </button>
              <button
                type="button"
                className="btn-os-shortcut"
                onClick={() => onSelectFocus('compare')}
              >
                [ {ui.compareTabLabel} ]
              </button>
              {file04Delivered && (
                <button
                  type="button"
                  className="btn-os-shortcut shortcut-new"
                  onClick={() => onSelectFocus('file04')}
                >
                  [ #04 ]
                </button>
              )}
              {file05Delivered && (
                <button
                  type="button"
                  className="btn-os-shortcut shortcut-crimson"
                  onClick={() => onSelectFocus('file05')}
                >
                  [ #05 ]
                </button>
              )}
            </div>

            {/* Resignation Control: Pre-Broken Click vs. Phase 4 Long-Press Hold */}
            {!lensBroken ? (
              <div className="os-resign-section">
                <button
                  type="button"
                  className="btn-os-resign"
                  onClick={onResignationClick}
                >
                  {ui.resignBtnLocked(quotaCount)}
                </button>
                <div className="os-resign-hint">
                  {file05Delivered
                    ? ui.bottomHintPhase2Audit
                    : ui.bottomHintIncomplete(Math.max(0, 3 - quotaCount))}
                </div>
              </div>
            ) : !phase4LongPressUnlocked ? (
              <div className="os-resign-section">
                <button
                  type="button"
                  className="btn-os-resign os-resign-disabled"
                  disabled
                >
                  {asset5_resignation.longPressButtonIdle}
                </button>
                <div className="os-resign-hint">
                  {ui.phase3NeedPropsHint(phase3PropsCount)}
                </div>
                <div className="os-act3-emergency-box">
                  <button
                    type="button"
                    className="btn-os-review"
                    onClick={onOpenAct3Review}
                  >
                    {ui.reopenAct3ReviewBtn}
                  </button>
                </div>
              </div>
            ) : !resignationRejected ? (
              <div className="os-resign-section">
                <div
                  className={`longpress-hold-wrapper ${
                    reboundShaking ? 'hold-tremble' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="btn-os-resign btn-longpress-active"
                    onPointerDown={startLongPress}
                    onPointerUp={stopLongPress}
                    onPointerLeave={stopLongPress}
                    onPointerCancel={stopLongPress}
                  >
                    <div
                      className="longpress-fill-bar"
                      style={{ width: `${holdProgress}%` }}
                    />
                    <span className="longpress-btn-text">
                      {reboundShaking
                        ? ui.stayOnDutyLabel
                        : isHolding
                        ? `${ui.holdingLabel} (${Math.round(holdProgress)}%)`
                        : asset5_resignation.longPressButtonIdle}
                    </span>
                  </button>
                </div>
                <div className="os-resign-hint hold-stage-caption">
                  {holdStageLabel ?? ui.bottomHintPhase3Ready}
                </div>
              </div>
            ) : (
              <div className="os-rejection-panel">
                <div className="os-rejection-code">
                  {asset5_resignation.systemRejection}
                </div>
                <p className="os-rejection-voice">
                  {asset5_resignation.protagonistRealization}
                </p>
                <div className="os-act3-emergency-box">
                  <button
                    type="button"
                    className="btn-os-review"
                    onClick={onOpenAct3Review}
                  >
                    {ui.reopenAct3ReviewBtn}
                  </button>
                  <button
                    type="button"
                    className="btn-os-final-protocol"
                    onClick={onProceedToFinalProtocol}
                  >
                    {asset5_resignation.proceedToFinalButton}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     B. HELD PHYSICAL PAPER / BOOKLET INSPECTOR (With ±15° Mouse Parallax)
     ========================================================================== */
  const renderFile01Paper = () => {
    const f1 = asset2_dossiers.file01;
    return (
      <article className="typewriter-paper-sheet">
        <header className="paper-header-stamp">
          <div className="paper-folder-num">#01</div>
          <div className="paper-meta-lines">
            <div className="paper-doc-title">{f1.title}</div>
            <div className="paper-doc-meta">{f1.metadata}</div>
          </div>
        </header>

        {lensBroken && (
          <div className="paper-retrospective-burn">
            <div className="burn-title">{ui.retrospectiveHeader}</div>
            <div className="burn-meta">{f1.alteredRetrospective.metadata}</div>
            {f1.alteredRetrospective.recoveredLines.map((line, i) => (
              <p key={i} className="burn-recovered">
                {line}
              </p>
            ))}
            <p className="burn-note">{f1.alteredRetrospective.systemNote}</p>
          </div>
        )}

        <div className="paper-preamble">{f1.preamble}</div>

        <div className="paper-typewriter-body">
          {f1.entries.map((entry) => {
            if (entry.kind === 'normal') {
              return (
                <p key={entry.id} className="typewriter-paragraph">
                  {entry.text}
                </p>
              );
            }
            const target = entry.data;
            const isRedacted = redactedTargets.includes(target.id);
            return (
              <div
                key={target.id}
                className={`paper-redact-line ${
                  isRedacted ? 'line-is-blacked' : 'line-can-redact'
                }`}
                onClick={() => {
                  if (!isRedacted) onRedact(target.id);
                }}
                role="button"
                tabIndex={isRedacted ? -1 : 0}
              >
                <div className="paper-violation-margin">
                  <span>{target.violationTag}</span>
                  {!isRedacted && (
                    <span className="margin-action">
                      {ui.clickToRedactViolation}
                    </span>
                  )}
                </div>
                <div className="paper-sentence-wrap">
                  <p className="typewriter-paragraph">{target.text}</p>
                  {isRedacted && <div className="charcoal-ink-stroke" />}
                </div>
              </div>
            );
          })}
        </div>

        <footer className="paper-bottom-stamp-area">
          {(isF1T1Redacted || isF1T2Redacted) && (
            <div
              className={`physical-rubber-stamp ${
                lensBroken ? 'stamp-peeled-crimson' : ''
              }`}
            >
              {lensBroken ? ui.stampPhysicallyStapled : ui.stampNormalized} (
              {(isF1T1Redacted ? 1 : 0) + (isF1T2Redacted ? 1 : 0)}/2)
            </div>
          )}
        </footer>
      </article>
    );
  };

  const renderFile02Paper = () => {
    const f2 = asset2_dossiers.file02;
    const displayMetadata = compareDateFlicker
      ? f2.metadata.replace('11月13日', '11月17日').replace('NOV 13', 'NOV 17')
      : f2.metadata;

    return (
      <article className="typewriter-paper-sheet">
        <header className="paper-header-stamp">
          <div className="paper-folder-num">#02</div>
          <div className="paper-meta-lines">
            <div className="paper-doc-title">{f2.title}</div>
            <div
              className={`paper-doc-meta ${
                compareDateFlicker ? 'meta-flicker-glitch' : ''
              }`}
            >
              {displayMetadata}
            </div>
          </div>
        </header>

        <div className="paper-preamble">{f2.memoHeader}</div>

        <div className="paper-typewriter-body paper-compact-list">
          {f2.sections.map((sec, idx) => (
            <p key={idx} className="typewriter-paragraph">
              {sec}
            </p>
          ))}
        </div>

        <footer className="paper-bottom-stamp-area">
          {focusTarget !== 'compare' && (
            <button
              type="button"
              className="btn-paper-compare"
              onClick={() => onSelectFocus('compare')}
            >
              {ui.openCompareInlineBtn}
            </button>
          )}
          <div className="physical-rubber-stamp stamp-verified">
            INTERNAL MEMO
          </div>
        </footer>
      </article>
    );
  };

  const renderFile03Paper = () => {
    const f3 = asset2_dossiers.file03;
    if (!file03Decrypted) {
      return (
        <article className="typewriter-paper-sheet paper-garbled">
          <header className="paper-header-stamp">
            <div className="paper-folder-num">#03</div>
            <div className="paper-meta-lines">
              <div className="paper-doc-title">{f3.title}</div>
              <div className="paper-doc-meta">{f3.stageA.metadata}</div>
            </div>
          </header>

          <div className="paper-typewriter-body">
            {f3.stageA.paragraphs.map((para, idx) => (
              <p key={idx} className="typewriter-paragraph garbled-ink">
                {para}
              </p>
            ))}

            <div className="paper-lock-notice">
              <p>{f3.stageA.systemLock}</p>
              <button
                type="button"
                className="btn-paper-compare"
                onClick={() => onSelectFocus('file01')}
              >
                {ui.goToFile01Btn}
              </button>
            </div>
          </div>
        </article>
      );
    }

    const f3Target = f3.stageB.target1;

    return (
      <article
        className={`typewriter-paper-sheet paper-contaminated ${
          focusTarget === 'compare' ? 'paper-tight-leading' : ''
        }`}
      >
        <header className="paper-header-stamp">
          <div className="paper-folder-num">#03</div>
          <div className="paper-meta-lines">
            <div className="paper-doc-title">{f3.title}</div>
            <div className="paper-doc-meta">{f3.stageB.metadata}</div>
          </div>
        </header>

        <div className="paper-typewriter-body">
          {f3.stageB.paragraphs.map((para, idx) => (
            <p key={idx} className="typewriter-paragraph">
              {para}
            </p>
          ))}

          {/* Target f3_target1: Locked until #04 discrepancy flagged & >=2 desk props inspected */}
          {!file03Target1Unlocked ? (
            <div className="paper-lock-notice">
              <p>{ui.phase2NeedPropsLock(phase2PropsCount)}</p>
              {file04Delivered && !isF4T1Redacted && (
                <button
                  type="button"
                  className="btn-paper-compare"
                  onClick={() => onSelectFocus('file04')}
                >
                  {ui.goToFile04Btn}
                </button>
              )}
            </div>
          ) : (
            <div
              className={`paper-redact-line ${
                isF3T1Redacted || f3BleedPending
                  ? 'line-is-bleeding'
                  : 'line-can-redact'
              }`}
              onClick={() => {
                if (!isF3T1Redacted && !f3BleedPending) {
                  onRedact('f3_target1');
                }
              }}
              role="button"
              tabIndex={isF3T1Redacted || f3BleedPending ? -1 : 0}
            >
              <div className="paper-violation-margin">
                <span>{f3Target.violationTag}</span>
                {!isF3T1Redacted && !f3BleedPending && (
                  <span className="margin-action">
                    {ui.clickToRedactViolation}
                  </span>
                )}
              </div>
              <div className="paper-sentence-wrap">
                <p className="typewriter-paragraph">{f3Target.text}</p>
                {(isF3T1Redacted || f3BleedPending) && (
                  <div className="ink-bleed-bar ink-bleed-1200ms">
                    <span className="ink-drip drip-1" />
                    <span className="ink-drip drip-2" />
                    <span className="ink-drip drip-3" />
                    <span className="ink-drip drip-4" />
                    <span className="ink-drip drip-5" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delayed 1.2s Ink Bleed-Through Reveal & CCTV Snapshot Clipping */}
          {f3BleedRevealed && (
            <div className="paper-bleed-reveal">
              <div className="bleed-through-header">
                {f3.stageB.bleedThrough.header}
              </div>
              <div className="bleed-evidence-box">
                <EvidenceArtwork
                  type="CCTV_SectorB"
                  lang={lang}
                  caption={f3.stageB.bleedThrough.caption}
                />
              </div>
            </div>
          )}
        </div>

        <footer className="paper-bottom-stamp-area">
          {(f3BleedPending || f3BleedRevealed) && (
            <div
              className={`physical-rubber-stamp ${
                stampMisprintFlash ? 'stamp-crimson' : ''
              }`}
            >
              {stampMisprintFlash
                ? ui.stampDataAbsorbed
                : `${ui.stampNormalized} // ${ui.stampInkOverflow}`}
            </div>
          )}
        </footer>
      </article>
    );
  };

  const renderFile04Paper = () => {
    const f4 = asset2_dossiers.file04;
    return (
      <article className="typewriter-paper-sheet paper-scanline-glitch">
        <header className="paper-header-stamp">
          <div className="paper-folder-num">#04</div>
          <div className="paper-meta-lines">
            <div className="paper-doc-title">{f4.title}</div>
            <div className="paper-doc-meta">{f4.metadata}</div>
          </div>
        </header>

        <div className="paper-preamble">{f4.intro}</div>

        <div className="paper-typewriter-body paper-compact-list">
          {f4.rows.map((row, idx) => (
            <p key={idx} className="typewriter-paragraph audit-table-row">
              {row}
            </p>
          ))}

          {/* Target f4_target1 */}
          <div
            className={`paper-redact-line ${
              isF4T1Redacted ? 'line-is-blacked' : 'line-can-redact'
            }`}
            onClick={() => {
              if (!isF4T1Redacted) onRedact('f4_target1');
            }}
            role="button"
            tabIndex={isF4T1Redacted ? -1 : 0}
          >
            <div className="paper-violation-margin">
              <span>{f4.target1.violationTag}</span>
              {!isF4T1Redacted && (
                <span className="margin-action">
                  {ui.clickToFlagDiscrepancy}
                </span>
              )}
            </div>
            <div className="paper-sentence-wrap">
              <p className="typewriter-paragraph">{f4.target1.text}</p>
              {isF4T1Redacted && <div className="charcoal-ink-stroke" />}
            </div>
          </div>

          <div
            className={`audit-signpost-box ${
              isF4T1Redacted ? 'signpost-active' : ''
            }`}
          >
            {f4.signpostHint}
          </div>
        </div>

        <footer className="paper-bottom-stamp-area">
          {isF4T1Redacted && (
            <div className="physical-rubber-stamp">
              AUDIT FLAGGED ({phase2PropsCount}/2)
            </div>
          )}
        </footer>
      </article>
    );
  };

  const renderFile05Paper = () => {
    const f5 = asset2_dossiers.file05;
    return (
      <article className="typewriter-paper-sheet paper-decom-ledger">
        <header className="paper-header-stamp">
          <div className="paper-folder-num">#05</div>
          <div className="paper-meta-lines">
            <div className="paper-doc-title">{f5.title}</div>
            <div className="paper-doc-meta">{f5.metadata}</div>
          </div>
        </header>

        <div className="paper-typewriter-body">
          {f5.paragraphs.map((para, idx) => (
            <p key={idx} className="typewriter-paragraph">
              {para}
            </p>
          ))}

          {/* Target f5_target1: Triggers lensBroken === true */}
          <div
            className={`paper-redact-line ${
              isF5T1Redacted ? 'line-is-blacked' : 'line-can-redact'
            }`}
            onClick={() => {
              if (!isF5T1Redacted) onRedact('f5_target1');
            }}
            role="button"
            tabIndex={isF5T1Redacted ? -1 : 0}
          >
            <div className="paper-violation-margin">
              <span>{f5.target1.violationTag}</span>
              {!isF5T1Redacted && (
                <span className="margin-action">{ui.clickToConfirmClear}</span>
              )}
            </div>
            <div className="paper-sentence-wrap">
              <p className="typewriter-paragraph">{f5.target1.text}</p>
              {isF5T1Redacted && <div className="charcoal-ink-stroke" />}
            </div>
          </div>
        </div>

        <footer className="paper-bottom-stamp-area">
          {isF5T1Redacted && (
            <div className="physical-rubber-stamp stamp-crimson">
              SECTOR B // SEALED 1,095 DAYS
            </div>
          )}
        </footer>
      </article>
    );
  };

  const renderManualBooklet = () => (
    <article className="typewriter-paper-sheet manual-booklet-spread">
      <header className="paper-header-stamp">
        <div className="paper-folder-num">TCD</div>
        <div className="paper-meta-lines">
          <div className="paper-doc-title">{asset1.manualTitle}</div>
          <div className="paper-doc-meta">{asset1.manualSubtitle}</div>
        </div>
      </header>

      <div className="paper-preamble">{asset1.manualPreface}</div>

      <div className="paper-typewriter-body manual-rules-spread">
        {asset1.rules.map((rule) => (
          <div key={rule.id} className="manual-printed-rule">
            <h4 className="printed-rule-heading">
              {rule.id} — {rule.title}
            </h4>
            <p className="typewriter-paragraph">{rule.text}</p>

            {lensBroken && (
              <div className="manual-ballpoint-note">
                <span className="ballpoint-tag">{ui.manualLateNoteHeader}</span>
                <span>{rule.lateAnnotation}</span>
              </div>
            )}
          </div>
        ))}

        <div className="manual-appendix-block">
          {asset1.manualAppendixTips.map((tip, i) => (
            <p key={i} className="manual-appendix-line">
              {tip}
            </p>
          ))}
        </div>

        <p className="manual-footer-quote">{asset1.manualFooterNote}</p>
      </div>

      <footer className="paper-bottom-stamp-area">
        <div className="physical-rubber-stamp">TCD REV. 4</div>
      </footer>
    </article>
  );

  return (
    <div
      className="diegetic-overlay-backdrop"
      onMouseMove={handleMouseMove}
      onClick={() => onSelectFocus('none')}
      onContextMenu={(e) => {
        e.preventDefault();
        onSelectFocus('none');
      }}
    >
      <div
        className={`held-document-rig ${
          focusTarget === 'compare' ? 'rig-wide-compare' : ''
        }`}
        style={{
          transform: `perspective(1400px) rotateX(${tilt.rx.toFixed(
            2
          )}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Physical Manila Index Tabs along Top Edge */}
        <nav className="physical-index-tabs">
          <button
            type="button"
            className={`index-tab ${focusTarget === 'manual' ? 'tab-held' : ''}`}
            onClick={() => onSelectFocus('manual')}
          >
            {asset1.manualTitle}
          </button>
          <button
            type="button"
            className={`index-tab ${focusTarget === 'file01' ? 'tab-held' : ''}`}
            onClick={() => onSelectFocus('file01')}
          >
            #01 ({(isF1T1Redacted ? 1 : 0) + (isF1T2Redacted ? 1 : 0)}/2)
          </button>
          <button
            type="button"
            className={`index-tab ${focusTarget === 'file02' ? 'tab-held' : ''}`}
            onClick={() => onSelectFocus('file02')}
          >
            #02
          </button>
          <button
            type="button"
            className={`index-tab ${focusTarget === 'file03' ? 'tab-held' : ''}`}
            onClick={() => onSelectFocus('file03')}
          >
            #03 (
            {!file03Decrypted
              ? '0/1'
              : f3BleedRevealed
              ? '1/1'
              : 'STAGE B'}
            )
          </button>
          <button
            type="button"
            className={`index-tab ${focusTarget === 'compare' ? 'tab-held' : ''}`}
            onClick={() => onSelectFocus('compare')}
          >
            #02 vs #03
          </button>
          {file04Delivered && (
            <button
              type="button"
              className={`index-tab ${focusTarget === 'file04' ? 'tab-held' : ''}`}
              onClick={() => onSelectFocus('file04')}
            >
              #04 {isF4T1Redacted ? '✓' : 'NEW'}
            </button>
          )}
          {file05Delivered && (
            <button
              type="button"
              className={`index-tab index-tab-crimson ${
                focusTarget === 'file05' ? 'tab-held' : ''
              }`}
              onClick={() => onSelectFocus('file05')}
            >
              #05 {isF5T1Redacted ? '✓' : 'NEW'}
            </button>
          )}
        </nav>

        {/* Paper Content */}
        <div className="held-paper-scroll-box">
          {focusTarget === 'manual' && renderManualBooklet()}
          {focusTarget === 'file01' && renderFile01Paper()}
          {focusTarget === 'file02' && renderFile02Paper()}
          {focusTarget === 'file03' && renderFile03Paper()}
          {focusTarget === 'file04' && renderFile04Paper()}
          {focusTarget === 'file05' && renderFile05Paper()}
          {focusTarget === 'compare' && (
            <div className="side-by-side-papers">
              {renderFile02Paper()}
              {renderFile03Paper()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
