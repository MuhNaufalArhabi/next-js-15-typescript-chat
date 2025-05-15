import React from "react";

type Props = {onSendMessage: (message: string) => void};

export default function ChatForm({onSendMessage}: Props) {
  const [message, setMessage] = React.useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 border-2 border-gray-200 py-2 rounded-lg focus:outline-none"
        placeholder="Type your message here..."
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Send
      </button>
    </form>
  );
}
