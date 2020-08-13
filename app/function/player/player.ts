import $register = require("wxpage");
import { Lyric, PlayMode, SongDetail } from "./typings";
import { ensureJSON, getJSON } from "../../utils/file";
import { popNotice } from "../../utils/page";
import { server } from "../../utils/config";
import { tip } from "../../utils/wx";
import { AppOption } from "../../app";
const { globalData } = getApp<AppOption>();

/** 音频管理器 */
const manager = wx.getBackgroundAudioManager();

$register("music", {
  data: {
    /** 是否可以播放 */
    canplay: false,
    /** 是否正在播放 */
    playing: false,
    /** 正在播放的歌的序列号 */
    index: 0,
    /** 当前时间 */
    currentTime: 0,
    /** 歌曲总长度 */
    totalTime: 1,
    /** 当前歌曲信息 */
    currentSong: {} as any,
    /** 是否展示歌曲列表 */
    showSongList: false,
    /** 歌曲列表 */
    songList: [] as SongDetail[],
    /** 播放模式 */
    mode: "列表循环" as PlayMode,

    /** 激活的歌词序号 */
    currentLyricId: -1,
    /** 当前歌词 */
    currentLyric: "",
    /** 歌词配置 */
    lyrics: [] as Lyric[],

    /** 弹窗配置 */
    popupConfig: {
      title: "歌曲列表",
      confirm: false,
      cancel: false,
    },
  },

  state: {
    interupt: false,
  },

  onNavigate() {
    ensureJSON({
      path: "function/music/index",
      url: "resource/function/music/index",
    });
  },

  onLoad(option) {
    // 加载字体
    wx.loadFontFace({
      family: "FZSSJW",
      source: `url("${server}fonts/FZSSJW.ttf")`,
      complete: (res) => {
        console.info("宋体字体", res); // 调试
      },
    });

    const mode = wx.getStorageSync("play-mode") as PlayMode;

    if (!mode) wx.setStorageSync("play-mode", "列表循环");

    // 写入基本信息
    this.setData({
      playing: globalData.music.playing,
      mode: mode || "列表循环",

      info: globalData.info,
      darkmode: globalData.darkmode,
      indicatorColor: globalData.darkmode ? "#fff2" : "#0002",
      indicatorActiveColor: globalData.darkmode ? "#fff6" : "#0006",
      firstPage: getCurrentPages().length === 1,
    });

    getJSON({
      path: "function/music/index",
      url: "resource/function/music/index",
      success: (songList) => {
        if (option.index) globalData.music.index = Number(option.index);
        else if (option.name) {
          const name = decodeURI(option.name);

          globalData.music.index = (songList as SongDetail[]).findIndex(
            (song) => song.title === name
          );
        } else {
          const name = wx.getStorageSync("music");

          if (name)
            globalData.music.index = (songList as SongDetail[]).findIndex(
              (song) => song.title === name
            );
        }

        const { index } = globalData.music;

        const currentSong = (songList as SongDetail[])[index];

        // 写入歌曲列表与当前歌曲信息
        this.setData({
          index,
          songList: songList as SongDetail[],
          currentSong,
        });

        // 如果正在播放，设置能够播放
        if (globalData.music.playing) this.setData({ canplay: true });
        // 对音频管理器进行设置
        else {
          manager.epname = "in东师";
          manager.src = currentSong.src;
          manager.title = currentSong.title;
          manager.singer = currentSong.singer;
          manager.coverImgUrl = currentSong.cover;
        }

        this.initLyric();
      },
    });

    // 注册播放器动作
    this.managerRegister();

    if (wx.canIUse("onThemeChange")) wx.onThemeChange(this.themeChange);

    popNotice("music");
  },

  onShareAppMessage() {
    return {
      title: this.data.currentSong.title,
      path: `/function/player/player?name=${this.data.currentSong.title}`,
    };
  },

  onShareTimeline() {
    return {
      title: this.data.currentSong.title,
      query: { name: this.data.currentSong.title },
    };
  },

  onUnload() {
    if (wx.canIUse("onThemeChange")) wx.offThemeChange(this.themeChange);
  },

  themeChange({ theme }: WechatMiniprogram.OnThemeChangeCallbackResult) {
    this.setData({
      darkmode: theme === "dark",
      indicatorColor: theme === "dark" ? "#fff2" : "#0002",
      indicatorActiveColor: theme === "dark" ? "#fff6" : "#0006",
    });
  },

  /** 注册音乐播放器 */
  managerRegister() {
    // 能够播放 100ms 后设置可以播放
    manager.onCanplay(() => {
      console.info("Canplay"); // 调试
      this.setData({ canplay: true });
    });

    // 在相应动作时改变状态
    manager.onPlay(() => {
      this.setData({ playing: true });
      globalData.music.playing = true;
    });

    manager.onPause(() => {
      this.setData({ playing: false });
      globalData.music.playing = false;
    });

    manager.onTimeUpdate(() => {
      // 更新歌曲信息
      this.setData({
        currentTime: Math.round(manager.currentTime * 100) / 100,
        totalTime: Math.round(manager.duration * 100) / 100,
        canplay: true,
      });

      // 设置播放状态
      if (!globalData.music.playing) globalData.music.playing = true;

      this.lyric();
    });

    // 缓冲中
    manager.onWaiting(() => {
      console.warn("waiting");
      this.setData({ canplay: false });
    });

    manager.onPrev(() => {
      this.previous();
    });

    // 歌曲播放结束
    manager.onEnded(() => {
      this.end();
      console.log("end");
    });

    // 歌曲播放结束
    manager.onStop(() => {
      console.log("用户通过浮窗中止");
      this.setData({ currentTime: 0, playing: false });
      this.state.interupt = true;
    });

    manager.onNext(() => {
      this.next();
    });

    manager.onError(({ errMsg }) => {
      tip("获取音乐出错，请稍后重试");
      console.error(`Manager: ${errMsg}`);
    });
  },

  initLyric() {
    const { lyric } = this.data.currentSong;

    if (lyric)
      getJSON({
        path: `function/music/${lyric}`,
        url: `resource/function/music/${lyric}`,
        success: (lyrics) => {
          this.setData({
            currentLyric: "",
            currentLyricId: -1,
            lyrics: lyrics as Lyric[],
          });
        },
      });
    else
      this.setData({
        currentLyric: "",
        currentLyricId: -1,
        lyrics: [] as Lyric[],
      });
  },

  /** 设置歌词 */
  lyric() {
    const { currentLyricId, lyrics } = this.data;
    let id = 0;

    /** 如果当前时间大于本项且本项不是最后一项 */
    while (id < lyrics.length && this.data.currentTime > lyrics[id].time)
      id += 1;

    if (currentLyricId !== id - 1 && id !== 0)
      this.setData({
        currentLyricId: id - 1,
        currentLyric: lyrics[id - 1].text || " ",
      });
  },

  loadCover(event: WXEvent.ImageLoad) {
    // 加载封面
    if (event.type === "load") this.setData({ coverLoad: true });
  },

  /** 播放与暂停 */
  play() {
    if (this.state.interupt) {
      manager.src = this.data.currentSong.src;
      this.state.interupt = false;
    } else if (this.data.playing) manager.pause();
    else manager.play();
  },

  /** 拖拽进度 */
  drag(event: WXEvent.SliderChange) {
    if (this.state.interupt) {
      manager.src = this.data.currentSong.src;
      this.state.interupt = false;
    }

    if (event.type === "change") {
      manager.seek(event.detail.value / 100);

      this.setData({ currentTime: event.detail.value / 100, canplay: false });
    }
  },

  end() {
    // 结束动作
    let index = this.data.index as number | string;
    const total = this.data.songList.length;
    let temp;

    switch (this.data.mode) {
      case "随机播放":
        do temp = Math.round(Math.random() * total - 0.5);
        while (index === temp);
        index = temp;
        break;
      case "顺序播放":
        index =
          (index as number) + 1 === total ? "stop" : (index as number) + 1;
        tip("播放完毕");
        break;
      case "单曲循环":
        break;
      case "列表循环":
      default:
        index = (index as number) + 1 === total ? 0 : (index as number) + 1;
    }
    this.switchSong(index);
  },

  /** 下一曲动作 */
  next() {
    let index = this.data.index as number | string;
    const total = this.data.songList.length;
    let temp;

    switch (this.data.mode) {
      case "随机播放":
        do temp = Math.round(Math.random() * total - 0.5);
        while (index === temp);
        index = temp;
        break;
      case "顺序播放":
        if ((index as number) + 1 === total) {
          index = "nothing";
          tip("已是最后一曲");
        } else index = (index as number) + 1;
        break;
      case "单曲循环":
      case "列表循环":
      default:
        index = (index as number) + 1 === total ? 0 : (index as number) + 1;
    }
    this.switchSong(index);
  },

  /** 上一曲动作 */
  previous() {
    let index = this.data.index as number | string;
    const { length: total } = this.data.songList;
    let temp;

    switch (this.data.mode) {
      case "随机播放":
        do temp = Math.round(Math.random() * total - 0.5);
        while (index === temp);
        index = temp;
        break;
      case "顺序播放":
        if (index === 0) {
          index = "nothing";
          tip("已是第一曲");
        } else index = (index as number) - 1;
        break;
      case "单曲循环":
      case "列表循环":
      default:
        index = index === 0 ? total - 1 : (index as number) - 1;
    }
    this.switchSong(index);
  },

  /** 切换歌曲 */
  switchSong(index: string | number) {
    if (index === "stop") {
      this.setData({
        playing: false,
        canPlay: false,
      });

      manager.stop();
      // 正常赋值
    } else if (index !== "nothing") {
      const currentSong = this.data.songList[index as number];

      this.setData({
        currentLyricId: -1,
        index: index as number,
        currentSong,
        playing: false,
        canPlay: false,
      });

      manager.src = currentSong.src;
      manager.title = currentSong.title;
      manager.singer = currentSong.singer;
      manager.coverImgUrl = currentSong.cover;
      globalData.music.index = Number(index);

      this.initLyric();

      wx.setStorageSync("music", currentSong.title);
    }
  },

  /** 切换播放模式 */
  modeSwitch() {
    const modes = ["列表循环", "单曲循环", "顺序播放", "随机播放", "列表循环"];
    const mode = modes[modes.indexOf(this.data.mode) + 1] as PlayMode;

    this.setData({ mode });

    wx.setStorageSync("play-mode", mode);
    tip(`切换为${mode}模式`);
  },

  /** 切换列表显隐 */
  list() {
    this.setData({ showSongList: !this.data.showSongList });
  },

  // 点击列表具体歌曲项时触发
  change(res: WXEvent.Touch) {
    this.list();
    this.switchSong(res.currentTarget.dataset.index);
  },

  back() {
    if (getCurrentPages().length === 1) this.$switch("main");
    else this.$back();
  },
});
