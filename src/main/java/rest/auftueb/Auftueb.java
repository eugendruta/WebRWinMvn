package rest.auftueb;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import util.MyLogger;

public class Auftueb extends HttpServlet {

  @Resource(name = "elvisdev")
  private DataSource elvisdev;

  private final String className = this.getClass().getName();

  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    Connection conn = null;
    String cntStm;
    Statement stmt;
    ResultSet rs;
    String jsonString;
    int anzCol;
    int anzRow;
    String viewstm;
    String table;
    String where;
    String elem;
    int viewcolstart;
    int viewcolstop;
    String embedsql;
    String viewsql = "";
    String colname;
    String view;
    String viewname = "";
    String viewtyp = "";
    String _sqlstmt;
    String anzeige_text;
    String wert;
    String key = null;
    String value;
    Object attribute;
    String attr;
    String dbcol;
    String name = null;
    String s_anzeige_txt = null;
    Boolean b_anzeige_txt;

    response.setContentType("text/html;charset=UTF-8");

    ServletContext context = request.getSession().getServletContext();

    String sqlstm = request.getParameter("sqlstm");
    MyLogger.log(className, "sqlstm: " + sqlstm);

    //Table und WHERE-Klausel
    if (sqlstm.contains("WHERE")) {
      table = sqlstm.substring(sqlstm.lastIndexOf("FROM") + 5, sqlstm.indexOf("WHERE"));
      where = sqlstm.substring(sqlstm.lastIndexOf("WHERE"));
      MyLogger.log(className, "table: " + table + "; where: " + where);
    } else {
      table = sqlstm.substring(sqlstm.lastIndexOf("FROM") + 5);
      where = "";
    }

    //Beginn mit SELECT 
    _sqlstmt = sqlstm;
    _sqlstmt = _sqlstmt.substring(sqlstm.indexOf(" ") + 1);
    MyLogger.log(className, "_sqlstmt:" + _sqlstmt + ";");

    try {
      // Obtain a database connection:
      if (conn == null) {
        conn = elvisdev.getConnection();
      }

      //COUNT(*) zusammenbauen
      stmt = conn.createStatement();

      int startpos = sqlstm.lastIndexOf("FROM") + 5;
      int endpos = sqlstm.substring(startpos).indexOf(" ");
      if (endpos < 0) {
        //Keine Where Klausel vorhanden
        view = sqlstm.substring(startpos).substring(0);
      } else {
        view = sqlstm.substring(startpos).substring(0, endpos);
      }
      MyLogger.log(className, "view: " + view);

      //WHERE-Klausel hinzufügen (wenn vorhanden)
      String _from = sqlstm.substring(sqlstm.lastIndexOf("FROM"));
      startpos = _from.lastIndexOf("WHERE");
      if (startpos > 0) {
        where = _from.substring(startpos);
        MyLogger.log(className, "; where: " + where);
        cntStm = "SELECT COUNT(*) FROM " + view + " " + where;
      } else {
        //SELECT count(*) ohne WHERE-Klausel
        cntStm = "SELECT COUNT(*) FROM " + view;
      }
      MyLogger.log(className, "cntStm: " + cntStm);

      rs = stmt.executeQuery(cntStm);
      anzRow = 0;
      while (rs.next()) {
        anzRow = rs.getInt(1);
      }

      rs = stmt.executeQuery(sqlstm);
      anzCol = rs.getMetaData().getColumnCount();
      MyLogger.log(className, "table: " + "anzRow: " + anzRow + "; anzCol: " + anzCol);

      String[] dataItem = new String[anzCol];
      String[][] data = new String[anzRow][anzCol];

      int i = 0;
      String _colname;
      while (rs.next()) {
        for (int j = 1; j <= rs.getMetaData().getColumnCount(); j++) {
          _colname = rs.getMetaData().getColumnName(j);
          dataItem[j - 1] = rs.getString(j);

          if ((_colname.startsWith("AC_")) || (_colname.startsWith("CK_"))) {
            dbcol = rs.getString(_colname.substring(3));

            //Ist der Wert im Cache ??
            //cachekey: V_UX_KONSTANTEN#LE.QsStatus#1; value[0]: gesperrter Bestand
            //cachekey: V_UX_KONSTANTEN#LE.DispoStatus#N; attrvalue[0]: nicht verfügbar
            //cachekey: v_ac_mandant#null#MAN-efa; attrvalue[0]: EFA
            //cachekey: V_AC_MANDANT#null#MAN-int; attrvalue[0]: INTERN
            if (_colname.startsWith("AC_")) {
              key = rs.getString(j).toUpperCase() + "##" + dbcol;
            } else if (_colname.startsWith("CK_")) {
              key = "V_UX_KONSTANTEN#" + rs.getString(j) + "#" + dbcol;
            }
            MyLogger.log(className, "DDDD colname: " + _colname + "; rs.getString("
                    + j + "): " + rs.getString(j) + "; dbcolname: "
                    + _colname.substring(3) + ";  dbcolwert: " + dbcol
                    + ": key: " + key);

            //Hole den Wert aus dem Cache
            if (dbcol == null) {
              String[] _val = new String[1];
              _val[0] = "";
              context.setAttribute(key, _val);
              dataItem[j - 1] = _val[0];
            } else {
              attribute = context.getAttribute(key);
              if (attribute == null) {
                //Cache leer: eintragen
                MyLogger.log(className, "Cache leer: key: " + key);
                //String[] _val = new String[1];
                //_val[0] = "";
                //context.setAttribute(key, _val);
                //dataItem[j - 1] = _val[0];             
              } else {
                //Cache vorhanden
                dataItem[j - 1] = ((String[]) attribute)[0];
                MyLogger.log(className, "Cache vorhanden: key: " + key + "; value: "
                        + ((String[]) attribute)[0] + ";");
              }
            }
          }

          data[i][j - 1] = dataItem[j - 1];
        }
        i++;
      }
      AuftuebItem auftuebItem = new AuftuebItem(anzRow, anzCol);
      for (int j = 0; j < data.length; j++) {
        String[] strings = data[j];
        for (int k = 0; k < strings.length; k++) {
          String string = strings[k];
          MyLogger.log(className, "data[" + j + "][" + k + "]: " + data[j][k]);
        }
      }

      auftuebItem.setData(data);

      Gson gson = new Gson();
      jsonString = gson.toJson(auftuebItem);
      MyLogger.log(className, "jsonString: " + jsonString);

      rs.close();
      stmt.close();
    } catch (SQLException ex) {
      MyLogger.log(className, "SQLException: " + ex.getMessage());
      jsonString = ex.getMessage();
    } finally {
      try {
        //Close DB Connection
        if (conn != null) {
          conn.close();
        }
      } catch (SQLException ex) {
        MyLogger.log(className, "Close DB Connection: SQLException: " + ex.getMessage());
      }
    }

    try (PrintWriter out = response.getWriter()) {
      //MyLogger.log(className, "Table: " + table + "; jsonString.length: " + jsonString.length());
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
