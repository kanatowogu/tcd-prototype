import * as THREE from 'three';
import { Language } from '../types';

function addLowResGrain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.05) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const delta = (Math.random() - 0.5) * 255 * alpha;
    data[i] = Math.min(255, Math.max(0, data[i] + delta));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + delta));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + delta));
  }
  ctx.putImageData(imgData, 0, 0);
}

function finalizeTexture(canvas: HTMLCanvasElement, nearest = true): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = nearest ? THREE.NearestFilter : THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function createWalnutDeskTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1f1813';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle wood grain lines
  for (let y = 0; y < 256; y += 2) {
    ctx.fillStyle = y % 6 === 0 ? 'rgba(14, 10, 7, 0.38)' : 'rgba(46, 35, 27, 0.22)';
    ctx.fillRect(0, y, 256, 1 + (y % 3 === 0 ? 1 : 0));
  }

  addLowResGrain(ctx, 256, 256, 0.06);
  return finalizeTexture(canvas, true);
}

export function createNameplateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c8bfb0';
  ctx.fillRect(0, 0, 256, 64);

  ctx.strokeStyle = '#3b352d';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 248, 56);

  // Corner rivets
  ctx.fillStyle = '#2b2620';
  [
    [12, 12],
    [244, 12],
    [12, 52],
    [244, 52],
  ].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#1a1714';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TCD-302', 128, 33);

  addLowResGrain(ctx, 256, 64, 0.05);
  return finalizeTexture(canvas, true);
}

export function createMonitorScreenCanvasTexture(
  quotaCount: number,
  file03Decrypted: boolean,
  lensBroken: boolean,
  lang: Language,
  endingARedactedCount = 0
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  // Screen background (warm charcoal-sepia or dark crimson-charcoal)
  ctx.fillStyle = lensBroken ? '#16090b' : '#181613';
  ctx.fillRect(0, 0, 512, 384);

  // Outer terminal frame
  ctx.strokeStyle = lensBroken ? '#9e2832' : '#7a7062';
  ctx.lineWidth = 3;
  ctx.strokeRect(14, 14, 484, 356);

  // Header bar
  ctx.fillStyle = lensBroken ? '#360c11' : '#2b2722';
  ctx.fillRect(16, 16, 480, 42);

  const showCorruptedOperator = lensBroken && endingARedactedCount < 2;
  ctx.fillStyle = '#e8e2d5';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(
    lang === 'zh'
      ? `TCD-302 // ${showCorruptedOperator ? '合并索引点' : '档案员 #302'}`
      : `TCD-302 // ${showCorruptedOperator ? 'MERGER NODE' : 'ARCHIVIST #302'}`,
    28,
    43
  );

  // Quota meter (overflows to 4/3 when lensBroken)
  ctx.fillStyle = lensBroken ? '#e06c75' : '#d4c39e';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(
    lensBroken
      ? lang === 'zh'
        ? '今日配额进度: 4 / 3 (溢出)'
        : 'COGNITIVE QUOTA: 4 / 3 (OVERFLOW)'
      : lang === 'zh'
      ? `认知配额进度: ${quotaCount} / 3`
      : `COGNITIVE QUOTA: ${quotaCount} / 3`,
    32,
    98
  );

  // 3 (or 4 when broken) Quota segments
  const totalSegs = lensBroken ? 4 : 3;
  const segWidth = lensBroken ? 104 : 136;
  const segStep = lensBroken ? 114 : 148;
  for (let i = 0; i < totalSegs; i++) {
    const isFourthOverflow = lensBroken && i === 3;
    ctx.strokeStyle = isFourthOverflow
      ? '#ff2e43'
      : lensBroken
      ? '#a82834'
      : '#8c8273';
    ctx.lineWidth = 2;
    ctx.strokeRect(32 + i * segStep, 114, segWidth, 24);
    if (lensBroken || i < quotaCount) {
      ctx.fillStyle = isFourthOverflow
        ? '#d92638'
        : lensBroken
        ? '#b82534'
        : '#dfd7c8';
      ctx.fillRect(35 + i * segStep, 117, segWidth - 6, 18);
    }
  }

  // Clearance / Filter status box
  ctx.fillStyle = lensBroken ? '#24080b' : '#211e1a';
  ctx.fillRect(32, 158, 448, 86);
  ctx.strokeStyle = lensBroken ? '#7a1f28' : '#4a433b';
  ctx.strokeRect(32, 158, 448, 86);

  ctx.fillStyle = '#dfd7c8';
  ctx.font = '14px monospace';
  ctx.fillText(
    lang === 'zh'
      ? `> 档案 #03 状态: ${file03Decrypted ? '已显影解密 (STAGE B)' : '权限锁定 (0/1)'}`
      : `> FILE #03 STATUS: ${file03Decrypted ? 'DECRYPTED (STAGE B)' : 'LOCKED (0/1)'}`,
    46,
    188
  );
  ctx.fillText(
    lang === 'zh'
      ? `> 认知滤镜状态: ${lensBroken ? '!! 已碎裂 (LENS BROKEN) !!' : '正常运转 (ACTIVE)'}`
      : `> COGNITIVE LENS: ${lensBroken ? '!! SHATTERED !!' : 'ACTIVE (NORMAL)'}`,
    46,
    214
  );

  // Resignation / Action button preview on screen
  ctx.fillStyle = lensBroken
    ? '#8f1822'
    : quotaCount === 3
    ? '#e8e2d5'
    : '#26231e';
  ctx.fillRect(32, 268, 448, 52);
  ctx.strokeStyle = '#dfd7c8';
  ctx.strokeRect(32, 268, 448, 52);

  ctx.fillStyle = quotaCount === 3 && !lensBroken ? '#141210' : '#e8e2d5';
  ctx.font = 'bold 15px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(
    lensBroken
      ? lang === 'zh'
        ? '[ 点击屏幕：长按离职 / 复核 3 号柜 ]'
        : '[ CLICK MONITOR: HOLD TO RESIGN / AUDIT ]'
      : quotaCount === 3
      ? lang === 'zh'
        ? '[ 配额 3/3 已满 —— 点击屏幕查看终端 ]'
        : '[ QUOTA 3/3 READY — CLICK TO OPEN ]'
      : lang === 'zh'
      ? `[ 点击显示器操作终端 // 进度 (${quotaCount}/3) ]`
      : `[ CLICK MONITOR TO OPERATE // (${quotaCount}/3) ]`,
    256,
    300
  );
  ctx.textAlign = 'left';

  addLowResGrain(ctx, 512, 384, 0.05);
  return finalizeTexture(canvas, false);
}

