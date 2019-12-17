package rest.listbox;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import util.MyLogger;

public class Listbox extends HttpServlet {

  @Resource(name = "elvisdev")
  private DataSource elvisdev;

  private final String className = this.getClass().getName();

  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    Connection conn = null;
    String selstmt;
    String cntstmt;
    Statement stmt;
    String jsonString = "";
    String dependency;
    String _table;
    String viewname;
    String[] attribut1;
    String[] attribut2;
    Object value;
    String cachekey;
    String cachekey2;
    String wert;
    String[] attrvalue = new String[1];
    String[] attrvalue1 = new String[1];
    Object result;
    Object result1;
    boolean cachefound = false;
    String name = null;
    String key0;
    int anzRow = 0;
    String anzeige_txt;
    Object attribute;
    String s_anzeige_txt;

    response.setContentType("text/html;charset=UTF-8");
    response.setHeader("Access-Control-Allow-Origin", "*");

    String _response = "";
    //Param: "typ": "Konst", "table": "V_UX_KONSTANTEN", "constkey": "LE.DispoStatus"
    /* typ: depends; table: SELECT wert, anzeige_text FROM v_dlg_bsueb_hostlager; 
    constkey: null;; constkeyval: null    
     */
    String typ = request.getParameter("typ"); //appKonst; Konst; sqlstm; depends
    String table = request.getParameter("table");
    String constkey = request.getParameter("constkey");
    String constkeyval = request.getParameter("constkeyval");

    MyLogger.log(className, "typ: " + typ + "; table: " + table
            + "; constkey: " + constkey + "; constkeyval: " + constkeyval);

    //Application cache
    ServletContext context = getServletContext();

    //Select Typ
    switch (typ) {
      case "appKonst":
        cntstmt = "SELECT COUNT(wert " + ") "
                + "FROM EFLSSYSTEM." + table + " WHERE wert is not null";
        selstmt = "SELECT wert as id, anzeige_text as name "
                + "FROM EFLSSYSTEM." + table + " WHERE wert is not null order by 1";
        _table = table;
        break;
      case "Konst":
        cntstmt = "SELECT COUNT(wert " + ") "
                + "FROM EFLSSYSTEM." + table + " WHERE constkey = '" + constkey + "'";
        selstmt = "SELECT wert as id, konstergoname as name "
                + "FROM EFLSSYSTEM." + table + " WHERE constkey = '" + constkey
                + "' order by 1";
        _table = table;
        break;
      case "sqlstm":
        //  SELECT OID as id, NAME FROM V_DLG_BSUEB_LAGERORT WHERE name is not null order by 2
        String _name = table.split(" ")[1].substring(0, (table.split(" ")[1].length()));
        _table = table.split("FROM")[1].split(" ")[1];
        //MyLogger.log(className, "XXX _name: " + _name + "; _table: " + _table);
        cntstmt = "SELECT COUNT(" + _name + " ) "
                + "FROM EFLSSYSTEM." + _table + " WHERE " + _name + " is not null";
        selstmt = table;
        break;
      case "depends":
        /*{"name": "hostlagerlb", "typ": "depends",
          "table": "SELECT wert, anzeige_text FROM v_dlg_bsueb_hostlager 
          "constkey": "mandantoid"},
         */
        selstmt = table;
        if ((constkey != null) && (constkeyval != null)) {
          selstmt += " WHERE " + constkey + "=" + constkeyval;
        }
        //MyLogger.log(className, "YYY selstmt: " + selstmt);
        _name = selstmt.split(" ")[1].substring(0, (selstmt.split(" ")[1].length() - 1));
        _table = selstmt.split("FROM")[1].split(" ")[1];

        cntstmt = "SELECT COUNT(" + _name + " ) " + "FROM EFLSSYSTEM." + _table;
        if (selstmt.contains("WHERE")) {
          String _where = selstmt.split("WHERE")[1];
          cntstmt += " WHERE " + _where;
        }
        MyLogger.log(className, "YYY cntstmt: " + cntstmt);
        break;
      default:
        //MyLogger.log(className, "typ: " + typ + " ist falsch; table: " + table                + "; constkey: " + constkey);
        try (PrintWriter out = response.getWriter()) {
          //korrekt: jsonString: [{"id":"1", "name":"LB #1"}, {"id":"2", "name":"LB #2" } ]
          //fehler: jsonString: [{"id":"-1", "name":"typ ist falsch"}, {"id":"2", "name":"LB #2" } ]
          jsonString = "[{\"id\": \"-1\", \"name\": \"fehler: typ falsch\"}]";
          //MyLogger.log(className, "typ: " + typ + "; table: " + table
          //+ "; constkey: " + constkey + "; jsonStringlength(): "
          //+ jsonString.length() + "; jsonString: " + jsonString);
          out.println(jsonString);
        }
        return;
    }
    //MyLogger.log(className, "_table: " + _table + "; constkey: " + constkey);

