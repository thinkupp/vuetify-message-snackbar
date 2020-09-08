import Vue, { VNode, PluginFunction } from "vue";

export interface MessageOption {
  // 给组件应用 position: absolute
  absolute?: boolean;

  // Respects boundaries of—and will not overlap with—other app components like v-app-bar, v-navigation-drawer, and v-footer.
  app?: boolean;

  // 将组件向底部对齐
  bottom?: boolean;

  // Positions the snackbar in the center of the screen, (x and y axis).
  centered?: boolean;

  // 将指定的颜色应用于控件 - 它可以是 material color 的名称（例如 success 或者 purple）或 css 颜色 (#033 或 rgba(255, 0, 0, 0.5))。
  // 你可以在 colors page 中找到内置类的列表。
  // color page: https://vuetifyjs.com/en/styles/colors/#material-colors
  color?: string;

  // Apply a custom class to the snackbar content
  "content-class"?: string;

  // 将暗色主题变量应用到组件。你可以在 dark themes 的 Material Design 文档中找到更多有关信息。
  // dark themes: https://material.io/design/color/dark-theme.html
  dark?: boolean;

  // 组件的海拔可接受 0 到 24 之间的值。你可以在 elevation page 浏览更多信息。
  // elevation page: https://vuetifyjs.com/en/styles/elevation/
  elevation?: number | string;

  // 设定组件的高度。
  height?: number | string;

  // 将组件向左边对齐。
  left?: boolean;

  // 为组件设置浅色主题。
  light?: boolean;

  // 设定组件的最大高度。
  "max-height"?: number | string;

  // 设定组件的最大宽度。
  "max-width"?: number | string;

  // 设定组件的最小高度
  "min-height"?: number | string;

  // 设定组件的最小宽度
  "min-width"?: number | string;

  // 使消息条具有更大的最低高度。
  "multi-line"?: boolean;

  // Removes elevation (box-shadow) and adds a thin border.
  outlined?: boolean;

  // 将组件向右边对齐。
  right?: boolean;

  // Designates the border-radius applied to the component. You can find more information on the Border Radius page.
  // Border Radius page: https://vuetifyjs.com/en/styles/border-radius/
  rounded?: boolean | string;

  // Applies a large border radius on the top left and bottom right of the card.
  shaped?: boolean;

  // 指定在根元素上使用的自定义标签。
  tag?: string;

  // 将定义的 color 应用于文本和同样的低透明度背景。
  text?: boolean;

  // Removes the component's border-radius.
  tile?: boolean;

  // 等待 Snackbars 自动隐藏的时间。使用 0 来保持永久开启。
  timeout?: number | string;

  // 将组件向顶部对齐。
  top?: boolean;

  // 设置组件转换。可以是一个 built in transitions 或者是自己自定义的。
  transition?: boolean | string;

  // 控制组件可见还是隐藏。
  // PS：目前该属性设置了无效，会被覆盖掉
  value?: any;

  // 将消息条内容堆叠在操作（按钮）之上。
  vertical?: boolean;

  // 设定组件的宽度。
  width?: number | string;

  /* 自定义扩展属性 */
  message?: string | VNode;

  // 隐藏后是否从页面中移除此元素
  // default: false
  autoRemove?: boolean;

  // 关闭按钮配置
  closeButtonContent?: string | VNode;

  // 消息与消息之间的间隔
  offsetTop?: number;
  
  // 自定义类名
  class?: string | string[];

  // 是否自动设置过渡动画
  autoTransitionSetting?: boolean;
}

export interface InitOption extends MessageOption {
  // 在哪个DOM中渲染消息条
  appendTo?: string | Element;
}

export type CustomParameter = 'message' | 'autoRemove' | 'closeButtonContent' | 'appendTo' | 'offsetTop' | 'class' | 'autoTransitionSetting';

export type MessageType = string | VNode;
interface BaseMessage {
  success(message: MessageType): MessageReturnValue;
  success(option: MessageOption): MessageReturnValue;
  info(message: MessageType): MessageReturnValue;
  info(option: MessageOption): MessageReturnValue;
  warning(message: MessageType): MessageReturnValue;
  warning(option: MessageOption): MessageReturnValue;
  error(message: MessageType): MessageReturnValue;
  error(option: MessageOption): MessageReturnValue;
  show(message: MessageType): MessageReturnValue;
  show(option: MessageOption): MessageReturnValue;
}

interface NuxtMessage extends BaseMessage, MessageOptionHandle {
  (message: MessageType): MessageReturnValue;
  (option: MessageOption): MessageReturnValue;
}

export type onlyBooleanKey =
  | "absolute"
  | "app"
  | "centered"
  | "dark"
  | "light"
  | "multi-line"
  | "outlined"
  | "shaped"
  | "text"
  | "tile"
  | "vertical"
  | "autoRemove";

export interface MessageOptionHandle {
  // position
  top(): this;
  topLeft(): this;
  topRight(): this;
  bottom(): this;
  bottomLeft(): this;
  bottomRight(): this;

  // only boolean
  absolute(value?: boolean): this;
  app(value?: boolean): this;
  centered(value?: boolean): this;
  dark(value?: boolean): this;
  light(value?: boolean): this;
  multiLine(value?: boolean): this;
  "multi-line"(value?: boolean): this;
  outlined(value?: boolean): this;
  shaped(value?: boolean): this;
  text(value?: boolean): this;
  tile(value?: boolean): this;
  vertical(value?: boolean): this;
  autoRemove(value?: boolean): this;

  // other
  color(value: string): this;
  "content-class"(value: string): this;
  contentClass(value: string): this;
  elevation(value: number | string): this;
  height(value: number | string): this;
  "max-height"(value: number | string): this;
  maxHeight(value: number | string): this;
  "max-width"(value: number | string): this;
  maxWidth(value: number | string): this;
  rounded(value: boolean | string): this;
  tag(value: string): this;
  timeout(value: number | string): this;
  transition(value?: boolean | string): this;
  width(value: number | string): this;

  // custom
  offsetTop(value: number): this;
  closeButtonContent(value: string | VNode): this;
  getOption(): MessageOption;
  save(name: string): this;
  read(name: string): this;
}

declare module "vue/types/vue" {
  interface Vue {
    $message: NuxtMessage;
  }
}

interface MessageReturnValue {
  close(): void;
  again(): void;
}
export interface message extends BaseMessage, MessageOptionHandle {
  (option: MessageOption | MessageType, type?: methodType): MessageReturnValue;
  closeAll(): void;
}

export type methodType = "success" | "error" | "warning" | "info" | "show";

export type MessagePosition =
  | "top"
  | "bottom"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

type MessageQueueItem = any[];

export type MessageQueue = {
  top: MessageQueueItem;
  topLeft: MessageQueueItem;
  topRight: MessageQueueItem;
  bottom: MessageQueueItem;
  bottomLeft: MessageQueueItem;
  bottomRight: MessageQueueItem;
};

export interface MessageQueueManager {
  instance: any;
  destroy(isCloseAll: boolean): void;
}

export interface NuxtMessageInit {
  install: PluginFunction<InitOption>
}

export default NuxtMessageInit;

declare const NuxtMessageInit: NuxtMessageInit;
