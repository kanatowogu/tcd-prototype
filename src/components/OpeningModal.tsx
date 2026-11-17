import React, { useEffect, useState } from 'react';
import { getNarrativeBundle } from '../data/narrativeAssets';
import { Language } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { EvidenceArtwork } from './EvidenceArtwork';

interface OpeningModalProps {
  lang: Language;
  onToggleLang: () => void;
  onLogin: () => void;
}

export const OpeningModal: React.FC<OpeningModalProps> = ({
  lang,
  onToggleLang,
  onLogin,
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const { ui, v2_2_3 } = getNarrativeBundle(lang);
  const a1 = v2_2_3.asset1;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 850);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="modal-backdrop opening-backdrop" role="dialog" aria-modal="true">
      <div className="opening-modal-card">
        <div className="opening-header">
          <span className="terminal-badge">{a1.openingBadge}</span>
          <div className="opening-header-right">
            <span className="grounding-timer">
              {countdown > 0 ? a1.groundingCountdown(countdown) : a1.groundingComplete}
            </span>
            <button
              type="button"
              className="btn-lang-switch"
              onClick={() => {
                soundEngine.playKeyClick();
                onToggleLang();
              }}
              title="切换语言 / Switch Language"
            >
              {lang === 'zh' ? '[中文 / EN]' : '[EN / 中文]'}
            </button>
          </div>
        </div>

        <div className="opening-body">
          <div className="opening-photo-wrapper">
            <EvidenceArtwork
              type="Photo_Initial"
              lang={lang}
              caption={ui.evidence1Caption}
            />
          </div>

          <div className="opening-monologue-box">
            <div className="monologue-label">{a1.groundingPrompt}</div>
            <p className="opening-monologue-text">{a1.openingMonologue}</p>
            <div className="countdown-steps">
              {[5, 4, 3, 2, 1].map((sec) => (
                <span
                  key={sec}
                  className={`countdown-pill ${countdown < sec ? 'countdown-pill-active' : ''}`}
                >
                  {sec}
                </span>
              ))}
              <span
                className={`countdown-status ${countdown === 0 ? 'countdown-status-ready' : ''}`}
              >
                {countdown === 0 ? a1.groundingComplete : a1.groundingCountdown(countdown)}
              </span>
            </div>
          </div>
        </div>

        <div className="opening-footer">
          <button
            type="button"
            className="btn-terminal-primary btn-login"
            onClick={() => {
              soundEngine.playStamp();
              onLogin();
            }}
          >
            {a1.loginButton}
          </button>
        </div>
      </div>
    </div>
  );
};