    //Gibt es diesen Eintrag im Cache ??
    anzRow = 0;
    Enumeration<String> cacheeintraege = context.getAttributeNames();
    while (cacheeintraege.hasMoreElements()) {
      name = cacheeintraege.nextElement();
      cachefound = false;
      if (name.contains(_table)) {
        cachefound = true;
        //Hole Daten aus dem cache
        //cacheeintrag:  V_DLG_BSUEB_ZONEAKTUELL#null#FEZO-mk11 Vaalue: MK11
        String[] _wert = name.split("#");
        /*
        for (int i = 0; i < _wert.length; i++) {
          //MyLogger.log(className, "cache wert[" + i + "]:  " + _wert[i]);
        }
         */
        if (context.getAttribute(name) != null) {
          anzeige_txt = ((String[]) context.getAttribute(name))[0];
          //MyLogger.log(className, "cacheeintrag name:  " + name  + "; anzeige_txt: " + anzeige_txt);
        } else {
          //MyLogger.log(className, "cacheeintrag name:  " + name + " nicht gefunden");
        }

//        DropdownItem[] options = new DropdownItem[anzRow];
//        int i = 0;
//        ArrayList<Object> columns;
//        columns = new ArrayList<>();
//        columns.add(rs.getObject(j));
//
//        for (int j = 1; j <= 2; j++) {
//          columns.add(rs.getObject(j));
//        }
//        if (anzCol == 3) {
//          dependency = rs.getObject(3).toString();
//          //MyLogger.log(className, "anzCol == 3:  table: " + table + "; anzRow: " + anzRow
//                  + "; anzCol: " + anzCol + "; dependency: " + dependency);
//        }
//
//        options[i] = new DropdownItem(columns);
//        i++;
//
//        //Cacheeintrag
//        key0 = _table + "#" + constkey + "#";
//        cachekey = key0 + columns.get(0);
//        attrvalue[0] = (String) columns.get(1);
//        context.setAttribute(cachekey, attrvalue);
//        //MyLogger.log(className, "cacheeintrag ok: cachekey: " + cachekey
//                + "; attrvalue[0]: " + attrvalue[0]);
      }
    }