export function createManualCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d')!;

  // Dark bureaucratic charcoal-slate booklet cover
  ctx.fillStyle = '#26231f';
  ctx.fillRect(0, 0, 256, 340);

  // Spine binding strip on left
  ctx.fillStyle = '#141210';
  ctx.fillRect(0, 0, 26, 340);

  // Cream border frame
  ctx.strokeStyle = '#c8bfb0';
  ctx.lineWidth = 3;
  ctx.strokeRect(38, 22, 198, 296);

  // Header box
  ctx.fillStyle = '#dfd7c8';
  ctx.fillRect(50, 42, 174, 52);
  ctx.fillStyle = '#181613';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TCD MANUAL', 137, 66);
  ctx.font = 'bold 12px monospace';
  ctx.fillText('RULES 01 - 03', 137, 84);

  // Emblem seal
  ctx.strokeStyle = '#c8bfb0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(137, 175, 42, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#dfd7c8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('DEPT. 302', 137, 180);

  ctx.font = '12px monospace';
  ctx.fillStyle = '#a89f90';
  ctx.fillText('STANDARD OPERATING', 137, 265);
  ctx.fillText('PROTOCOL PAMPHLET', 137, 283);

  addLowResGrain(ctx, 256, 340, 0.06);
  return finalizeTexture(canvas, true);
}

