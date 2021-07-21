import * as types from "./message";
import createInstance from "./instance";

import { getOption, DefaultMessageOption, appendCss } from "./util";
import MessageQueueManager from "./manager";
import OptionHandle from "./attach";

import { VueConstructor } from "vue";

let cssAppendFlag: boolean;

function init(Vue: VueConstructor, globalOptions?: types.InitOption): void {
  if (!globalOptions) {
    globalOptions = {};
  }

  const types: types.methodType[] = [
    "success",
    "info",
    "warning",
    "error",
    "show",
  ];

  const message: types.message = function(
    option: types.MessageOption | string,
    type?: types.methodType
  ): any {
    if (!cssAppendFlag) {
      appendCss();
      cssAppendFlag = true;
    }

    if (type) {
      if (!types.includes(type) || type === "show") {
        type = void 0;
      }
    }

    const messageConfig = getMessageConfig();
    const instance = createInstance(messageConfig, globalOptions!.appendTo, globalOptions?.presetIcon);

    return {
      close: instance.close,
      again: () => {
        return {
          close: createInstance(messageConfig, globalOptions!.appendTo, globalOptions?.presetIcon).close,
        };
      },
    };

    function getMessageConfig() {
      return {
        ...new DefaultMessageOption(), // Default
        ...globalOptions, // Vue.use
        ...message.getOption(), // Functional
        ...getOption(option, type), // Argument
      };
    }
  } as types.message;

  Object.setPrototypeOf(
    message,
    new OptionHandle(globalOptions.autoTransitionSetting)
  );

  types.forEach((type: types.methodType) => {
    message[type] = (option: types.MessageOption | types.MessageType) =>
      message(option, type);
  });

  message.closeAll = MessageQueueManager.closeAll;

  Vue.prototype.$message = message;
}

export default {
  install: init
};
