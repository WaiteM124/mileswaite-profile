import { Vector3 } from 'three';

/** Camera and tilt from RotatingCylinderLinesR3F.tsx. */
export const CAMERA_Z = 3.5;
export const CAMERA_FOV = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const TILT_X = 0.5;
export const TILT_Z = 0.2;

/** Matches React Three Fiber's default canvas dpr of [1, 2]. */
export const DPR_CAP = 2;

export interface CylinderArc {
  points: Vector3[];
  color: number;
  speed: number;
  reverse: boolean;
}

/**
 * Homepage hero geometry, ported from
 * mileswaite.net/components/RotatingCylinderLinesR3F.tsx.
 *
 * The seed is copied verbatim. `(Math.sin(seed) * 10000) % 1` can be
 * negative, and those arcs are skipped. That is what the live hero draws.
 * Speeds are per-frame steps, matching useFrame without a delta.
 */
export function createCylinderArcs(): CylinderArc[] {
  const randomSeed = (row: number, col: number, offset = 0) => {
    const seed = row * 100 + col + offset;
    return (Math.sin(seed) * 10000) % 1;
  };

  const columns = 7;
  const rows = 5;
  const squareHeight = 0.55;
  const heightSpacing = 0.65;
  const anglePerSquare = (Math.PI * 2) / columns;
  const linesPerSquare = 7;
  const arcs: CylinderArc[] = [];

  const pushCylinder = (radius: number, color: number, offset: number, reverse: boolean) => {
    for (let row = 0; row < rows; row++) {
      const yPos = (row - (rows - 1) / 2) * heightSpacing;

      for (let col = 0; col < columns; col++) {
        if (randomSeed(row, col, offset) < 0.4) continue;

        const startAngle = (col / columns) * Math.PI * 2 - anglePerSquare / 2;
        const endAngle = startAngle + anglePerSquare * 0.9;
        const speed = col % 2 === 1 ? 0.05625 : 0.0225;

        for (let line = 0; line < linesPerSquare; line++) {
          const lineYOffset = (line - (linesPerSquare - 1) / 2) * (squareHeight / linesPerSquare);
          const lineY = yPos + lineYOffset;
          const points: Vector3[] = [];
          const segments = 20;

          for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / segments);
            points.push(new Vector3(Math.cos(angle) * radius, lineY, Math.sin(angle) * radius));
          }

          arcs.push({ points, color, speed, reverse });
        }
      }
    }
  };

  pushCylinder(1, 0xff0000, 0, false);
  pushCylinder(0.8, 0x00ff00, 1000, true);
  pushCylinder(1.2, 0xffffff, 2000, false);

  return arcs;
}
