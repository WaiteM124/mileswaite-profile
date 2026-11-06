import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from 'three';
import {
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_Z,
  DPR_CAP,
  TILT_X,
  TILT_Z,
  createCylinderArcs,
  type CylinderArc,
} from './cylinder';

const SVG_NS = 'http://www.w3.org/2000/svg';

interface Spinner {
  group: Group;
  speed: number;
  reverse: boolean;
}

/**
 * Mounts the homepage cylinder. The WebGL scene matches
 * RotatingCylinderLinesR3F: one group per arc, Y rotation by a fixed step,
 * container tilt, and a camera at z = 3.5. Lights are present because they
 * are in the original scene; LineBasicMaterial does not use them.
 *
 * Returns a cleanup that cancels the frame, disconnects observers, removes
 * listeners, and releases GPU resources. Safe to call more than once.
 */
export function mountHero(root: HTMLElement): () => void {
  root.setAttribute('aria-hidden', 'true');
  root.replaceChildren(buildFallbackSvg());

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = motion.matches;
  let onScreen = isInView(root);
  let disposed = false;
  let running = false;
  let raf = 0;

  let renderer: WebGLRenderer | null = null;
  let scene: Scene | null = null;
  let camera: PerspectiveCamera | null = null;
  const geometries: BufferGeometry[] = [];
  const materials: LineBasicMaterial[] = [];
  const spinners: Spinner[] = [];
  const cleanups: Array<() => void> = [];

  const setState = (state: 'running' | 'paused' | 'reduced' | 'fallback') => {
    root.dataset.state = state;
  };

  const wantsAnimation = () =>
    !reduced && onScreen && document.visibilityState === 'visible' && renderer !== null;

  const resize = () => {
    if (!renderer || !scene || !camera) return;
    const width = root.clientWidth;
    const height = root.clientHeight;
    if (width < 2 || height < 2) return;

    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const bufferWidth = Math.floor(width * dpr);
    const bufferHeight = Math.floor(height * dpr);
    const canvas = renderer.domElement;
    if (
      renderer.getPixelRatio() === dpr &&
      canvas.width === bufferWidth &&
      canvas.height === bufferHeight
    ) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  const frame = () => {
    raf = 0;
    if (!running || !renderer || !scene || !camera) return;
    if (renderer.getPixelRatio() !== Math.min(window.devicePixelRatio || 1, DPR_CAP)) resize();
    for (const spinner of spinners) {
      spinner.group.rotation.y += spinner.reverse ? -spinner.speed : spinner.speed;
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  const stop = (state: 'paused' | 'reduced') => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (renderer) setState(state);
  };

  const start = () => {
    if (disposed || running || !renderer) return;
    if (!wantsAnimation()) {
      stop(reduced ? 'reduced' : 'paused');
      return;
    }
    running = true;
    setState('running');
    raf = requestAnimationFrame(frame);
  };

  const sync = () => {
    if (!renderer || disposed) return;
    if (wantsAnimation()) start();
    else stop(reduced ? 'reduced' : 'paused');
  };

  const releaseWebGL = (dropContext: boolean) => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (!renderer) return;

    for (const geometry of geometries) geometry.dispose();
    geometries.length = 0;
    for (const material of materials) material.dispose();
    materials.length = 0;
    spinners.length = 0;

    const canvas = renderer.domElement;
    renderer.dispose();
    if (dropContext) renderer.forceContextLoss();
    canvas.remove();
    renderer = null;
    scene = null;
    camera = null;
  };

  const useFallback = () => {
    releaseWebGL(false);
    root.replaceChildren(buildFallbackSvg());
    setState('fallback');
  };

  let created: WebGLRenderer | null = null;
  try {
    created = new WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!created.getContext()) throw new Error('WebGL context unavailable');
    renderer = created;
  } catch {
    created?.dispose();
    renderer = null;
    setState('fallback');
    return () => {
      disposed = true;
    };
  }

  try {
    scene = new Scene();
    scene.background = new Color(0x000000);
    camera = new PerspectiveCamera(CAMERA_FOV, 1, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(0, 0, CAMERA_Z);

    const container = new Group();
    container.rotation.x = TILT_X;
    container.rotation.z = TILT_Z;
    scene.add(container);
    addLights(scene);
    addArcs(container, createCylinderArcs(), geometries, materials, spinners);

    renderer.setClearColor(0x000000, 1);
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.background = '#000000';
    root.replaceChildren(canvas);
    resize();

    const onLost = (event: Event) => {
      event.preventDefault();
      if (!disposed) useFallback();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    cleanups.push(() => canvas.removeEventListener('webglcontextlost', onLost));

    const observer = new ResizeObserver(() => resize());
    observer.observe(root);
    cleanups.push(() => observer.disconnect());

    if ('IntersectionObserver' in window) {
      const visibility = new IntersectionObserver((entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      });
      visibility.observe(root);
      cleanups.push(() => visibility.disconnect());
    }

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);
    cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

    const onMotion = () => {
      reduced = motion.matches;
      sync();
    };
    motion.addEventListener('change', onMotion);
    cleanups.push(() => motion.removeEventListener('change', onMotion));

    if (reduced || !onScreen || document.hidden) stop(reduced ? 'reduced' : 'paused');
    else start();
  } catch {
    useFallback();
  }

  return () => {
    if (disposed) return;
    disposed = true;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    for (const cleanup of cleanups) cleanup();
    cleanups.length = 0;
    releaseWebGL(true);
  };
}

function addLights(scene: Scene) {
  scene.add(new AmbientLight(0xffffff, 1));
  const directional = new DirectionalLight(0xffffff, 1);
  directional.position.set(5, 5, 5);
  scene.add(directional);
  const point = new PointLight(0xff00ff, 0.5);
  point.position.set(-5, 0, 3);
  scene.add(point);
}

function addArcs(
  container: Group,
  arcs: CylinderArc[],
  geometries: BufferGeometry[],
  materials: LineBasicMaterial[],
  spinners: Spinner[],
) {
  const byColor = new Map<number, LineBasicMaterial>();

  for (const arc of arcs) {
    let material = byColor.get(arc.color);
    if (!material) {
      material = new LineBasicMaterial({ color: arc.color });
      byColor.set(arc.color, material);
      materials.push(material);
    }

    const positions = new Float32Array(arc.points.length * 3);
    for (let i = 0; i < arc.points.length; i++) {
      const point = arc.points[i];
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometries.push(geometry);

    const group = new Group();
    group.add(new Line(geometry, material));
    container.add(group);
    spinners.push({ group, speed: arc.speed, reverse: arc.reverse });
  }
}

function isInView(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0 && rect.height > 0;
}

/** Same arcs and camera, drawn once. Used when WebGL cannot start or the context is lost. */
export function buildFallbackSvg(): SVGSVGElement {
  const size = 1000;
  const camera = new PerspectiveCamera(CAMERA_FOV, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position.set(0, 0, CAMERA_Z);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const pivot = new Group();
  pivot.rotation.x = TILT_X;
  pivot.rotation.z = TILT_Z;
  pivot.updateMatrix();

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('aria-hidden', 'true');

  const background = document.createElementNS(SVG_NS, 'rect');
  background.setAttribute('width', String(size));
  background.setAttribute('height', String(size));
  background.setAttribute('fill', '#000000');
  svg.append(background);

  for (const arc of createCylinderArcs()) {
    const points = arc.points
      .map((point) => {
        const projected = point.clone().applyMatrix4(pivot.matrix);
        projected.project(camera);
        const x = (projected.x * 0.5 + 0.5) * size;
        const y = (-projected.y * 0.5 + 0.5) * size;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');

    const polyline = document.createElementNS(SVG_NS, 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', `#${arc.color.toString(16).padStart(6, '0')}`);
    polyline.setAttribute('stroke-width', '1');
    polyline.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.append(polyline);
  }

  return svg;
}
