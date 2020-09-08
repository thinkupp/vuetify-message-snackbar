import Vue, { CreateElement } from "vue";
import * as types from "./message";
import { isVNode, componentProps } from "./util";
import MessageQueueManager from "./manager";
import Vuetify from "vuetify";

function createComponent(messageConfig: types.MessageOption) {
  return Vue.extend({
    data() {
      (this as any).messageConfig = messageConfig;
      return {
        value: false,
        isCloseAll: false
      };
    },

    vuetify: new Vuetify(),

    methods: {
      close(isCloseAll?: boolean) {
        this.value = false;
        this.isCloseAll = typeof isCloseAll === 'boolean' ? isCloseAll : false;
      },

      getChildren(createElement: CreateElement) {
        const { message, closeButtonContent } = messageConfig;
        const children = [this.getMessage(message)];

        if (closeButtonContent) {
          children.push(this.getCloseButton(createElement, closeButtonContent));
        }

        return children;
      },

      getMessage(message?: types.MessageType) {
        return message;
      },

      getCloseButton(createElement: CreateElement, content: types.MessageType) {
        const that = this;
        if (isVNode(content)) {
          return createElement(
            "template",
            {
              slot: "action",
            },
            [content]
          );
        } else {
          return createElement(
            "v-btn",
            {
              props: {
                dark: true,
                text: true,
              },
              on: {
                click: that.close
              },
              slot: "action",
            },
            content
          );
        }
      },

      getClassName() {
        let { class: configClass } = messageConfig;

        const ret: { [className: string]: boolean } = {};

        if (typeof configClass === "string") {
          configClass = configClass.trim();
          if (configClass) {
            configClass = [configClass];
          } else {
            configClass = [];
          }
        } else if (!(configClass instanceof Array)) {
          // 没有传或者传入的类名不规范就使用默认值
          configClass = ["margin-top-animation"];
        }

        configClass.forEach((className) => {
          ret[className] = true;
        });

        return ret;
      },
    },

    watch: {
      value() {
        if (!this.value) {
          this.$emit("closed", this.isCloseAll);
        }
      },
    },

    mounted() {
      this.value = true;
    },

    render(createElement: CreateElement) {
      // 在这里调用this会导致类型推断错误，所以any
      const self = this as any;

      return createElement(
        "v-snackbar",
        {
          props: {
            ...componentProps(messageConfig),
            value: self.value,
          },
          on: {
            input(status: boolean) {
              self.value = status;
              self.$emit("input", status);
            },
          },
          class: self.getClassName(),
        },
        self.getChildren(createElement)
      );
    },
  });
}

export default function createInstance(messageConfig: types.MessageOption, appendTo?: string | Element) {
  const instance = new (createComponent(messageConfig))();

  const mqm = new MessageQueueManager(instance, appendTo);
  instance.$on("closed", function() {
    mqm.destroy();
  });
  
  return instance;
}
