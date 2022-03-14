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
 * @param onMessage
 *   Handles client's messages.
 * @param onPublish
 *   Handles updating this client. The parameter is received from currently
 *   updating client onMessage handler.
 * @param configuration
 */
const establishWebSocketConnection = (
  onMessage: (req: any, data: any, publish: PublishMethod) => void,
  onPublish: PublishMethod = () => null,
  configuration: {
    ws: WebSocket;
    req: Request | (Request & { user: any });
    publisherSubscriber: PubSubJS.Base;
  }
) => {
  const topic = configuration.req.url;
  configuration.ws.on("message", async (msg: string) => {
    const data = JSON.parse(msg);
    // If user info not present in req object, need to authenticate
    if (configuration.req?.user?.subscriptionToken == null) {
      try {
        // @todo Decide if somehow move the authentication out of here or maybe
        // have a parameter of an authentication method
        await authenticateToken(data.token, configuration.req);
        // after successful authentication subscribe to this channel
        const subscriptionToken = configuration.publisherSubscriber.subscribe(
          configuration.req.url,
          // A subscriber received the data process by onPublish.
          // WebSocket does not accept JSON objects.
          (topic, data) =>
            configuration.ws.send(JSON.stringify(onPublish(data)))
        );
        configuration.req.user.subscriptionToken = subscriptionToken;
        configuration.ws.send(JSON.stringify({ msg: "authorized" }));
      } catch (e) {
        configuration.ws.close(4000, "Authentication Failed");
      }
    }
    // If user is authenticated, then message is processed by onMessage.
    // OnMessage can call the given publisher function to notify all subscribers.
    else {
      onMessage(req, data, (data) => {
        console.log(data);
        configuration.publisherSubscriber.publish(topic, data);
      });
    }

    // When this websocket is closed, needs to unsubscribe from updates.
    configuration.ws.on("close", () => {
      configuration.publisherSubscriber.unsubscribe(
        configuration.req.user?.subscriptionToken
      );
      console.log(`Unsubscribe: ${configuration.req.user?.subscriptionToken}`);
    });
  });
};

export { establishWebSocketConnection };