export function createDossierFolderTexture(
  num: '#01' | '#02' | '#03' | '#04' | '#05',
  status: 'normal' | 'locked' | 'decrypted' | 'complete'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 340;
  const ctx = canvas.getContext('2d')!;

  // Manila Kraft Paper Base (distinct subtle tones per dossier)
  const bgMap: Record<string, string> = {
    '#01': '#cbbba0',
    '#02': '#c2b297',
    '#03': '#b8a68a',
    '#04': '#b3a792',
    '#05': '#a69688',
  };
  ctx.fillStyle = bgMap[num] ?? '#cbbba0';
  ctx.fillRect(0, 0, 256, 340);

  // Folder border & lines
  ctx.strokeStyle = num === '#05' ? '#6e2328' : '#5c5243';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, 232, 316);

  // Top right large printed File Number (#01 ~ #05)
  ctx.fillStyle = num === '#05' ? '#4a1216' : '#1c1916';
  ctx.fillRect(142, 24, 90, 48);
  ctx.fillStyle = '#e8e2d5';
  ctx.font = 'bold 34px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(num, 187, 59);

  // Archival classification stamp bar
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2b2620';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(num === '#05' ? 'MUNICIPAL SEAL LEDGER' : 'TCD ARCHIVE DOSSIER', 26, 112);

  ctx.strokeStyle = '#786c5b';
  ctx.lineWidth = 1.5;
  for (let y = 138; y <= 238; y += 25) {
    ctx.beginPath();
    ctx.moveTo(26, y);
    ctx.lineTo(226, y);
    ctx.stroke();
  }

  // Stamp at bottom
  if (status === 'locked') {
    ctx.strokeStyle = '#7a2020';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 262, 192, 38);
    ctx.fillStyle = '#7a2020';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LOCKED // 0/1', 128, 286);
  } else if (status === 'complete') {
    ctx.strokeStyle = '#1f1c18';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 262, 192, 38);
    ctx.fillStyle = '#1f1c18';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NORMALIZED', 128, 286);
  } else if (status === 'decrypted') {
    ctx.strokeStyle = '#8a242c';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 262, 192, 38);
    ctx.fillStyle = '#8a242c';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DECRYPTED', 128, 286);
  }

  addLowResGrain(ctx, 256, 340, 0.07);
  return finalizeTexture(canvas, true);
}

export function createPolaroidCanvasTexture(lensBroken: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;

  if (!lensBroken) {
    // Warm sepia Polaroid frame
    ctx.fillStyle = '#e6decb';
    ctx.fillRect(0, 0, 256, 300);

    // Inner dark sepia photograph area
    ctx.fillStyle = '#211e1a';
    ctx.fillRect(18, 18, 220, 206);

    // 3 uneven collage paper strips
    ctx.fillStyle = '#2e2923';
    ctx.fillRect(24, 26, 68, 190);
    ctx.fillStyle = '#363029';
    ctx.fillRect(94, 24, 68, 192);
    ctx.fillStyle = '#29241f';
    ctx.fillRect(164, 32, 66, 184);

    // 3 warm monochrome family silhouettes (#302, Wife, Daughter)
    ctx.fillStyle = '#998e7e';
    // Left: #302
    ctx.beginPath();
    ctx.arc(58, 86, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(34, 112, 48, 98);

    // Center: Wife
    ctx.fillStyle = '#a89d8c';
    ctx.beginPath();
    ctx.arc(128, 92, 19, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(105, 116, 46, 94);

    // Right: Daughter
    ctx.fillStyle = '#b5aa98';
    ctx.beginPath();
    ctx.arc(196, 114, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(176, 134, 40, 76);

    // Yellowing Scotch Tape Strips across seams
    ctx.fillStyle = 'rgba(225, 212, 178, 0.38)';
    ctx.fillRect(86, 22, 14, 194);
    ctx.fillRect(156, 28, 14, 188);

    // Bottom Polaroid handwritten note
    ctx.fillStyle = '#24201b';
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Family_Photo.jpg', 128, 254);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#595146';
    ctx.fillText('SEC. 4 — STAY TOGETHER', 128, 276);
  } else {
    // Broken Lens: Bloodied #209 Badge + C-14 Apron + M-04 Flyer Stapled Together
    ctx.fillStyle = '#241416';
    ctx.fillRect(0, 0, 256, 300);

    ctx.fillStyle = '#120708';
    ctx.fillRect(14, 14, 228, 214);

    // Bloodstains
    ctx.fillStyle = '#4f0c13';
    ctx.beginPath();
    ctx.arc(95, 115, 42, 0, Math.PI * 2);
    ctx.arc(165, 135, 46, 0, Math.PI * 2);
    ctx.fill();

    // Left: #209 ID Badge
    ctx.fillStyle = '#cfc6b6';
    ctx.fillRect(22, 36, 66, 150);
    ctx.fillStyle = '#6e141c';
    ctx.fillRect(26, 42, 58, 18);
    ctx.fillStyle = '#1c1615';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('#209 ID', 30, 85);

    // Center: C-14 Apron Tag
    ctx.fillStyle = '#bfae99';
    ctx.fillRect(94, 32, 68, 156);
    ctx.fillStyle = '#591016';
    ctx.fillRect(98, 40, 60, 18);
    ctx.fillStyle = '#1c1615';
    ctx.fillText('C-14 LIN', 102, 85);

    // Right: M-04 Flyer
    ctx.fillStyle = '#dbd2c2';
    ctx.fillRect(168, 38, 66, 148);
    ctx.fillStyle = '#26211e';
    ctx.fillRect(172, 44, 58, 18);
    ctx.fillStyle = '#1c1615';
    ctx.fillText('CASE M-04', 174, 85);

    // Heavy Crimson Staples
    ctx.fillStyle = '#d92638';
    ctx.fillRect(76, 68, 28, 7);
    ctx.fillRect(78, 142, 28, 7);
    ctx.fillRect(152, 76, 28, 7);
    ctx.fillRect(150, 148, 28, 7);

    ctx.fillStyle = '#e06c75';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Photo_Truth.png', 128, 254);
    ctx.font = '11px monospace';
    ctx.fillText('STAPLED IN CABINET #3', 128, 276);
  }

  addLowResGrain(ctx, 256, 300, 0.06);
  return finalizeTexture(canvas, true);
}

export function createLunchboxNoteTexture(lensBroken: boolean, lang: Language): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  if (!lensBroken) {
    ctx.fillStyle = '#ede3c8';
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = '#9e9070';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 120);

    ctx.fillStyle = '#26211b';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      lang === 'zh' ? '“亲爱的，好好吃饭”' : '"Eat well, dear."',
      128,
      58
    );
    ctx.font = '14px monospace';
    ctx.fillStyle = '#5c5243';
    ctx.fillText('— C-14', 128, 92);
  } else {
    ctx.fillStyle = '#2b1616';
    ctx.fillRect(0, 0, 256, 128);
    // Shredded paper & red staples
    ctx.fillStyle = '#9e9482';
    ctx.fillRect(18, 20, 90, 28);
    ctx.fillRect(120, 44, 110, 30);
    ctx.fillRect(40, 78, 130, 26);

    ctx.strokeStyle = '#d92b38';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(60, 30);
    ctx.lineTo(85, 45);
    ctx.moveTo(150, 55);
    ctx.lineTo(180, 40);
    ctx.stroke();
  }

  addLowResGrain(ctx, 256, 128, 0.06);
  return finalizeTexture(canvas, true);
}

