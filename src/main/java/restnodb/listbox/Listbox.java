package restnodb.listbox;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import util.MyLogger;

public class Listbox extends HttpServlet {

  private final String className = this.getClass().getName();

  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    Connection conn = null;
    Statement stmt;
    String jsonString = null;

    response.setContentType("text/html;charset=UTF-8");

    String _response = "";
    String table = request.getParameter("table");
    String dbcolumn = request.getParameter("dbcolumn");
    MyLogger.log(className, "table: " + table + "; dbcolumn: " + dbcolumn);

    int anzRow = 5;
    int anzCol = 2;
    DropdownItem[] options = new DropdownItem[anzRow];
    MyLogger.log(className, "table: " + table + "; dbcolumn: " + dbcolumn
            + "; anzRow: " + anzRow + "; anzCol: " + anzCol);

    ArrayList<Object> columns;
    String key;
    Object value;
    for (int i = 0; i < anzRow; i++) {
      columns = new ArrayList<>();

      columns.add("ind" + i); //rs.getObject(j)
      columns.add("wert" + i); //rs.getObject(j)
      options[i] = new DropdownItem(columns);
    }

    //Java EE 6 JSON
    JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
    JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
    for (DropdownItem option : options) {
      if (option.getId() != null) {
        objectBuilder.add("id", option.getId());
      }
      if (option.getName() != null) {
        objectBuilder.add("name", option.getName());
      }
      arrayBuilder.add(objectBuilder.build());
    }
    objectBuilder.add("data", arrayBuilder);
    JsonObject jsonObject = objectBuilder.build();

    try (Writer writer = new StringWriter()) {
      Json.createWriter(writer).write(jsonObject);
      jsonString = writer.toString();
    }
    jsonString = jsonString.substring(8, (jsonString.length() - 1));

    try (PrintWriter out = response.getWriter()) {
      //korrekt: jsonString: [{"id":"1", "name":"LB #1"}, {"id":"2", "name":"LB #2" } ]
      MyLogger.log(className, "table: " + table + "; dbcolumn: " + dbcolumn
              + "; jsonString: " + jsonString);
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
