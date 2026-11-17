import React from 'react';
import { getNarrativeBundle } from '../data/narrativeAssets';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { EvidenceArtwork } from './EvidenceArtwork';

interface Act3ReviewModalProps {
  lang: Language;
  resignationRejected: boolean;
  onMinimizeToInspectDesk: () => void;
  onProceedToFinalProtocol: () => void;
}

export const Act3ReviewModal: React.FC<Act3ReviewModalProps> = ({
  lang,
  resignationRejected,
  onMinimizeToInspectDesk,
  onProceedToFinalProtocol,
}) => {
  const { ui, v2_2_3, v2_4_5 } = getNarrativeBundle(lang);
  const altered = v2_2_3.asset2_dossiers.file01.alteredRetrospective;
  const resign = v2_4_5.asset5_resignation;

  return (
    <div className="modal-backdrop act3-backdrop" role="dialog" aria-modal="true">
      <div className="act3-modal-card">
        <div className="act3-modal-header">
          <span className="act3-alert-title">{ui.act3ModalTitle}</span>
          <button
            type="button"
            className="btn-minimize-review"
            onClick={() => {
              soundEngine.playPaperRustle();
              onMinimizeToInspectDesk();
            }}
          >
            {ui.minimizeReviewBtn}
          </button>
        </div>

        <div className="act3-modal-body">
          {resignationRejected && (
            <div className="act3-rejection-box">
              <div className="system-rejection-line">{resign.systemRejection}</div>
              <blockquote className="protagonist-realization-quote">
                {resign.protagonistRealization}
              </blockquote>
            </div>
          )}

          <div className="act3-comparison-grid">
            <div className="act3-comparison-col">
              <div className="act3-col-header">{ui.act3LeftColHeader}</div>
              <div className="act3-altered-file-box">
                <div className="altered-doc-id">{altered.metadata}</div>
                {altered.recoveredLines.map((line, i) => (
                  <p key={i} className="altered-audio-line">
                    {line}
                  </p>
                ))}
                <div className="altered-sys-note">{altered.systemNote}</div>
              </div>
            </div>

            <div className="act3-comparison-col">
              <div className="act3-col-header">{ui.act3RightColHeader}</div>
              <EvidenceArtwork
                type="Photo_Truth"
                lang={lang}
                caption={ui.evidence3Caption}
              />
            </div>
          </div>
        </div>

        <div className="act3-modal-footer">
          <button
            type="button"
            className="btn-secondary-crimson"
            onClick={() => {
              soundEngine.playPaperRustle();
              onMinimizeToInspectDesk();
            }}
          >
            {ui.returnToDeskInspectBtn}
          </button>
          {resignationRejected && (
            <button
              type="button"
              className="btn-proceed-final"
              onClick={() => {
                soundEngine.playStamp();
                onProceedToFinalProtocol();
              }}
            >
              {resign.proceedToFinalButton}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
