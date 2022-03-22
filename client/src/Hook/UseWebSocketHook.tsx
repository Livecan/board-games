import React, { useEffect, useState } from "react";

const useWebSocket = (
  url: string,
  receiveData: (message: Object) => void,
  firstMessage?: Object
): [sendData: (message: Object) => void, close: () => void] => {
  const [ws, setWs] = useState(null);
  useEffect(() => {
    const _ws = new WebSocket(url);
    _ws.addEventListener("message", (e: MessageEvent) => {
      let data = JSON.parse(e.data);
      console.log(data);
      receiveData(data);
    });
    _ws.addEventListener("open", (e: Event) => {
      if (firstMessage != null) {
        _ws.send(JSON.stringify(firstMessage));
      }
    });
    const onDismount = () => _ws.close();
    setWs(_ws);
    return onDismount;
  }, []);

  return [
    (message: Object) => ws.send(JSON.stringify(message)),
    () => ws.close(),
  ];
};

export default useWebSocket;
