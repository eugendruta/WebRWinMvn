/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rest.callux;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import util.MyLogger;

/**
 *
 * @author e.druta
 */
public class Sse extends HttpServlet {

  private final String className = this.getClass().getName();

  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    MyLogger.log(className, "ProcessRequest()");

    //response.setContentType("text/event-stream;charset=UTF-8");    
    response.setHeader("Content-Type", "text/event-stream;charset=UTF-8");
    response.setHeader("Cache-Control", "no-cache");
    HttpSession session = request.getSession();
    session.setMaxInactiveInterval(1 * 10);

    //HttpSession sessionObj = request.getSession(true);
    //sessionObj.setMaxInactiveInterval(10 * 60);
    //response.setHeader("Pragma", "no-cache");
    try (PrintWriter out = response.getWriter()) {
      String result = "data: {\"time\": \"" + (new Date()).toString() + "\"}\n\n";
      System.out.println("JSON result: " + result);
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
