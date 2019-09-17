import { Back, Elastic, Expo, Power1, Power3, TimelineMax, TweenLite, TweenMax } from 'gsap/all';
import { isAnimationsDisabled } from './config';
// re-export
export { Back, Draggable, TweenLite, Elastic, Power1, TimelineLite, TimelineMax, TweenMax } from 'gsap/all';

export const BackEasing = Back;
interface IChildtimelineSetting {
    label: string;
    delay: number;
    order: number;
    timeline: TimelineMax;
}

/**
 * This is GSAP helper class for managing several
 * timelines across Angular and Stencil components.
 */
abstract class Gsap {
    protected autoplayInTimelineNum?: number;
    private isPrepared: boolean = false;
    private masterTimeline: TimelineMax;
    private childTimelines: IChildtimelineSetting[] = [];

    // optional callbacks
    protected onStart?();
    protected onComplete?();

    /**
     * @param timeline TimelineMax
     * @param delay positive or negative value of delay in seconds of previous ordered timeline
     * @param order timeline will be placed to master Timeline in given order
     * @param label string label for timeline in master timeline
     */
    protected addTimeline(timeline: TimelineMax, delay: number = 0, order?: number): string {
        timeline.pause();
        if (!order) {
            order = Math.max(...this.childTimelines.map((tl) => tl.order), 0) + 1;
        }
        let label = 'scene' + (this.childTimelines.length + 1);
        this.childTimelines.push({ label, delay, order, timeline });
        this.isPrepared = false;
        this.checkAutoplay();
        return label;
    }

    protected clean(): this {
        this.childTimelines = [];
        return this;
    }

    protected play(): this {
        this.prepareTimeline();
        if (this.masterTimeline) {
            this.masterTimeline.play();
        }
        return this;
    }

    protected stop(): this {
        if (this.masterTimeline) {
            this.masterTimeline.kill();
        }
        return this;
    }

    protected pause(): this {
        if (this.masterTimeline) {
            this.masterTimeline.pause();
        }
        return this;
    }

    protected reverse(): this {
        if (this.masterTimeline) {
            this.masterTimeline.reverse();
        }
        return this;
    }

    protected getTimelineByLabel(label: string): TimelineMax | null {
        return this.childTimelines.find((child) => child.label === label);
    }

    private checkAutoplay() {
        if (this.autoplayInTimelineNum && this.childTimelines.length >= this.autoplayInTimelineNum) {
            this.play();
        }
    }

    private translateDelayToPosition(delay: number): string {
        return (delay < 0 ? '-' : '+') + '=' + Math.abs(delay || 0);
    }

    private prepareTimeline() {
        if (this.isPrepared) {
            return;
        }
        let config = {
            paused: true,
            onStart: () => (this.onStart ? this.onStart() : null), // change callback scope to Gsap
            onComplete: () => (this.onComplete ? this.onComplete() : null) // change callback scope to Gsap
        };
        try {
            this.masterTimeline = new TimelineMax(config);
            this.childTimelines.sort((a, b) => a.order - b.order).forEach((child) => this.masterTimeline.add([child.timeline.play(), child.label.toString()], this.translateDelayToPosition(child.delay)));
            this.isPrepared = true;
        } catch (err) { }
    }
}

export class DashboardGsapAnimation extends Gsap {
    protected autoplayInTimelineNum;

    // containers must be added first and animation is not active if any container is added
    private isActive = false;

    protected onStart() {
        this.isActive = false;
    }

    addContainerElements(elements: NodeList, disableChildrenAnimation = false): this {
        if (isAnimationsDisabled()) {
            return this;
        }
        if (!disableChildrenAnimation) {
            this.isActive = elements && elements.length > 0;
            if (!this.isActive) {
                return this;
            }
        }
        // all containers in one timeline and each header and list has its own timeline
        this.autoplayInTimelineNum = 3 * elements.length - elements.length;
        let order = 1;
        try {
            let timeline = new TimelineMax();
            let from = { y: window.innerHeight };
            let to = { ease: Expo.easeOut, y: 0 };
            timeline.delay(0.1).staggerFromTo(elements, 0.5, from, to, 0.1, 0);
            this.clean().addTimeline(timeline, 0, order);
            return this;
        } catch (e) {
            return this;
        }
    }

    instantPlay(): Promise<any> {
        if (!isAnimationsDisabled()) {
            this.stop().play();
        }
        return new Promise((resolve) => (this.onComplete = resolve));
    }

    addHeaderElement(el: Element): this {
        if (!this.isActive || isAnimationsDisabled()) {
            return this;
        }
        if (!el) {
            // decrement number of expected timelines to auto-play
            this.autoplayInTimelineNum--;
            return this;
        }
        try {
            let order = 2;
            let timeline = new TimelineMax();
            timeline.fromTo(el, 0.1, { x: -15, autoAlpha: 0 }, { x: 0, autoAlpha: 1 });
            this.addTimeline(timeline, -0.4, order);
            return this;
        } catch (e) {
            return this;
        }
    }

    addListElement(el: Element): this {
        if (!this.isActive || isAnimationsDisabled()) {
            return this;
        }
        if (!el) {
            // decrement number of expected timelines to auto-play
            this.autoplayInTimelineNum--;
            return this;
        }
        try {
            let order = 3;
            let timeline = new TimelineMax();
            timeline.fromTo(el, 0.4, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 });
            this.addTimeline(timeline, -0.2, order);
            return this;
        } catch (e) {
            return this;
        }
    }
}

// dashboardAnimation singleton
export const dashboardAnimation = new DashboardGsapAnimation();

