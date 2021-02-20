import * as types from "./message";

let pElement: Element = document.documentElement;

export default class MessageQueueManager implements types.MessageQueueManager {
  static DEFAULT_OFFSET_TOP = 20;

  static messageQueue: types.MessageQueue = {
    top: [],
    topLeft: [],
    topRight: [],
    bottom: [],
    bottomLeft: [],
    bottomRight: [],
  };

  static closeAll() {
    const keys: types.MessagePosition[] = Object.keys(
      MessageQueueManager.messageQueue
    ) as types.MessagePosition[];
    keys.forEach((key: types.MessagePosition) => {
      MessageQueueManager.messageQueue[key].forEach((instance: any) => {
        instance.close(true);
      });
    });
  }

  instance: any;
  messageConfig: types.MessageOption;
  element: HTMLElement | Element = pElement;
  isCloseAll: boolean = false;

  appendTo?: string | Element;

  constructor(instance: any, appendTo?: string | Element) {
    this.instance = instance;
    this.messageConfig = instance.messageConfig;
    this.appendTo = appendTo;

    this.setOffsetTop();
    this.mount();
  }

  public destroy() {
    let flag = false;
    let height: number = 0;
    const queue = this.getQueue();

    for (let i = 0; i < queue.length; i++) {
      const $el: HTMLElement = queue[i].$el;
      const $child: HTMLElement = $el.firstElementChild as HTMLElement;

      if (queue[i] === this.instance) {
        const isCloseAll = queue[i].isCloseAll;
        queue.splice(i, 1);
        this.remove();
        if (isCloseAll) return;
        flag = true;
        i--;
        // 移出的元素框不可参与高度计算 所以跳出本次循环
        continue;
      }

      if (flag) {
        let _height = height;
        if (!this.messageInTop()) {
          _height = -height;
        }

        $el.style.marginTop = _height + "px";
      }
      height +=
        $child.offsetHeight + (queue[i].messageConfig.offsetTop as number);
    }
  }

  private mount() {
    const instance = this.instance;
    instance.$mount();

    let marginTop: number = 0;
    const queue = this.getQueue();

    queue.forEach((item: any) => {
      marginTop +=
        item.$el.firstElementChild.offsetHeight + item.messageConfig.offsetTop;
    });

    if (!this.messageInTop()) {
      marginTop = -marginTop;
    }

    instance.$el.style.marginTop = marginTop + "px";

    this.append();

    queue.push(instance);
  }

  private append() {
    this.setAppendToElement();
    this.element.appendChild(this.instance.$el);
  }

  private remove() {
    if (this.messageConfig.autoRemove) {
      setTimeout(() => {
        this.element.removeChild(this.instance.$el);
      }, 500);
    }
  }

  private getPosition(): types.MessagePosition {
    const { top, left, right } = this.messageConfig;
    let ret: string = top ? "top" : "bottom";

    if (right) {
      ret += "Right";
    } else if (left) {
      ret += "Left";
    }

    return ret as types.MessagePosition;
  }

  private getQueue(): any[] {
    const position = this.getPosition();
    return MessageQueueManager.messageQueue[position];
  }

  private setOffsetTop() {
    const { offsetTop } = this.messageConfig;
    let _offsetTop = offsetTop;

    if (
      offsetTop === void 0 ||
      offsetTop === null ||
      isNaN(Number(offsetTop))
    ) {
      _offsetTop = MessageQueueManager.DEFAULT_OFFSET_TOP;
    } else if (typeof offsetTop !== "number") {
      _offsetTop = Number(offsetTop);
    }

    this.messageConfig.offsetTop = _offsetTop as number;
  }

  private messageInTop() {
    return this.messageConfig.top;
  }

  private setAppendToElement() {
    if (
      pElement !== document.documentElement &&
      pElement !== document.body &&
      document.documentElement.contains(pElement)
    ) {
      return;
    }
    let dom;
    const appendTo = this.appendTo;
    if (appendTo instanceof Element) {
      dom = appendTo;
    } else if (typeof appendTo === "string") {
      const _dom = document.querySelector(appendTo);
      if (_dom) dom = _dom;
    } else {
      dom = document.querySelector("#app.v-application") || document.body;
    }
    if (dom) {
      this.element = pElement = dom;
    }
  }
}