export function createPartitionGlassTexture(lensBroken: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  if (!lensBroken) {
    // Frosted ribbed warm glass
    const grad = ctx.createRadialGradient(256, 140, 20, 256, 140, 240);
    grad.addColorStop(0, '#4a4236');
    grad.addColorStop(0.5, '#2b2620');
    grad.addColorStop(1, '#181512');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Warm desk lamp glow from adjacent Desk #209
    const lampGrad = ctx.createRadialGradient(210, 150, 8, 210, 150, 90);
    lampGrad.addColorStop(0, 'rgba(235, 208, 152, 0.55)');
    lampGrad.addColorStop(1, 'rgba(235, 208, 152, 0)');
    ctx.fillStyle = lampGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Vertical ribbed frosted stripes
    for (let x = 0; x < 512; x += 8) {
      ctx.fillStyle = x % 16 === 0 ? 'rgba(255,250,240,0.06)' : 'rgba(0,0,0,0.18)';
      ctx.fillRect(x, 0, 4, 256);
    }
  } else {
    // Pitch-black hollow basement void with jagged glass cracks
    ctx.fillStyle = '#050404';
    ctx.fillRect(0, 0, 512, 256);

    for (let x = 0; x < 512; x += 8) {
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      ctx.fillRect(x, 0, 3, 256);
    }

    // Cracks
    ctx.strokeStyle = '#8c7d75';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(240, 0);
    ctx.lineTo(220, 85);
    ctx.lineTo(265, 145);
    ctx.lineTo(210, 256);
    ctx.moveTo(220, 85);
    ctx.lineTo(130, 140);
    ctx.lineTo(75, 210);
    ctx.moveTo(265, 145);
    ctx.lineTo(360, 110);
    ctx.lineTo(430, 195);
    ctx.stroke();
  }

  addLowResGrain(ctx, 512, 256, 0.05);
  return finalizeTexture(canvas, true);
}