export class HorizontalSlidesAnimation extends Gsap {
    // prevent several time animation play at the same time
    private updateTimeout;
    private done = false;

    addElements(elements: NodeList) {
        if (!elements || !elements.length || this.done || isAnimationsDisabled()) {
            return;
        }
        if (this.updateTimeout) {
            clearInterval(this.updateTimeout);
            super.clean();
        }
        try {
            let timeline = new TimelineMax();
            let from = { x: window.innerWidth, opacity: 1 };
            let to = { x: 5, ease: Expo.easeOut };
            timeline.delay(0.1).staggerFromTo(Array.from(elements), 0.6, from, to, 0.1);
            this.addTimeline(timeline);
        } catch (e) { }
        this.updateTimeout = setTimeout(() => {
            this.play();
            this.updateTimeout = null;
            this.done = true;
        }, 100);
    }
}
// export const horizontalSlidesAnimation = new HorizontalSlidesAnimation();

export class LoginFocusAnimation extends Gsap {
    addContainer(el: Element): this {
        if (isAnimationsDisabled()) {
            return this;
        }
        let logoEl = el.querySelector('.logo');
        let textEl = el.querySelector('.text');

        if (!el || !logoEl || !textEl) {
            return this;
        }

        try {
            let timeline = new TimelineMax();
            timeline.delay(0.1);
            timeline.add('start');
            timeline.to(el, 0.2, { height: 80, ease: Expo.easeOut }, 'start');
            timeline.fromTo(logoEl, 0.2, { opacity: 1, y: 0 }, { opacity: 0, y: -20, ease: Expo.easeOut }, 'start');
            timeline.fromTo(textEl, 0.2, { opacity: 0, y: 20 }, { opacity: 1, ease: Expo.easeOut }, 'start');
            this.addTimeline(timeline);
            return this;
        } catch (e) {
            return this;
        }
    }

    playFocus(): this {
        if (!isAnimationsDisabled()) {
            this.play();
        }
        return this;
    }

    playBlur(): this {
        if (!isAnimationsDisabled()) {
            this.reverse();
        }
        return this;
    }
}

export function slideXEnterAnimation(element: Element, duration: number = 0.3): Promise<void> {
    if (isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        let from = {
            x: window.innerWidth
        };
        let to = {
            x: 0,
            ease: Power3.easeOut,
            onComplete: resolve,
            lazy: true
        };
        TweenLite.fromTo(element, duration, from, to);
    });
}

export function slideXLeaveAnimation(element: Element, duration: number = 0.3): Promise<void> {
    if (isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        let to = {
            x: window.innerWidth,
            ease: Power1.easeIn,
            onComplete: resolve,
            lazy: true
        };
        TweenLite.to(element, duration, to);
    });
}

export function slideYEnterAnimation(element: Element, duration: number = 0.3): Promise<void> {
    if (isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        let from = {
            y: window.innerHeight
        };
        let to = {
            y: 0,
            ease: Power3.easeOut,
            onComplete: resolve,
            lazy: true
        };
        TweenLite.fromTo(element, duration, from, to);
    });
}

export function slideYLeaveAnimation(element: Element, duration: number = 0.3): Promise<void> {
    if (isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        let to = {
            y: window.innerHeight,
            ease: Power1.easeIn,
            onComplete: resolve,
            lazy: true
        };
        TweenLite.to(element, duration, to);
    });
}

function fadeAnimation(element: Element, opacity: number = 1, duration: number = 0.3): Promise<void> {
    return new Promise((resolve) => {
        let from = {
            opacity: opacity > 0 ? 0 : 1
        };
        let to = {
            opacity,
            onComplete: resolve,
            lazy: true
        };
        TweenLite.fromTo(element, duration, from, to);
    });
}

export function fadeEnterAnimation(element: Element, duration: number = 0.3): Promise<void> {
    if (isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return fadeAnimation(element, 1, duration);
}

// tslint:disable-next-line:no-identical-functions
export function fadeLeaveAnimation(element: Element, duration: number = 0.3): Promise<void> {
    if (isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return fadeAnimation(element, 0, duration);
}

export function bounceAnimation(element): Promise<void> {
    if (!element || isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        TweenMax.from(element, 1.5, { scale: 0.95, repeat: 0, ease: Elastic.easeOut.config(10, 0.3), onComplete: resolve });
    });
}

export function staggerBounceAnimation(elements: Element[]): TimelineMax {
    if (!elements || !elements.length || isAnimationsDisabled()) {
        return;
    }
    try {
        let timeline = new TimelineMax();
        let bounce = TweenMax.staggerFrom(elements, 1.2, { scale: 0.99, ease: Elastic.easeOut.config(7, 0.2) }, 0.05);
        timeline.add(bounce);
        return timeline;
    } catch (e) { }
}

export function rippleAnimation(element, e, div) {
    if (isAnimationsDisabled()) {
        return Promise.resolve();
    }
    return new Promise(() => {
        let circle = div;
        let rect = element.getBoundingClientRect();
        let d = Math.max(rect.width, rect.height);
        TweenLite.to(circle, 0, { css: { height: d, width: d } });
        let x = e.pageX - rect.x - circle.clientWidth / 2;
        let y = e.pageY - rect.y - circle.clientHeight / 2;
        let timeline = new TimelineMax();
        timeline
            .to(circle, 0, { top: y, left: x, transform: 'scale(0)', opacity: 1, display: 'block' })
            .to(circle, 3, {
                top: y,
                left: x,
                transform: 'scale(2)',
                ease: Expo.easeOut,
                opacity: 0,
                display: 'none'
            });
    });
}
