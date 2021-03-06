import { $Component } from "@mptool/enhance";
import type { PropType } from "@mptool/enhance";
import type { ImageComponentConfig } from "../../../../typings";

$Component({
  properties: {
    /** 图片组件配置 */
    config: {
      type: Object as PropType<ImageComponentConfig>,
      required: true,
    },

    /** 展示图片列表 */
    images: {
      type: Array,
      default: [] as string[],
    },
  },

  methods: {
    /** 图片加载完成 */
    load(): void {
      this.setData({ loaded: true });
    },

    /** 图片加载出错 */
    error(): void {
      this.setData({ error: true });

      console.warn(`${this.data.config.src}图片加载失败`);
      wx.reportMonitor("10", 1);
    },

    /** 进行图片预览 */
    view(): void {
      const current = this.data.config.res || this.data.config.src;

      wx.previewImage({
        current,
        urls: this.data.images.length === 0 ? [current] : this.data.images,
      });
    },
  },
});
