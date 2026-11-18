import React from 'react';
import { getNarrativeBundle } from '../data/narrativeAssets';
import { FocusTarget, Language } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface SubtitleHUDProps {
  lang: Language;
  focusTarget: FocusTarget;
  quotaCount: number;
  file03Decrypted: boolean;
  file04Delivered: boolean;
  file05Delivered: boolean;
  lensBroken: boolean;
  resignationRejected: boolean;
  endingARedactedCount: number;
  innerVoice: string;
  innerVoiceSource: string;
  subtitleLagging: boolean;
  brightness: number;
  onChangeBrightness: (value: number) => void;
  onToggleLang: () => void;
  onExitFocus: () => void;
  onOpenAct3Review: () => void;
  onProceedToFinalProtocol: () => void;
}

export const SubtitleHUD: React.FC<SubtitleHUDProps> = ({
  lang,
  focusTarget,
  quotaCount,
  file03Decrypted,
  file04Delivered,
  file05Delivered,
  lensBroken,
  resignationRejected,
  endingARedactedCount,
  innerVoice,
  innerVoiceSource,
  subtitleLagging,
  brightness,
  onChangeBrightness,
  onToggleLang,
  onExitFocus,
  onOpenAct3Review,
  onProceedToFinalProtocol,
}) => {
  const { ui, v2_4_5 } = getNarrativeBundle(lang);
  const showCorruptedOperator = lensBroken && endingARedactedCount < 2;

  return (
    <>
      {/* Top-Right Minimalist Controls */}
      <div className="hud-top-right">
        <span
          className={`hud-operator-badge ${
            showCorruptedOperator ? 'operator-corrupted' : ''
          }`}
        >
          {showCorruptedOperator ? ui.operatorCorrupted : ui.operatorActive}
        </span>

        {focusTarget !== 'none' && (
          <button
            type="button"
            className="hud-exit-pill"
            onClick={() => {
              soundEngine.playPaperRustle();
              onExitFocus();
            }}
          >
            {lang === 'zh'
              ? '[ 右键 / 点击空白处退回桌面 ]'
              : '[ RMB / Click Backdrop to Return ]'}
          </button>
        )}

        {lensBroken && (
          <button
            type="button"
            className="hud-act3-pill"
            onClick={onOpenAct3Review}
          >
            {ui.viewAct3ReviewBtn}
          </button>
        )}

        {resignationRejected && (
          <button
            type="button"
            className="hud-final-protocol-pill"
            onClick={onProceedToFinalProtocol}
          >
            {v2_4_5.asset5_resignation.proceedToFinalButton}
          </button>
        )}

        <div
          className="hud-brightness-control"
          title={
            lang === 'zh'
              ? '调节画面亮度 / 光照强度（双击数值恢复默认 1.2x）'
              : 'Adjust scene brightness / lighting (double-click value to reset 1.2x)'
          }
        >
          <span className="hud-brightness-label" aria-hidden="true">
            {lang === 'zh' ? '亮度' : 'LUX'}
          </span>
          <input
            type="range"
            className="hud-brightness-slider"
            min={0.5}
            max={2.0}
            step={0.05}
            value={brightness}
            aria-label={
              lang === 'zh' ? '画面亮度 / 光照强度' : 'Scene brightness'
            }
            onChange={(e) => onChangeBrightness(parseFloat(e.target.value))}
          />
          <button
            type="button"
            className="hud-brightness-value"
            onDoubleClick={() => onChangeBrightness(1.2)}
            title={lang === 'zh' ? '双击恢复默认 1.2x' : 'Double-click to reset 1.2x'}
          >
            {(Number.isInteger(Math.round(brightness * 100) / 10)
              ? brightness.toFixed(1)
              : brightness.toFixed(2)) + 'x'}
          </button>
        </div>

        <button
          type="button"
          className="hud-lang-btn"
          onClick={() => {
            soundEngine.playKeyClick();
            onToggleLang();
          }}
          title="切换语言 / Switch Language"
        >
          {lang === 'zh' ? '[中文 / EN]' : '[EN / 中文]'}
        </button>
      </div>

      {/* Bottom Frameless Cinematic Subtitle Bar */}
      <div
        className={`cinematic-subtitle-hud ${
          subtitleLagging ? 'subtitle-lag-pulse' : ''
        }`}
        aria-live="polite"
      >
        <div className="subtitle-meta-line">
          <span
            className={`subtitle-speaker-tag ${
              lensBroken ? 'speaker-corrupted' : ''
            }`}
          >
            {innerVoiceSource}
          </span>
          <span className="subtitle-quota-dot">·</span>
          <span className="subtitle-quota-tag">
            {ui.cognitiveQuotaLabel(quotaCount, lensBroken)}
          </span>
          {file03Decrypted && !file05Delivered && !lensBroken && (
            <>
              <span className="subtitle-quota-dot">·</span>
              <span className="subtitle-decrypted-tag">
                {file04Delivered
                  ? lang === 'zh'
                    ? '档案 #03 / #04 已送达'
                    : '#03 UNLOCKED & #04 DELIVERED'
                  : lang === 'zh'
                  ? '档案 #03 已显影'
                  : 'FILE #03 DECRYPTED'}
              </span>
            </>
          )}
          {file05Delivered && !lensBroken && (
            <>
              <span className="subtitle-quota-dot">·</span>
              <span className="subtitle-ready-tag">
                {lang === 'zh'
                  ? '档案 #05 已送达桌面'
                  : 'FILE #05 DELIVERED TO DESK'}
              </span>
            </>
          )}
        </div>

        <p className="subtitle-monologue-text">{innerVoice}</p>
      </div>
    </>
  );
};
