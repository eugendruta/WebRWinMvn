package websockets;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import util.MyLogger;
import websockets.SocketMessage.MessageDecoder;
import websockets.SocketMessage.MessageEncoder;

@ServerEndpoint(value = "/websocket", encoders = {MessageEncoder.class}, decoders = {MessageDecoder.class})
public class MyServerEndpoint {

  private static final String className = "MyServerEndpoint";

  private static final Set<Session> sessions
          = Collections.synchronizedSet(new HashSet<Session>());

  @OnOpen
  public void onOpen(Session session) {
    MyLogger.log(className, "onOpen()");
    sessions.add(session);
  }

  @OnClose
  public void onClose(Session session) {
    MyLogger.log(className, "onClose()");
    sessions.remove(session);
  }

  @OnMessage
  public void onMessage(SocketMessage message, Session client) throws IOException, EncodeException {
    MyLogger.log(className, "onMessage(): username: " + message.getUsername()
            + "; message: " + message.getMessage());
    //message.setMessage("Meldung vom ServerEndpoint");
    //message.setUsername("Hanno");
//    for (Session session : sessions) {
//      session.getBasicRemote().sendObject(message);
//    }
  }

  public static void sendMessage(SocketMessage message) throws IOException, EncodeException {
    System.out.println(className + ": sendMessage(): username: " + message.getUsername()
            + "; message: " + message.getMessage());
    for (Session session : sessions) {
      session.getBasicRemote().sendObject(message);
    }
  }

}
