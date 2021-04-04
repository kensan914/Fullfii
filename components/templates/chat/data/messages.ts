import { AllMessages } from "../../../types/Types.context";

const messages: AllMessages = [
  {
    messageId: "-1",
    message: "話し相手が見つかりました",
    time: new Date(2021, 4 - 1, 3, 10, 30),
    common: true,
  },
  {
    messageId: "1",
    message: "こんにちは",
    isMe: true,
    time: new Date(2021, 4 - 1, 3, 11, 30),
    common: false,
  },
  {
    messageId: "2",
    message: "はい、こんにちは",
    isMe: false,
    time: new Date(2021, 4 - 1, 3, 12, 30),
    common: false,
  },
  {
    messageId: "3",
    message: "失恋の悩みがあって、聞いていただけませんか？",
    isMe: true,
    time: new Date(2021, 4 - 1, 3, 13, 30),
    common: false,
  },
  {
    messageId: "4",
    message: "はい、喜んで。なんでも話してください。",
    isMe: false,
    time: new Date(2021, 4 - 1, 3, 14, 30),
    common: false,
  },
  {
    messageId: "11",
    message: "こんにちは1",
    isMe: true,
    time: new Date(2021, 4 - 1, 3, 11, 30),
    common: false,
  },
  {
    messageId: "12",
    message: "はい、こんにちは1",
    isMe: false,
    time: new Date(2021, 4 - 1, 3, 12, 30),
    common: false,
  },
  {
    messageId: "13",
    message: "失恋の悩みがあって、聞いていただけませんか？1",
    isMe: true,
    time: new Date(2021, 4 - 1, 3, 13, 30),
    common: false,
  },
  {
    messageId: "13.2",
    message: "失恋の悩みがあって、聞いていただけませんか？??????????????????",
    isMe: true,
    time: new Date(2021, 4 - 1, 3, 13, 30),
    common: false,
  },
  {
    messageId: "14",
    message: "はい、喜んで。なんでも話してください。1",
    isMe: false,
    time: new Date(2021, 4 - 1, 3, 14, 30),
    common: false,
  },
];

export default messages;
