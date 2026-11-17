import React, { useEffect, useState } from 'react';
import { getNarrativeBundle } from '../data/narrativeAssets';
import { EndingARedactId, Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { EvidenceArtwork } from './EvidenceArtwork';

interface Act4EndingModalProps {
  lang: Language;
  endingChoice: 'A' | 'B' | null;
  endingARedacted: EndingARedactId[];
  onSelectBranch: (branch: 'A' | 'B' | null) => void;
  onRedactEndingA: (id: EndingARedactId) => void;
  onCloseToDesk: () => void;
  onResetGame: () => void;
}

export const Act4EndingModal: React.FC<Act4EndingModalProps> = ({
  lang,
  endingChoice,
  endingARedacted,
  onSelectBranch,
  onRedactEndingA,
  onCloseToDesk,
  onResetGame,
}) => {
  const { ui, v2_4_5 } = getNarrativeBundle(lang);
  const endings = v2_4_5.asset6_endings;
  const allThreeRedacted = endingARedacted.length === 3;
  const filterPercent = Math.round((endingARedacted.length / 3) * 100);

  // Branch B staggered UI peel-off animation state
  const [peelStage, setPeelStage] = useState<number>(0);

  useEffect(() => {
    if (endingChoice === 'B') {
      setPeelStage(0);
      const t1 = window.setTimeout(() => {
        soundEngine.playGlitch();
        setPeelStage(1);
      }, 350);
      const t2 = window.setTimeout(() => {
        soundEngine.playPaperRustle();
        setPeelStage(2);
      }, 900);
      const t3 = window.setTimeout(() => {
        soundEngine.playGlitch();
        setPeelStage(3);
      }, 1500);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.clearTimeout(t3);
      };
    }
  }, [endingChoice]);

  if (endingChoice === null) {
    return (
      <div className="modal-backdrop act4-choice-backdrop" role="dialog" aria-modal="true">
        <div className="act4-choice-card">
          <div className="act4-choice-header">
            <span>{ui.act4ChoiceModalTitle}</span>
            <button
              type="button"
              className="btn-minimize-review"
              onClick={onCloseToDesk}
            >
              {ui.returnToDeskShortBtn}
            </button>
          </div>

          <div className="act4-choice-body">
            <p className="act4-choice-lead">{endings.choiceLead}</p>

            <div className="act4-branches-grid">
              {/* Branch A Option */}
              <div className="branch-option-card branch-a-card">
                <div className="branch-tag">{ui.branchATag}</div>
                <h3 className="branch-title">{endings.endingA.branchName}</h3>
                <p className="branch-desc">{endings.endingA.branchSubtitle}</p>
                <button
                  type="button"
                  className="btn-choose-branch btn-choose-a"
                  onClick={() => {
                    soundEngine.playStamp();
                    onSelectBranch('A');
                  }}
                >
                  {ui.selectBranchABtn}
                </button>
              </div>

              {/* Branch B Option */}
              <div className="branch-option-card branch-b-card">
                <div className="branch-tag">{ui.branchBTag}</div>
                <h3 className="branch-title">{endings.endingB.branchName}</h3>
                <p className="branch-desc">{endings.endingB.branchSubtitle}</p>
                <button
                  type="button"
                  className="btn-choose-branch btn-choose-b"
                  onClick={() => {
                    soundEngine.playGlitch();
                    onSelectBranch('B');
                  }}
                >
                  {ui.selectBranchBBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================================================
     BRANCH A: ACTIVE 3-LINE REDACTION -> MAGENTA / CYAN / AMBER EXTINGUISH
     ========================================================================== */
  if (endingChoice === 'A') {
    const lastRedactedId = endingARedacted[endingARedacted.length - 1];
    const lastCueItem = endings.endingA.activeRedactionLines.find(
      (x) => x.id === lastRedactedId
    );

    return (
      <div
        className={`modal-backdrop act4-ending-a-backdrop restore-stage-${endingARedacted.length}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="ending-a-container">
          <div className="ending-a-header">
            <span>{endings.endingA.branchName}</span>
            <span className="filter-restore-meter">
              {ui.filterRestoreMeter(filterPercent, endingARedacted.length)}
            </span>
          </div>

          <div className="ending-a-body">
            {!allThreeRedacted && (
              <div className="ending-a-instruction">
                {endings.endingA.instruction}
              </div>
            )}

            {lastCueItem && !allThreeRedacted && (
              <div className="ending-a-light-cue-banner">
                <span>{lastCueItem.onRedactLightCue}</span>
              </div>
            )}

            <div className="ending-a-lines-list">
              {endings.endingA.activeRedactionLines.map((item) => {
                const isRedacted = endingARedacted.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`ending-a-redact-row ${
                      isRedacted ? 'row-redacted' : 'row-unredacted'
                    }`}
                    onClick={() => {
                      if (!isRedacted) {
                        soundEngine.playStamp();
                        onRedactEndingA(item.id);
                      }
                    }}
                    role="button"
                    tabIndex={isRedacted ? -1 : 0}
                    onKeyDown={(e) => {
                      if (!isRedacted && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        soundEngine.playStamp();
                        onRedactEndingA(item.id);
                      }
                    }}
                    aria-disabled={isRedacted}
                  >
                    <div className="ending-a-row-top">
                      <span className="record-id-tag">
                        {ui.targetIdPrefix}
                        {item.id}
                      </span>
                      {!isRedacted ? (
                        <span className="click-to-purge-tag">
                          {ui.clickToRedactTruth}
                        </span>
                      ) : (
                        <span className="stamp-normalized">{ui.stampNormalized}</span>
                      )}
                    </div>
                    <div className="ending-a-row-text-wrap">
                      <p className="ending-a-row-text">{item.text}</p>
                      {isRedacted && (
                        <div className="blackout-bar">
                          <span className="stamp-normalized-overlay">
                            {ui.stampNormalized}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {allThreeRedacted && (
              <div className="ending-a-final-reveal">
                <div className="ending-a-final-grid">
                  <div className="ending-a-photo-restored">
                    <EvidenceArtwork
                      type="Photo_Initial"
                      lang={lang}
                      caption={ui.endingAPhotoRestoredCaption}
                    />
                  </div>
                  <div className="ending-a-monologue-panel">
                    <div className="ending-system-banner">
                      {endings.endingA.systemHeader}
                    </div>
                    <blockquote className="ending-a-quote">
                      {endings.endingA.finalMonologue}
                    </blockquote>
                    <div className="ending-new-file-alert">
                      {endings.endingA.newFilePrompt}
                    </div>
                    <p className="ending-epilogue-note">
                      {endings.endingA.epilogueNote}
                    </p>
                  </div>
                </div>

                <div className="ending-actions-footer">
                  <button
                    type="button"
                    className="btn-terminal-primary btn-replay-loop"
                    onClick={() => {
                      soundEngine.playKeyClick();
                      onResetGame();
                    }}
                  >
                    {endings.endingA.replayButton}
                  </button>
                  <button
                    type="button"
                    className="btn-switch-ending"
                    onClick={() => onSelectBranch(null)}
                  >
                    {ui.backToProtocolSelectionBtn}
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
     BRANCH B: PEELED OFFICE UI SKIN -> BARE PITCH-BLACK INDEX TREE
     ========================================================================== */
  return (
    <div
      className="modal-backdrop act4-ending-b-backdrop"
      role="dialog"
      aria-modal="true"
    >
      {/* Peeling Office Chrome Fragments Falling Downward */}
      <div
        className={`peeling-office-shell ${
          peelStage >= 1 ? 'shell-peeling-1' : ''
        } ${peelStage >= 2 ? 'shell-peeling-2' : ''} ${
          peelStage >= 3 ? 'shell-peeled-gone' : ''
        }`}
        aria-hidden="true"
      >
        <div className="peel-chunk chunk-header">TCD-OS v3.02 // WINDOW FRAME</div>
        <div className="peel-chunk chunk-toolbar">[NORMALIZE] [SAVE] [SCROLLBAR]</div>
        <div className="peel-chunk chunk-table">TABLE_BORDER_01 // ROW_PADDING</div>
      </div>

      {/* Bare Exposed Pitch-Black Raw Index Tree */}
      <div className="bare-matrix-terminal">
        <div className="bare-matrix-header">
          <span>{endings.endingB.systemHeader}</span>
          <span className="bare-matrix-tag">{ui.endingBMatrixTag}</span>
        </div>

        <p className="bare-matrix-desc">{endings.endingB.uiPeelDescription}</p>

        <div className="bare-matrix-split">
          <div className="bare-index-tree-box">
            <pre className="bare-index-tree-pre">
              {endings.endingB.rawMatrixLines.join('\n')}
            </pre>

            <blockquote className="bare-final-monologue">
              {endings.endingB.finalMonologue}
            </blockquote>

            <div className="bare-status-cursor">
              <span>{endings.endingB.statusFooter}</span>
              <span className="terminal-cursor-block" />
            </div>
          </div>

          <div className="bare-photo-column">
            <EvidenceArtwork
              type="Photo_Truth"
              lang={lang}
              caption={ui.endingBPhotoCaption}
            />
          </div>
        </div>

        <div className="ending-actions-footer bare-footer-actions">
          <button
            type="button"
            className="btn-abyss-replay"
            onClick={() => {
              soundEngine.playKeyClick();
              onResetGame();
            }}
          >
            {endings.endingB.replayButton}
          </button>
          <button
            type="button"
            className="btn-switch-ending-b"
            onClick={() => onSelectBranch(null)}
          >
            {ui.backToProtocolSelectionBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
