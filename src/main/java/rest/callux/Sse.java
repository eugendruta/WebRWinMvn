package rest.callux;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.websocket.EncodeException;
import util.MyLogger;
import websockets.MyServerEndpoint;
import websockets.SocketMessage;

/**
 *
 * @author e.druta
 */
public class Sse extends HttpServlet {

  private final String className = this.getClass().getName();

  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    MyLogger.log(className, "ProcessRequest()");
    String result;

    //response.setContentType("text/event-stream;charset=UTF-8");    
    response.setHeader("Content-Type", "text/event-stream;charset=UTF-8");
    response.setHeader("Cache-Control", "no-cache");
    HttpSession session = request.getSession();
    session.setMaxInactiveInterval(1 * 10);

    //** Test Websockets: senden messagean Client
    SocketMessage message = new SocketMessage("Myname", "MyMeldung");
    try {
      MyServerEndpoint.sendMessage(message);
    } catch (EncodeException ex) {
      Logger.getLogger(Sse.class.getName()).log(Level.SEVERE, null, ex);
    }
    //** Test websockets

    try (PrintWriter out = response.getWriter()) {
      //The following server output sends three types of events:
      //a generic 'message' event, 'userlogon', and 'update' event:
      //Wait 5 Sek.
      try {
        Thread.sleep(5000);
      } catch (InterruptedException ex) {
        Logger.getLogger(Sse.class.getName()).log(Level.SEVERE, null, ex);
      }
      result
              = "retry: 30000\n"
              + "data: {\"time\": \"" + (new Date()).toString() + "\"}\n\n"
              + "event: userlogon\n" + "data: {\"username\": \"John123\"}\n\n"
              + "event: update\n" + "data: {\"username\": \"John123\", \"emotion\": \"happy\"}\n\n";
      System.out.println("result: " + (new Date()).toString());
      out.println(result);
    }
  }
// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">

  /**
   * Handles the HTTP <code>GET</code> method.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    processRequest(request, response);
  }

  /**
   * Handles the HTTP <code>POST</code> method.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    processRequest(request, response);
  }

  /**
   * Returns a short description of the servlet.
   *
   * @return a String containing servlet description
   */
  @Override
  public String getServletInfo() {
    return "Short description";
  }// </editor-fold>
}
