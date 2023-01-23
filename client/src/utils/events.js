export const isUserEvent = (message) => {
  const event = JSON.parse(message.data);
  return event.type === "userevent";
};

export const isDocumentEvent = (message) => {
  const event = JSON.parse(message.data);
  return event.type === "contentchange";
}
