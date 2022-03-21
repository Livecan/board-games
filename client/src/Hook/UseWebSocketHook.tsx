import React, { useEffect } from "react";

const useWebSocket = (
  url: string,
  receiveData: (message: Object) => void,
  firstMessage?: Object
): [sendData: (message: Object) => void, close: () => void] => {
  const ws = new WebSocket(url);
  useEffect(() => {
    ws.addEventListener("message", (e: MessageEvent) => {
      let data = JSON.parse(e.data);
      console.log(data);
      receiveData(data);
    });
    ws.addEventListener("open", (e: Event) => {
      if (firstMessage != null) {
        ws.send(JSON.stringify(firstMessage));
      }
    });
    return () => ws.close();
  }, []);

  return [
    (message: Object) => ws.send(JSON.stringify(message)),
    () => ws.close(),
  ];
};

export default useWebSocket;
