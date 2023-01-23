import { DefaultEditor } from "react-simple-wysiwyg";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "../constants/api";
import { isDocumentEvent } from "../utils/events";

export const Editor = () => {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
    share: true,
    filter: isDocumentEvent,
  });

  const html = lastJsonMessage?.data.editorContent || "";

  const handleHtmlChange = (e) => {
    sendJsonMessage({
      type: "contentchange",
      content: e.target.value,
    });
  };

  return <DefaultEditor value={html} onChange={handleHtmlChange} />;
};