    MyLogger.log(className, "cachefound: " + cachefound);
    cachefound = false;
    if (!cachefound) {
      //MyLogger.log(className, "kein cacheeintrag für: " + _table);
      //MyLogger.log(className, "cntstmt: " + cntstmt);
      //MyLogger.log(className, "selstmt: " + selstmt);

      try {
        // Obtain a database connection:
        if (conn == null) {
          conn = elvisdev.getConnection();
        }
        stmt = conn.createStatement();

        ResultSet rs = stmt.executeQuery(cntstmt);
        anzRow = 0;
        while (rs.next()) {
          anzRow = rs.getInt(1);
        }

        DropdownItem[] options = new DropdownItem[anzRow];
        rs = stmt.executeQuery(selstmt);
        int anzCol = rs.getMetaData().getColumnCount();
        //MyLogger.log(className, "WWWW table: " + table + "; anzRow: " + anzRow
        //+ "; anzCol: " + anzCol + "; _table: " + _table
        //+ "; constkey: " + constkey + "; constkeyval: " + constkeyval);

        int i = 0;
        ArrayList<Object> columns;
        while (rs.next()) {
          columns = new ArrayList<>();
          for (int j = 1; j <= 2; j++) {
            columns.add(rs.getObject(j));
          }
          dependency = null;
          if (anzCol == 3) {
            dependency = rs.getObject(3).toString();
            //MyLogger.log(className, "anzCol == 3:  table: " + table + "; anzRow: " + anzRow
            //+ "; anzCol: " + anzCol + "; dependency: " + dependency);
          }

          options[i] = new DropdownItem(columns);
          i++;

          //Cacheeintrag
          key0 = _table + "#" + (dependency == null ? (constkey == null ? "" : constkey) : dependency) + "#";
          cachekey = key0 + columns.get(0);
          String _attrvalue = (String) columns.get(1);
          storeDataInContext(context, cachekey, _attrvalue);

          /*Wenn dependeny vorhanden: auch alle Werte ohne dependency eintragen
          z.B; hostlager ist abhängig vom mandanten, aber in der Tsbelle gibt es 
          eine Spalte hostlager (mit dem dazugehörigen Text)
           */
          if (dependency != null) {
            key0 = _table + "##";
            cachekey = key0 + columns.get(0);
            String _attrvalue2 = (String) columns.get(1);
            storeDataInContext(context, cachekey, _attrvalue2);
          }

          //TEST !!!
          //Hole den Wert aus dem Cache
//          Object attribute;
//          String s_anzeige_txt;
//          Enumeration<String> _cacheeintraege = context.getAttributeNames();
//          name = "V_AC_MANDANT##MAN-int";
//          attribute = context.getAttribute(name);
//          if (attribute instanceof String[]) {
//            s_anzeige_txt = ((String[]) attribute)[0];
//            MyLogger.log(className, "TEST: cacheeintrag name:  " + name + "; anzeige_txt: " + s_anzeige_txt);
//          }
//
//          name = "V_AC_MANDANT##MAN-efa";
//          attribute = context.getAttribute(name);
//          if (attribute instanceof String[]) {
//            s_anzeige_txt = ((String[]) attribute)[0];
//            MyLogger.log(className, "TEST: cacheeintrag name:  " + name + "; anzeige_txt: " + s_anzeige_txt);
//          }
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
      } catch (SQLException ex) {
        Logger.getLogger(Listbox.class.getName()).log(Level.SEVERE, null, ex);
        jsonString = ex.getMessage();
      } finally {
        try {
          //Close DB Connection
          if (conn != null) {
            conn.close();
            conn = null;
          }
        } catch (SQLException ex) {
          Logger.getLogger(Listbox.class.getName()).log(Level.SEVERE, null, ex);
          conn = null;
        }
      }
    }

    /*TEST     
    if (context.getAttribute("V_AC_HERSTELLER##HER-SUZ") != null) {
      anzeige_txt = ((String[]) context.getAttribute("V_AC_HERSTELLER##HER-SUZ"))[0];
      MyLogger.log(className, "TEST: cacheeintrag name: V_AC_HERSTELLER##HER-SUZ; anzeige_txt: " + anzeige_txt);
    }
     */
//    //Hole den Wert aus dem Cache
//    Object attribute;
//    String s_anzeige_txt;
//    Enumeration<String> _cacheeintraege = context.getAttributeNames();
//    name = "V_AC_MANDANT##MAN-int";
//    attribute = context.getAttribute(name);
//    if (attribute instanceof String[]) {
//      s_anzeige_txt = ((String[]) attribute)[0];
//      MyLogger.log(className, "TEST: cacheeintrag name:  " + name + "; anzeige_txt: " + s_anzeige_txt);
//    }
//
//    name = "V_AC_MANDANT##MAN-efa";
//    attribute = context.getAttribute(name);
//    if (attribute instanceof String[]) {
//      s_anzeige_txt = ((String[]) attribute)[0];
//      MyLogger.log(className, "TEST: cacheeintrag name:  " + name + "; anzeige_txt: " + s_anzeige_txt);
//    }

    /*
    while (_cacheeintraege.hasMoreElements()) {
      name = (String) _cacheeintraege.nextElement();
      if (name.equals("V_AC_MANDANT##MAN-int") || name.equals("V_AC_MANDANT##MAN-efa")) {
        attribute = context.getAttribute(name);
        if (attribute instanceof String[]) {
          s_anzeige_txt = ((String[]) attribute)[0];
          MyLogger.log(className, "TEST: cacheeintrag name:  " + name
                  + "; anzeige_txt: " + s_anzeige_txt);
        }
      }
    }
     */
    //while (_cacheeintraege. hasMoreElements()) {
//    int cnt = 0;
//    for (int i = 0; _cacheeintraege.hasMoreElements(); i++) {
//      //Hole Daten aus dem cache
//      name = _cacheeintraege.nextElement();
//      attribute = context.getAttribute(name);
//      if (attribute instanceof String[]) {
//        s_anzeige_txt = ((String[]) attribute)[0];
//        MyLogger.log(className, "TEST: i: " + i + "; cacheeintrag name:  " + name
//                + "; anzeige_txt: " + s_anzeige_txt);
//      }
//    }
//      name = _cacheeintraege.nextElement();
//      //Hole Daten aus dem cache
//      attribute = context.getAttribute(name);
//      if (attribute instanceof String[]) {
//        s_anzeige_txt = ((String[]) attribute)[0];
//        MyLogger.log(className, "TEST: cacheeintrag name:  " + name
//                + "; anzeige_txt: " + s_anzeige_txt);
//      } else if (attribute instanceof Boolean) {
//        b_anzeige_txt = ((Boolean[]) attribute)[0];
//        MyLogger.log(className, "TEST: cacheeintrag name:  " + name
//                + "; anzeige_txt: " + b_anzeige_txt);
//      }
//!!TEST
    try (PrintWriter out = response.getWriter()) {
      //korrekt: jsonString: [{"id":"1", "name":"LB #1"}, {"id":"2", "name":"LB #2" } ]
      MyLogger.log(className, "typ: " + typ + "; table: " + table
              + "; constkey: " + constkey + "; constkeyval: " + constkeyval
              + "; jsonStringlength(): " + jsonString.length());
      if (typ.equals("depends")) {
        MyLogger.log(className, "jsonString: " + jsonString);
      }
      if (jsonString.length() == 0) {
        //Keine daten gefunden
        jsonString = "[{\"id\":\"-1\", \"name\":\"NO_DATA_FOUND\"}]";
      }
      out.println(jsonString);
    }
  }

  public synchronized static void storeDataInContext(ServletContext context, String cachekey,
          String attrvalue) {
    String[] value = new String[1];

    value[0] = attrvalue;
    context.setAttribute(cachekey, value);
    //MyLogger.log("rest.listbox.Listbox: storeDataInContext()", "cacheeintrag ok: cachekey: "            + cachekey + "; value[0]: " + value[0]);
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
