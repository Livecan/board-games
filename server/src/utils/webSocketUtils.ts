import { authenticateToken } from "../service/authentication.service";

interface PublishMethod {
  (data: any): void | any;
}

/**
 * Establishes a WebSocket connection and subscribes it to messages for this url.
 *
 * Established a WebSocket connection. The first message is a JSON Object
 * containing token property. After successful authorization, the server sends
 * {msg: "authorized"}. At this point the client is subscribed to updates and
 * the server listens to following messages.
 *
 * @param onIncoming
 *   Handles client's messages.
 * @param onOutcoming
 *   Handles updating this client. The parameter is received from currently
 *   updating client onMessage handler.
 * @param config
 */
const establishWebSocketConnection = (
  onIncoming: (req: any, data: any, outData: PublishMethod) => void,
  onOutcoming: PublishMethod = () => null,
  config: {
    ws: WebSocket;
    req: Request | (Request & { user: any });
    publisherSubscriber: PubSubJS.Base;
    skipAuthentication: Boolean;
  }
) => {
  const topic = config.req.url;
  config.ws.on("message", async (msg: string) => {
    const data = JSON.parse(msg);
    // If user info not present in req object, need to authenticate
    if (!config.skipAuthentication && config.req?.user?.subscriptionToken == null) {
      try {
        // @todo Decide if somehow move the authentication out of here or maybe
        // have a parameter of an authentication method
        await authenticateToken(data.token, config.req);
        // after successful authentication subscribe to this channel
        const subscriptionToken = config.publisherSubscriber.subscribe(
          config.req.url,
          // A subscriber received the data process by onPublish.
          // WebSocket does not accept JSON objects.
          (topic, data) =>
            config.ws.send(JSON.stringify(onOutcoming(data)))
        );
        config.req.user.subscriptionToken = subscriptionToken;
        config.ws.send(JSON.stringify({ msg: "authorized" }));
      } catch (e) {
        config.ws.close(4000, "Authentication Failed");
      }
    }
    // If user is authenticated, then message is processed by onMessage.
    // OnMessage can call the given publisher function to notify all subscribers.
    else {
      onIncoming(config.req, data, (data) => {
        console.log(data);
        config.publisherSubscriber.publish(topic, data);
      });
    }

    // When this websocket is closed, needs to unsubscribe from updates.
    config.ws.on("close", () => {
      config.publisherSubscriber.unsubscribe(
        config.req.user?.subscriptionToken
      );
      console.log(`Unsubscribe: ${config.req.user?.subscriptionToken}`);
    });
  });
};

export { establishWebSocketConnection };
