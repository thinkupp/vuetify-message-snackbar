import { VNode } from "vue";
import * as types from "./message";
import { getTransition } from "./util";

// 实现链式调用
export default class OptionHandle implements types.MessageOptionHandle {
  private option: types.MessageOption = {};
  private autoTransitionSetting: boolean;
  private transitionIsAutoSetting: boolean = false;
  private pool: {[name: string]: types.MessageOption} = {};

  constructor(autoTransitionSetting?: boolean) {
    if (autoTransitionSetting === void 0) {
      autoTransitionSetting = true;
    }
    this.autoTransitionSetting = !!autoTransitionSetting;
  }

  /* 消息位置相关 */
  public top() {
    this.initDirection();
    this.option.top = true;
    this.setTransitionByPosition('top');

    return this;
  }

  public topLeft() {
    this.initDirection();
    this.option.top = true;
    this.option.left = true;
    this.setTransitionByPosition('topLeft');

    return this;
  }

  public topRight() {
    this.initDirection();
    this.option.top = true;
    this.option.right = true;
    this.setTransitionByPosition('topRight');

    return this;
  }

  public bottom() {
    this.initDirection();
    this.option.bottom = true;
    this.setTransitionByPosition('bottom');

    return this;
  }

  public bottomLeft() {
    this.initDirection();
    this.option.bottom = true;
    this.option.left = true;
    this.setTransitionByPosition('bottomLeft');

    return this;
  }

  public bottomRight() {
    this.initDirection();
    this.option.bottom = true;
    this.option.right = true;
    this.setTransitionByPosition('bottomRight');

    return this;
  }

  /* only boolean */
  public absolute(value?: boolean) {
    return this.setBoolean("absolute", value);
  }

  public app(value?: boolean) {
    return this.setBoolean("app", value);
  }

  public centered(value?: boolean) {
    return this.setBoolean("centered", value);
  }

  public dark(value?: boolean) {
    return this.setBoolean("dark", value);
  }

  public light(value?: boolean) {
    return this.setBoolean("light", value);
  }

  public "multi-line"(value?: boolean) {
    return this.multiLine(value);
  }

  public multiLine(value?: boolean) {
    return this.setBoolean("multi-line", value);
  }

  public outlined(value?: boolean) {
    return this.setBoolean("outlined", value);
  }

  public shaped(value?: boolean) {
    return this.setBoolean("shaped", value);
  }

  public text(value?: boolean) {
    return this.setBoolean("text", value);
  }

  public tile(value?: boolean) {
    return this.setBoolean("tile", value);
  }

  public vertical(value?: boolean) {
    return this.setBoolean("vertical", value);
  }

  public autoRemove(value?: boolean) {
    return this.setBoolean("autoRemove", value);
  }

  /* other */
  public color(value: string) {
    this.option.color = value;
    return this;
  }

  public "content-class"(value: string) {
    return this.contentClass(value);
  }

  public contentClass(value: string) {
    this.option["content-class"] = value;
    return this;
  }

  public elevation(value: number | string) {
    this.option.elevation = value;
    return this;
  }

  public height(value: number | string) {
    this.option.height = value;
    return this;
  }

  public maxHeight(value: number | string) {
    this.option["max-height"] = value;
    return this;
  }

  public "max-height"(value: number | string) {
    return this.maxHeight(value);
  }

  public maxWidth(value: number | string) {
    this.option["max-width"] = value;
    return this;
  }

  public "max-width"(value: number | string) {
    return this.maxWidth(value);
  }

  public rounded(value: boolean | string) {
    this.option.rounded = value;
    return this;
  }

  public tag(value: string) {
    this.option.tag = value;
    return this;
  }

  public timeout(value: number | string) {
    this.option.timeout = value;
    return this;
  }

  public transition(value?: boolean | string) {
    if (value === void 0) {
      value = getTransition();
    }

    this.transitionIsAutoSetting = false;
    this.option.transition = value;
    return this;
  }

  public width(value: number | string) {
    this.option.width = value;
    return this;
  }

  public offsetTop(value: number) {
    this.option.offsetTop = value;
    return this;
  }

  /* 自定义 */
  public closeButtonContent(value: string) {
    this.option.closeButtonContent = value;
    return this;
  }

  public getOption() {
    const option = this.option;
    this.option = {};
    return option;
  }

  public save(name: string) {
    const option = this.getOption();
    this.pool[name] = option;
    this.option = option;
    return this;
  }

  public read(name: string) {
    this.option = this.pool[name];
    return this;
  }

  public messageIcon(icon: string | VNode) {
    this.option.messageIcon = icon || '';
    return this;
  }

  private initDirection() {
    const option = this.option;
    option.top = false;
    option.left = false;
    option.right = false;
    option.bottom = false;
  }

  private setBoolean(key: types.onlyBooleanKey, value?: boolean) {
    if (value === void 0) {
      value = true;
    }
    this.option[key] = value;

    return this;
  }

  private setTransitionByPosition(position: string) {
    if (this.option.transition && !this.transitionIsAutoSetting || !this.autoTransitionSetting) {
      return;
    }

    const left = 'slide-x';
    const right = 'slide-x-reverse';

    const map: {[position: string]: string} = {
      top: 'scroll-y',
      topLeft: left,
      topRight: right,
      bottom: 'scroll-y-reverse',
      bottomLeft: left,
      bottomRight: right
    }

    this.transitionIsAutoSetting = true;
    this.option.transition = map[position] + '-transition';
  }
}
