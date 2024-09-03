import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
};
const dummyMessages: Message[] = [
  {
    id: "1",
    user: {
      name: "Alice",
      avatar: "https://ui-avatars.com/api/?name=Alice+Jane",
    },
    content: "Hey everyone! Excited about this new token launch!",
    timestamp: new Date("2023-04-10T10:00:00"),
  },
  {
    id: "2",
    user: { name: "Bob", avatar: "https://ui-avatars.com/api/?name=Bob+Chan" },
    content: "Same here! The tokenomics look promising.",
    timestamp: new Date("2023-04-10T10:05:00"),
  },
  {
    id: "3",
    user: {
      name: "Charlie",
      avatar: "https://ui-avatars.com/api/?name=Charlie+Queen",
    },
    content:
      "I've been researching this project for weeks. It's got real potential!",
    timestamp: new Date("2023-04-10T10:10:00"),
  },
  {
    id: "4",
    user: {
      name: "Delta",
      avatar: "https://ui-avatars.com/api/?name=Delta+Smith",
    },
    content:
      "The team behind it seems really solid. That's always a good sign.",
    timestamp: new Date("2023-04-10T10:15:00"),
  },
  {
    id: "5",
    user: {
      name: "Echo",
      avatar: "https://ui-avatars.com/api/?name=Echo+Johnson",
    },
    content: "I'm curious about their roadmap. Anyone have more details?",
    timestamp: new Date("2023-04-10T10:20:00"),
  },
];

const ChatHeader = () => (
  <div className="p-4 pb-0">
    <h2 className="text-xl font-bold text-white">Discussion</h2>
  </div>
);

type MessageComponentProps = {
  message: Message;
};
const MessageComponent = ({ message }: MessageComponentProps) => (
  <div className="flex items-start mb-4">
    <Image
      src={message.user.avatar}
      alt={message.user.name}
      width={32}
      height={32}
      className="rounded-full mr-2"
    />
    <div>
      <div className="flex items-baseline">
        <span className="font-semibold mr-2 text-white">
          {message.user.name}
        </span>
        <span className="text-xs text-gray-400">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm text-gray-300">{message.content}</p>
    </div>
  </div>
);

type DateDividerProps = {
  date: Date;
};
const DateDivider = ({ date }: DateDividerProps) => (
  <div className="flex items-center my-4">
    <div className="flex-grow border-t border-gray-700"></div>
    <span className="mx-4 text-sm text-gray-400">
      {date.toLocaleDateString()}
    </span>
    <div className="flex-grow border-t border-gray-700"></div>
  </div>
);

type MessageListProps = {
  messages: Message[];
};
const MessageList = ({ messages }: MessageListProps) => {
  let currentDate: Date | null = null;

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {messages.map((message) => {
        const messageDate = new Date(message.timestamp.toDateString());
        const showDateDivider = !currentDate || messageDate > currentDate;
        currentDate = messageDate;

        return (
          <React.Fragment key={message.id}>
            {showDateDivider && <DateDivider date={messageDate} />}
            <MessageComponent message={message} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MessageInput = () => (
  <div className="p-4">
    <div className="flex">
      <Input
        type="text"
        placeholder="Type a message..."
        className="flex-grow rounded-r-none"
      />
      <Button className="rounded-l-none">Send</Button>
    </div>
  </div>
);

type ChatGroupProps = {};
const ChatGroup = ({}: ChatGroupProps) => {
  return (
    <div className="pl-2 flex flex-col h-full bg-neutral-800 rounded-lg">
      <ChatHeader />
      <MessageList messages={dummyMessages} />
      <MessageInput />
    </div>
  );
};

export default ChatGroup;
