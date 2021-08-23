import * as types from "./message";

import { VNode } from "vue";
import Vuetify, { VuetifyPreset } from "vuetify";

const presetIcon: {
  [key: string]: string;
} = {
  success: "mdi-checkbox-marked-circle",
  warning: "mdi-alert-circle",
  info: "mdi-information",
  error: "mdi-close-circle",
}

export class DefaultMessageOption implements types.MessageOption {
  top: boolean = true;
  bottom: boolean = false;
  left: boolean = false;
  right: boolean = false;
  timeout: number = 3000;

  // 隐藏后从树中移除
  autoRemove: boolean = true;
  // 取消按钮文案
  closeButtonContent: string = "";
  // 间距
  offsetTop: number = 10;
}

export function componentProps(props: types.InitOption) {
  const newProps = Object.assign({}, props);
  const keys: types.CustomParameter[] = ['autoRemove', 'closeButtonContent', 'offsetTop', 'appendTo', 'message', 'class', 'autoTransitionSetting'];

  keys.forEach(key => {
    if (newProps[key] !== void 0) {
      delete newProps[key];
    }
  })

  return newProps;
}

export function getOption(
  option?: types.MessageOption | types.MessageType,
  type?: string
): types.MessageOption {
  if (!option) return {};

  if (isString(option) || isVNode(option)) {
    option = { message: option };
  }

  if (type && !(option as types.MessageOption).color) {
    (option as types.MessageOption).color = type;
  }

  return option as types.MessageOption;
}

function isString(any: any): any is string {
  return typeof any === "string";
}

export function hasOwn(object: Object, key: string) {
  return Object.hasOwnProperty.call(object, key);
}

export function isVNode(value: any): value is VNode {
  if (!value || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  if (!proto || !proto.constructor) return false;
  return (
    proto.constructor.name.toLowerCase() === "vnode" &&
    hasOwn(value, "isRootInsert")
  );
}

function getAllTransitionTypes() {
  const values = ["fab", "fade", "scale"];
  const spec = ["scroll", "slide"];

  spec.forEach((val) => {
    values.push(`${val}-x`);
    values.push(`${val}-y`);
    values.push(`${val}-x-reverse`);
    values.push(`${val}-y-reverse`);
  });

  return values.map((val) => `${val}-transition`);
}

const transitionTypes = getAllTransitionTypes();

export function getTransition(index?: number) {
  const len = transitionTypes.length;
  if (index === void 0) {
    index = Math.floor(Math.random() * len);
  } else if (index < 0) {
    index = 0;
  } else if (index >= len) {
    index = len - 1;
  }

  return transitionTypes[index];
}

export function appendCss() {
  const style = document.createElement('style');
  style.innerText = '.margin-top-animation { transition: top .15s linear }'
  document.head.appendChild(style);
}

export function getMessageIcon(color?: string, icon?: string | VNode, customPresetIcon?: types.PresetIcon) {
  if (icon) return icon;

  if (icon === '') {
    // 表示用户不希望使用字体图标
    return void 0;
  }

  color = (color || '').toLowerCase();
  return (customPresetIcon || {})[color] || presetIcon[color];
}

let vuetifyInstance: Vuetify;
export function getVuetifyInstance(instance?: Vuetify, preset?: VuetifyPreset) {
  if (vuetifyInstance) return vuetifyInstance;

  if (instance) {
    return vuetifyInstance = instance
  }

  console.log("preset", preset);
  return vuetifyInstance = new Vuetify(preset || {});
}

export function setVuetifyInstance(instance: Vuetify) {
  if (!instance || !instance.constructor || instance.constructor.name !== "Vuetify") {
    console.warn("[vuetify-message-snackbar]: invalid vuetify instance");
    return false;
  }
  vuetifyInstance = instance;
  return true;
}
