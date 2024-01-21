import * as THREE from 'three';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { context as fiberContext, useFrame, useThree } from '@react-three/fiber';
import {mergeRefs} from 'react-merge-refs';

export type ScrollControlsProps = {
  eps?: number;
  vertical?: boolean; // Change from 'horizontal' to 'vertical'
  infinite?: boolean;
  pages?: number;
  distance?: number;
  damping?: number;
  enabled?: boolean;
  children: React.ReactNode;
};

export type ScrollControlsState = {
  el: HTMLDivElement;
  eps: number;
  fill: HTMLDivElement;
  fixed: HTMLDivElement;
  vertical: boolean | undefined; // Change from 'horizontal' to 'vertical'
  damping: number;
  offset: number;
  delta: number;
  scroll: React.MutableRefObject<number>;
  pages: number;
  range(from: number, distance: number, margin?: number): number;
  curve(from: number, distance: number, margin?: number): number;
  visible(from: number, distance: number, margin?: number): boolean;
};

const context = React.createContext<ScrollControlsState>(null!);

export function useScroll() {
  return React.useContext(context);
}

export function ScrollControls({
  eps = 0.00001,
  enabled = true,
  infinite,
  vertical, // Change from 'horizontal' to 'vertical'
  pages = 1,
  distance = 1,
  damping = 4,
  children
}: ScrollControlsProps) {
  const { gl, size, invalidate, events, raycaster } :any= useThree();
  const [el] = React.useState(() => document.createElement('div'));
  const [fill] = React.useState(() => document.createElement('div'));
  const [fixed] = React.useState(() => document.createElement('div'));
  const target = gl.domElement.parentNode!;
  const scroll = React.useRef(0);

  const state = React.useMemo(() => {
    const state = {
      el,
      eps,
      fill,
      fixed,
      vertical, // Change from 'horizontal' to 'vertical'
      damping,
      offset: 0,
      delta: 0,
      scroll,
      pages,
      range(from: number, distance: number, margin: number = 0) {
        const start = from - margin;
        const end = start + distance + margin * 2;
        return this.offset < start ? 0 : this.offset > end ? 1 : (this.offset - start) / (end - start);
      },
      curve(from: number, distance: number, margin: number = 0) {
        return Math.sin(this.range(from, distance, margin) * Math.PI);
      },
      visible(from: number, distance: number, margin: number = 0) {
        const start = from - margin;
        const end = start + distance + margin * 2;
        return this.offset >= start && this.offset <= end;
      }
    };
    return state;
  }, [eps, damping, vertical, pages]);

  React.useEffect(() => {
    el.style.position = 'absolute';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style[vertical ? 'overflowY' : 'overflowX'] = 'auto'; // Change from 'overflowX' to 'overflowY'
    el.style[vertical ? 'overflowX' : 'overflowY'] = 'hidden'; // Change from 'overflowY' to 'overflowX'
    el.style.top = '0px';
    el.style.left = '0px';

    fixed.style.position = 'sticky';
    fixed.style.top = '0px';
    fixed.style.left = '0px';
    fixed.style.width = '100%';
    fixed.style.height = '100%';
    fixed.style.overflow = 'hidden';
    el.appendChild(fixed);

    fill.style.width = vertical ? '100%' : `${pages * distance * 100}%`;
    fill.style.height = vertical ? `${pages * distance * 100}%` : '100%';
    fill.style.pointerEvents = 'none';
    el.appendChild(fill);
    target.appendChild(el);

    // Init scroll one pixel in to allow upward/leftward scroll
    el[vertical ? 'scrollTop' : 'scrollLeft'] = 1;

    const oldTarget = typeof events.connected !== 'boolean' ? events.connected : gl.domElement;
    requestAnimationFrame(() => events.connect?.(el));
    const oldCompute = raycaster.computeOffsets;
    raycaster.computeOffsets = ({ clientX, clientY }) => ({
      offsetX: clientX - (target as HTMLElement).offsetLeft,
      offsetY: clientY - (target as HTMLElement).offsetTop
    });

    return () => {
      target.removeChild(el);
      raycaster.computeOffsets = oldCompute;
      events.connect?.(oldTarget);
    };
  }, [pages, distance, vertical, el, fill, fixed, target]);

  React.useEffect(() => {
    const containerLength = size[vertical ? 'height' : 'width'];
    const scrollLength = el[vertical ? 'scrollHeight' : 'scrollWidth'];
    const scrollThreshold = scrollLength - containerLength;

    let current = 0;
    let disableScroll = true;
    let firstRun = true;

    const onScroll = (e) => {
      console.log("runn in sroll")
      if (!enabled || firstRun) return;
      invalidate();
      current = el[vertical ? 'scrollTop' : 'scrollLeft'];
      scroll.current = current / scrollThreshold;
      console.log("scroll.current",scroll.current)
      console.log("current",current)
      console.log("disableScroll",disableScroll)
      if (infinite) {
        if (!disableScroll) {
          if (scroll.current >= 1 - 0.001) {
            const damp = 1 - state.offset;
            el[vertical ? 'scrollTop' : 'scrollLeft'] = 1;
            scroll.current = state.offset = -damp;
            disableScroll = true;
          } else if (current <= 0) {
            const damp = 1 + state.offset;
            el[vertical ? 'scrollTop' : 'scrollLeft'] = scrollLength;
            scroll.current = state.offset = damp;
            disableScroll = true;
          }
        }
        if (disableScroll) setTimeout(() => (disableScroll = false), 40);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(() => (firstRun = false));

    const onWheel = (e) => (el.scrollTop += e.deltaY / 2);
    if (vertical) el.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (vertical) el.removeEventListener('wheel', onWheel);
    };
  }, [el, size, infinite, state, invalidate, vertical]);

  let last = 0;
  useFrame((_, delta) => {
    state.offset = THREE.MathUtils.damp((last = state.offset), scroll.current, damping, delta);
    state.delta = THREE.MathUtils.damp(state.delta, Math.abs(last - state.offset), damping, delta);
    if (state.delta > eps) invalidate();
  });

  return <context.Provider value={state}>{children}</context.Provider>;
}

const ScrollCanvas = React.forwardRef(({ children }:any, ref) => {
  const group = React.useRef<THREE.Group>(null!);
  const state = useScroll();
  const { width, height } = useThree((state) => state.viewport);
  useFrame(() => {
    group.current.position.y = state.vertical ? height * (state.pages - 1) * state.offset : 0;
    group.current.position.x = state.vertical ? 0 : -width * (state.pages - 1) * state.offset;
  });
  return <group ref={mergeRefs([ref, group])}>{children}</group>;
});

const ScrollHtml = React.forwardRef(
  ({ children, style, ...props }: { children?: React.ReactNode; style?: React.StyleHTMLAttributes<any> }, ref) => {
    const state = useScroll();
    const group = React.useRef<HTMLDivElement>(null!);
    const { width, height } = useThree((state) => state.size);
    const fiberState = React.useContext(fiberContext);
    useFrame(() => {
      if (state.delta > state.eps) {
        group.current.style.transform = `translate3d(${state.vertical ? 0 : -width * (state.pages - 1) * state.offset}px,${
          state.vertical ? height * (state.pages - 1) * -state.offset : 0
        }px,0)`;
      }
    });
    ReactDOM.render(
      <div
        ref={mergeRefs([ref, group])}
        style={{ ...style, position: 'absolute', top: 0, left: 0, willChange: 'transform' }}
        {...props}
      >
        <context.Provider value={state}>
          <fiberContext.Provider value={fiberState}>{children}</fiberContext.Provider>
        </context.Provider>
      </div>,
      state.fixed
    );
    return null;
  }
);

type ScrollProps = {
  html?: boolean;
  children?: React.ReactNode;
};

export const Scroll = React.forwardRef(({ html, ...props }: ScrollProps, ref) => {
  const El = html ? ScrollHtml : ScrollCanvas;
  return <El ref={ref} {...props} />;
});
