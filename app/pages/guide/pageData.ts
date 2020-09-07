import { PageDataWithContent } from "../../../typings";

export default {
  title: "东师指南",
  grey: true,
  hidden: true,
  content: [
    {
      tag: "grid",
      header: "新生你好",
      content: [
        {
          text: "入学准备",
          color: "red",
          name: "Prepare",
          base64Icon: "prepare",
          path: "prepare/index",
        },
        {
          text: "新生报到",
          color: "orange",
          name: "Check",
          base64Icon: "check",
          path: "check/index",
        },
        {
          text: "需带物品",
          color: "blue",
          name: "Necessity",
          base64Icon: "necessity",
          path: "necessity/index",
        },
        {
          text: "入学活动",
          color: "purple",
          name: "Activity",
          base64Icon: "activity",
          path: "activity/index",
        },
        {
          text: "常见问题",
          color: "cyan",
          name: "FAQ",
          base64Icon: "faq",
          path: "faq/index",
        },
      ],
    },
    {
      tag: "grid",
      header: "学在东师",
      content: [
        {
          text: "学位",
          color: "blue",
          name: "Course",
          base64Icon: "degree",
          path: "degree/index",
        },
        {
          text: "课程",
          color: "orange",
          name: "Course",
          base64Icon: "course",
          path: "course/index",
        },
        {
          text: "学习",
          color: "red",
          name: "Study",
          base64Icon: "study",
          path: "study/index",
        },
        {
          text: "选课",
          color: "purple",
          name: "Select",
          base64Icon: "select",
          path: "select/index",
        },
        {
          text: "图书馆",
          color: "cyan",
          name: "Library",
          base64Icon: "library",
          path: "/intro/apartment/library/index",
        },
        {
          text: "考试",
          color: "olive",
          name: "Exam",
          base64Icon: "test",
          path: "exam/index",
        },
        {
          text: "教务系统",
          color: "blue",
          name: "System",
          base64Icon: "system",
          path: "system/index",
        },
      ],
    },
    {
      tag: "grid",
      header: "行在东师",
      content: [
        {
          text: "寝室",
          color: "blue",
          name: "Dorm",
          base64Icon: "dorm",
          path: "dorm/index",
        },
        {
          text: "食堂",
          color: "orange",
          name: "Dining",
          base64Icon: "dining",
          path: "dining/index",
        },
        {
          text: "校园卡",
          color: "red",
          name: "Card",
          base64Icon: "card",
          path: "card/index",
        },

        {
          text: "校园网",
          color: "purple",
          name: "Network",
          base64Icon: "network",
          path: "network/index",
        },
        {
          text: "快递",
          color: "mauve",
          name: "Express",
          base64Icon: "express",
          path: "express/index",
        },
        {
          text: "超市",
          color: "olive",
          name: "Shop",
          base64Icon: "shop",
          path: "shop/index",
        },
        {
          text: "洗浴",
          color: "red",
          name: "Bath",
          base64Icon: "bath",
          path: "bath/index",
        },
        {
          text: "生活",
          color: "orange",
          name: "Life",
          base64Icon: "life",
          path: "life/index",
        },
        {
          text: "账户",
          color: "olive",
          name: "Account",
          base64Icon: "account",
          path: "account/index",
        },
        {
          text: "SIM 卡",
          color: "purple",
          name: "SIM",
          base64Icon: "sim",
          path: "sim/index",
        },
      ],
    },
    {
      tag: "grid",
      header: "乐在东师",
      content: [
        {
          text: "学生组织",
          color: "blue",
          name: "Orgnazation",
          base64Icon: "student-org",
          path: "organization/index",
        },
        {
          text: "社团",
          color: "orange",
          name: "Association",
          base64Icon: "association",
          path: "association/index",
        },
        {
          text: "交通",
          color: "red",
          name: "Traffic",
          base64Icon: "traffic",
          path: "traffic/index",
        },
        {
          text: "吃喝玩乐",
          color: "purple",
          name: "Nearby",
          base64Icon: "nearby",
          path: "life/nearby/index",
        },
      ],
    },
    {
      tag: "grid",
      header: "乐在东师",
      content: [
        {
          text: "个人建议",
          color: "blue",
          name: "Advice",
          base64Icon: "advice",
          path: "advice/index",
        },
      ],
      footer: " ",
    },
  ],
} as PageDataWithContent;