package restnodb.auftueb;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import util.MyLogger;

public class Auftueb extends HttpServlet {
  private final String className = this.getClass().getName();

  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    String jsonString;
    int anzCol;
    int anzRow;

    response.setContentType("text/html;charset=UTF-8");

    String env = request.getParameter("env");
    MyLogger.log(className, "env: " + env);
    String table = request.getParameter("table");
    String name = request.getParameter("name");
    MyLogger.log(className, "name: " + name);
    MyLogger.log(className, "Table: " + table);

//    if (env.equals("db")) {
//      try {
//        // Obtain a database connection:
//        if (conn == null) {
//          //conn = sample.getConnection();
//          conn = elvisdev.getConnection();
//        }
//        stmt = conn.createStatement();
//        String cntStm;
//        String queryStm;
//        if (name == null || name.isEmpty()) {
//          cntStm = "SELECT COUNT(*) FROM " + table;
//          queryStm = "SELECT * FROM " + table;
//        } else {
//          // SELECT COUNT(*) FROM APP.EMPLOYEES where NAME = 'Eugen';
//          cntStm = "SELECT COUNT(*) FROM " + table.toUpperCase()
//                  + " where NAME = '" + name + "'";
//          queryStm = "SELECT * FROM " + table.toUpperCase()
//                  + " where NAME = '" + name + "'";
//        }
//        MyLogger.log(className, "cntStm: " + cntStm);
//        MyLogger.log(className, "queryStm: " + queryStm);
//
//        ResultSet rs = stmt.executeQuery(cntStm);
//        anzRow = 0;
//        while (rs.next()) {
//          anzRow = rs.getInt(1);
//        }
//
//        rs = stmt.executeQuery(queryStm);
//        anzCol = rs.getMetaData().getColumnCount();
//        MyLogger.log(className, "Table: " + "anzRow: " + anzRow + "; anzCol: " + anzCol);
//
//        String[] dataItem = new String[anzCol];
//        String[][] data = new String[anzRow][anzCol];
//
//        int i = 0;
//        while (rs.next()) {
//          for (int j = 1; j <= rs.getMetaData().getColumnCount(); j++) {
//            dataItem[j - 1] = rs.getString(j);
//            data[i][j - 1] = dataItem[j - 1];
//          }
//          i++;
//        }
//        AuftuebItem auftuebItem = new AuftuebItem(anzRow, anzCol);
//        auftuebItem.setData(data);
//
//        Gson gson = new Gson();
//        jsonString = gson.toJson(auftuebItem);
//        // {"data":[["Eugen","Developer","Firma","124","2010-12-12","50"],["John","Manager","Firma","100","2005-12-12","50000"]]}
//      } catch (SQLException ex) {
//        Logger.getLogger(Auftueb.class.getName()).log(Level.SEVERE, null, ex);
//        jsonString = ex.getMessage();
//      } finally {
//        try {
//          //Close DB Connection
//          if (conn != null) {
//            conn.close();
//          }
//        } catch (SQLException ex) {
//          Logger.getLogger(Auftueb.class.getName()).log(Level.SEVERE, null, ex);
//        }
//      }

      //Ohne datenbank
      anzCol = 17;
      anzRow = 20;
      String[] dataItem = new String[anzCol];
      String[][] data = new String[anzRow][anzCol];

      for (int i = 0; i < anzRow; i++) {
        for (int j = 1; j <= anzCol; j++) {
          dataItem[j - 1] = i + "," +  j;
          data[i][j - 1] = dataItem[j - 1];
        }
      }

      AuftuebItem auftuebItem = new AuftuebItem(anzRow, anzCol);
      auftuebItem.setData(data);

      Gson gson = new Gson();
      jsonString = gson.toJson(auftuebItem);
   

    try (PrintWriter out = response.getWriter()) {
      MyLogger.log(className, "Table: " + "jsonString: " + jsonString);
      out.println(jsonString);
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
