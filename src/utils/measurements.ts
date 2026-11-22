import type { MeasureUnit } from '../types/cocktail';

const OZ_TO_ML = 29.5735;
const CL_TO_ML = 10;
const TSP_TO_ML = 5;
const TBSP_TO_ML = 15;
const SHOT_TO_ML = 45;
const CUP_TO_ML = 240;

function parseLeadingNumber(str: string): { value: number; rest: string } | null {
  const trimmed = str.trim();

  // Mixed fraction e.g. "1 1/2 oz" or "1-1/2 oz"
  const mixedMatch = /^(\d+)[\s-]+(\d+)\/(\d+)\s*(.*)$/.exec(trimmed);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const num = Number(mixedMatch[2]);
    const den = Number(mixedMatch[3]);
    if (den !== 0) {
      return { value: whole + num / den, rest: mixedMatch[4] ?? '' };
    }
  }

  // Simple fraction e.g. "3/4 oz"
  const fracMatch = /^(\d+)\/(\d+)\s*(.*)$/.exec(trimmed);
  if (fracMatch) {
    const num = Number(fracMatch[1]);
    const den = Number(fracMatch[2]);
    if (den !== 0) {
      return { value: num / den, rest: fracMatch[3] ?? '' };
    }
  }

  // Range e.g. "1-2 dashes" -> scale both sides if needed, handle here as first number
  const decMatch = /^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(trimmed);
  if (decMatch) {
    const rawNum = (decMatch[1] ?? '').replace(',', '.');
    return { value: Number(rawNum), rest: decMatch[2] ?? '' };
  }

  return null;
}

function formatNumber(n: number): string {
  if (Math.abs(n - Math.round(n)) < 0.05) {
    return String(Math.round(n));
  }
  const rounded = Math.round(n * 4) / 4; // quarter steps look crisp for oz
  const whole = Math.floor(rounded);
  const frac = rounded - whole;
  const fracStr =
    Math.abs(frac - 0.25) < 0.01
      ? '¼'
      : Math.abs(frac - 0.5) < 0.01
        ? '½'
        : Math.abs(frac - 0.75) < 0.01
          ? '¾'
          : '';

  if (fracStr) {
    return whole > 0 ? `${whole}${fracStr}` : fracStr;
  }
  return rounded.toFixed(1).replace(/\.0$/, '');
}

function roundMl(ml: number): number {
  if (ml <= 10) return Math.max(1, Math.round(ml));
  return Math.round(ml / 5) * 5;
}

/**
 * Scales a cocktail measure string by `servings` and converts liquid volume units
 * (`oz`, `ml`, `cl`, `shot`) to the user's preferred unit (`metric` or `imperial`).
 */
export function formatMeasure(
  rawMeasure: string | undefined,
  servings: number,
  unit: MeasureUnit
): string {
  if (!rawMeasure || !rawMeasure.trim()) return '';

  const parsed = parseLeadingNumber(rawMeasure);
  if (!parsed || Number.isNaN(parsed.value)) {
    return rawMeasure.trim();
  }

  const scaledValue = parsed.value * servings;
  const unitText = parsed.rest.trim();
  const lowerUnit = unitText.toLowerCase();

  // Detect convertible liquid units
  const tryUnit = (regex: RegExp, factor: number): { ml: number; trailing: string } | null => {
    const m = regex.exec(unitText);
    if (!m) return null;
    return {
      ml: scaledValue * factor,
      trailing: unitText.slice(m[0].length).trim(),
    };
  };

  const converted =
    tryUnit(/^(fl\.?\s*oz\.?|oz\.?|ounces?)\b/i, OZ_TO_ML) ??
    tryUnit(/^(ml\.?|milliliters?|millilitres?)\b/i, 1) ??
    tryUnit(/^(cl\.?)\b/i, CL_TO_ML) ??
    tryUnit(/^(shots?|jiggers?)\b/i, SHOT_TO_ML) ??
    tryUnit(/^(cups?)\b/i, CUP_TO_ML);

  if (converted) {
    const suffix = converted.trailing ? ` ${converted.trailing}` : '';
    if (unit === 'metric') {
      return `${roundMl(converted.ml)} ml${suffix}`;
    }
    const oz = converted.ml / OZ_TO_ML;
    return `${formatNumber(oz)} oz${suffix}`;
  }

  // Keep non-liquid or culinary counts (dashes, leaves, wedges, tsp, tbsp, etc.) cleanly scaled
  if (lowerUnit.startsWith('tsp') && unit === 'metric' && scaledValue >= 3) {
    return `${roundMl(scaledValue * TSP_TO_ML)} ml`;
  }
  if (lowerUnit.startsWith('tblsp') || lowerUnit.startsWith('tbsp')) {
    if (unit === 'metric') {
      return `${roundMl(scaledValue * TBSP_TO_ML)} ml`;
    }
  }

  const formattedNum = formatNumber(scaledValue);
  return unitText ? `${formattedNum} ${unitText}` : formattedNum;
}
