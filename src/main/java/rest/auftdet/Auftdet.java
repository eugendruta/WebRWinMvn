package rest.auftdet;

import rest.auftdetail.AuftdetailItem;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;
import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import util.MyLogger;

public class Auftdet extends HttpServlet {

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
    double start;
    double ende;
    double duration;
    AuftdetailItem auftdetItem = new AuftdetailItem(1, 1);

    response.setContentType("text/html;charset=UTF-8");
    response.setHeader("Access-Control-Allow-Origin", "*");

    ServletContext context = request.getSession().getServletContext();

    /* ?sort=&page=1&per_page=5    
     */
    String sqlstm = request.getParameter("sqlstm");
    MyLogger.log(className, "sqlstm: " + sqlstm);

    String sort = request.getParameter("sort");
    MyLogger.log(className, "sort: " + sort);
    String page = request.getParameter("page");
    MyLogger.log(className, "page: " + page);
    String per_page = request.getParameter("per_page");
    MyLogger.log(className, "per_page: " + per_page);

    /* !! TEST Vuetable-2
    if (page != null) {
      MyLogger.log(className, "TEST Vuetable-2");
      //jsonString: [ {"id":"HOL-3506","name":"Fehlteile Wareneingang"},{"id":"HOL-1006","name":"Zentrallager Karlsruhe"},{"id":"HOL-1806","name":"Retouren AT Karlsruhe"},{"id":"HOL-1906","name":"Retourenlager Karlsruhe"},{"id":"HOL-3006","name":"Schrott / Edix-Lager Karlsruhe"},{"id":"HOL-3306","name":"Mehrmarken Karlsruhe"},{"id":"HOL-3706","name":"NON-Ford Reklamationen Karls"},{"id":"HOL-3906","name":"Ford-Retourenlager Karlsruhe"},{"id":"HOL-4006","name":"Express-Lager Karlsruhe"}] 
      try (PrintWriter out = response.getWriter()) {
        jsonString = "      {\n"
                + "        \"links\": \n"
                + "          {\n"
                + "            \"pagination\": {\n"
                + "            \"total\": 50,\n"
                + "            \"per_page\": 15,\n"
                + "            \"current_page\": 1,\n"
                + "            \"last_page\": 4,\n"
                + "            \"next_page_url\": \"...\",\n"
                + "            \"prev_page_url\": \"...\",\n"
                + "            \"from\": 1,\n"
                + "            \"to\": 15\n"
                + "          }\n"
                + "      },\n"
                + "        \"data\": \n"
                + "        [\n"
                + "          {\n"
                + "            \"id\": 1,\n"
                + "            \"name\": \"Eugen Druta\",\n"
                + "            \"nickname\": \"J\",\n"
                + "            \"email\": \"druta@tup.com\",\n"
                + "            \"birthdate\": \"1949-16-07\",\n"
                + "            \"gender\": \"M\",\n"
                + "            \"age\": \"70\",\n"
                + "            \"salary\": \"xxxx.x\",\n"
                + "            \"group_id\": 1\n"
                + "          },\n"
                + "          {\n"
                + "            \"id\": 2,\n"
                + "            \"name\": \"Max Mustermann\",\n"
                + "            \"nickname\": \"Nick\",\n"
                + "            \"email\": \"m.muster@server.com\",\n"
                + "            \"birthdate\": \"2011-28-12\",\n"
                + "            \"gender\": \"M\",\n"
                + "            \"age\": \"8\",\n"
                + "            \"salary\": \"1.0\",\n"
                + "            \"group_id\": 2\n"
                + "          }\n"
                + "        ]\n"
                + "      }      \n"
                + "";
        MyLogger.log(className, "jsonString: " + jsonString);
        out.println(jsonString);
        return;
      }
    }
     */
    start = ((new Date()).getTime()) / 1000.;

    //Table und WHERE-Klausel
    if (sqlstm.contains("WHERE")) {
      table = sqlstm.substring(sqlstm.lastIndexOf("FROM") + 5, sqlstm.indexOf("WHERE"));
      where = sqlstm.substring(sqlstm.lastIndexOf("WHERE"));
      //MyLogger.log(className, "table: " + table + "; where: " + where);
    } else {
      table = sqlstm.substring(sqlstm.lastIndexOf("FROM") + 5);
      where = "";
    }

    //Beginn mit SELECT 
    _sqlstmt = sqlstm;
    _sqlstmt = _sqlstmt.substring(sqlstm.indexOf(" ") + 1);
    //MyLogger.log(className, "_sqlstmt:" + _sqlstmt + ";");

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
      //MyLogger.log(className, "view: " + view);

      //WHERE-Klausel hinzufügen (wenn vorhanden)
      String _from = sqlstm.substring(sqlstm.lastIndexOf("FROM"));
      startpos = _from.lastIndexOf("WHERE");
      if (startpos > 0) {
        where = _from.substring(startpos);
        //MyLogger.log(className, "; where: " + where);
        cntStm = "SELECT COUNT(*) FROM " + view + " " + where;
      } else {
        //SELECT count(*) ohne WHERE-Klausel
        cntStm = "SELECT COUNT(*) FROM " + view;
      }
      //MyLogger.log(className, "cntStm: " + cntStm);

      rs = stmt.executeQuery(cntStm);
      anzRow = 0;
      while (rs.next()) {
        anzRow = rs.getInt(1);
      }

      //Anzahl Records
      if ( anzRow <= 0) {
        //Keine daten gefunden
        
      }
      
      rs = stmt.executeQuery(sqlstm);
      MyLogger.log(className, "ABCDEF: sqlstm: " + sqlstm);
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
            //MyLogger.log(className, "DDDD colname: " + _colname + "; rs.getString("
            //+ j + "): " + rs.getString(j) + "; dbcolname: "
            //+ _colname.substring(3) + ";  dbcolwert: " + dbcol
            //+ ": key: " + key);

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
                //MyLogger.log(className, "Cache vorhanden: key: " + key + "; value: "                        + ((String[]) attribute)[0] + ";");
              }
            }
          }

          data[i][j - 1] = dataItem[j - 1];
        }
        i++;
      }
      auftdetItem = new AuftdetailItem(anzRow, anzCol);
      for (int j = 0; j < data.length; j++) {
        String[] strings = data[j];
        for (int k = 0; k < strings.length; k++) {
          String string = strings[k];
          //MyLogger.log(className, "data[" + j + "][" + k + "]: " + data[j][k]);
        }
      }

      auftdetItem.setData(data);

      Gson gson = new Gson();
      jsonString = gson.toJson(auftdetItem);
      /* jsonString: {
        "data":[
          ["INTERN","ASTON MARTIN","adsf","adsf","asd","7005100","16 17 01 A 1",
           "BYPG","0","","3","3","0","0","0","0","verfügbar","gesperrter Bestand",
           "Interner Bestand",null,null,null,"0","0","1","LE1993837","MAN-int",
           "HER-AST","FLOT-bp_sperr","BYPASS-SPERR","FEZO-bypg","BYPG","FLHT-kiste_a",
           "A Kiste; 2 Euro",null,"","LZO-we","FFA156463","16 17 01 A 1","16","17",
           "01","A","0","0","0","Stück","0",null,"keine","V","1","HOL-intka01",
           "2017-10-04 00:00:00.0","2017-10-04 17:34:22.0",null,
           "2017-10-04 17:34:22.809"],
          ["INTERN","ASTON MARTIN","adsf","adsf","asd","7005099","16 17 01 A 1",
           "BYPG","0","","1","1","0","0","0","0","verfügbar","freier Bestand",
           "Interner Bestand",null,null,null,"0","0","1","LE1993831","MAN-int",
           "HER-AST","FLOT-bp_sperr","BYPASS-SPERR","FEZO-bypg","BYPG","FLHT-kiste_a",
           "A Kiste; 2 Euro",null,"","LZO-we","FFA156463","16 17 01 A 1","16","17",
           "01","A","0","0","0","Stück","0",null,"keine","V","0","HOL-intka01",
           "2017-10-04 00:00:00.0","2017-10-04 17:34:18.0",null,
           "2017-10-04 17:34:18.084"]]}      
       */
      MyLogger.log(className, "XYZZ: jsonString: " + jsonString);
      //MyLogger.log(className, "XYZW: LE: jsonString.data[0][5]: "
              //+ auftdetItem.getData()[0][5] + "; LE: jsonString.data[1][5]: "
              //+ auftdetItem.getData()[1][5]);

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
      ende = ((new Date()).getTime()) / 1000.;
      duration = ende - start;
      MyLogger.log(className, "Ende: duration[Sek]: " + duration);
      //jsonString: {"data": [ ["INTERN","ASTON MARTIN","adsf","adsf","asd","7005100","16 17 01 A 1","BYPG","0","","3","3","0","0","0","0","verfügbar","gesperrter Bestand","Interner Bestand",null,null,null,"0","0","1","LE1993837","MAN-int","HER-AST","FLOT-bp_sperr","BYPASS-SPERR","FEZO-bypg","BYPG","FLHT-kiste_a","A Kiste; 2 Euro",null,"","LZO-we","FFA156463","16 17 01 A 1","16","17","01","A","0","0","0","Stück","0",null,"keine","V","1","HOL-intka01","2017-10-04 00:00:00.0","2017-10-04 17:34:22.0",null,"2017-10-04 17:34:22.809"]]}
      /*
      if (page != null) {
        jsonString = "      {\n"
                + "        \"links\": \n"
                + "          {\n"
                + "            \"pagination\": {\n"
                + "            \"total\": 50,\n"
                + "            \"per_page\": 15,\n"
                + "            \"current_page\": 1,\n"
                + "            \"last_page\": 4,\n"
                + "            \"next_page_url\": \"...\",\n"
                + "            \"prev_page_url\": \"...\",\n"
                + "            \"from\": 1,\n"
                + "            \"to\": 15,\n"
                + "          }\n"
                + "      },\n"
                + "        \"data\": \n"
                + "        [\n"
                + "          {\n"
                + "            \"id\": 1,\n"
                + "            \"name\": \"xxxxxxxxx\",\n"
                + "            \"nickname\": \"xxxxxxx\",\n"
                + "            \"email\": \"xxx@xxx.xxx\",\n"
                + "            \"birthdate\": \"xxxx-xx-xx\",\n"
                + "            \"gender\": \"X\",\n"
                + "            \"group_id\": 1,\n"
                + "          },\n"
                + "          {\n"
                + "            \"id\": 50,\n"
                + "            \"name\": \"xxxxxxxxx\",\n"
                + "            \"nickname\": \"xxxxxxx\",\n"
                + "            \"email\": \"xxx@xxx.xxx\",\n"
                + "            \"birthdate\": \"xxxx-xx-xx\",\n"
                + "            \"gender\": \"X\",\n"
                + "            \"group_id\": 3,\n"
                + "          }\n"
                + "        ]\n"
                + "      }      \n"
                + "";
      
        SELECT AC_MANDANT,AC_HERSTELLER,TEILENUMMER, HERSTELLERTEILENUMMER,TEILBEZ,LE,
        LAGERORTBEZ,AC_ZONEAKTUELL,INVENTUR,AC_INVENTURGRUND,BESTANDTOTAL,BESTANDFREI,
        BESTANDRESERVIERT,BESTANDGESPERRT,TRANSPORT,INTERNESPERRE,CK_DISPOSTATUS,
        CK_QSSTATUS,AC_HOSTLAGER,AVISNR,KISTENNR,CONTAINERNR,KISTENDISPO,
        INVENTURAVISIERUNG,VERPACKUNGSMENGE,ND_LEOID,MANDANT,HERSTELLER,FLSLAGERORTTYP,
        AC_FLSLAGERORTTYP,ZONEAKTUELL,AC_ZONEAKTUELL,LHMTYP,AC_LHMTYP,ZONEAVISIERT,
        AC_ZONEAVISIERT,ND_LAGERBEREICHOID,ND_LAGERORTOID,LAGERORTBEZ,LB,ZEILE,X,Y,
        BESTANDNACHGEFRAGT,BESTANDGEPLANT,BESTANDLAUEFT,EINHEIT,ISRETOURE,
        INVENTURGRUND,CK_INTERNESPERRE,DISPOSTATUS,QSSTATUS,HOSTLAGER,WEDATUM,
        ERZEUGTDATUM,EINLAGERDATUM,INVENTURDATUM FROM v_dlg_bsueb WHERE 
        MANDANT='MAN-int'
      
        jsonString: {
          "data":[
            ["INTERN","ASTON MARTIN","adsf","adsf","asd","7005100","16 17 01 A 1",
              "BYPG",
      "0","","3","3","0","0","0","0","verfügbar","gesperrter Bestand",
              "Interner Bestand",null,null,null,"0","0","1","LE1993837","MAN-int",
              "HER-AST","FLOT-bp_sperr","BYPASS-SPERR","FEZO-bypg","BYPG",
              "FLHT-kiste_a","A Kiste; 2 Euro",null,"","LZO-we","FFA156463",
              "16 17 01 A 1","16","17","01","A","0","0","0","Stück","0",null,"keine",
              "V","1","HOL-intka01","2017-10-04 00:00:00.0","2017-10-04 17:34:22.0",
              null,"2017-10-04 17:34:22.809"],
            ["INTERN","ASTON MARTIN","adsf","adsf","asd","7005099","16 17 01 A 1",
              "BYPG","0","","1","1","0","0","0","0","verfügbar","freier Bestand",
              "Interner Bestand",null,null,null,"0","0","1","LE1993831","MAN-int",
              "HER-AST","FLOT-bp_sperr","BYPASS-SPERR","FEZO-bypg","BYPG",
              "FLHT-kiste_a","A Kiste; 2 Euro",null,"","LZO-we","FFA156463",
              "16 17 01 A 1","16","17","01","A","0","0","0","Stück","0",null,"keine",
              "V","0","HOL-intka01","2017-10-04 00:00:00.0","2017-10-04 17:34:18.0",
              null,"2017-10-04 17:34:18.084"]]}      
      }
       */
      if (page != null) {
        jsonString = "      "
                + "{\n"
                + "        \"links\": \n"
                + "          {\n"
                + "            \"pagination\": {\n"
                + "            \"total\": 50,\n"
                + "            \"per_page\": 15,\n"
                + "            \"current_page\": 1,\n"
                + "            \"last_page\": 4,\n"
                + "            \"next_page_url\": \"...\",\n"
                + "            \"prev_page_url\": \"...\",\n"
                + "            \"from\": 1,\n"
                + "            \"to\": 15\n"
                + "          }\n"
                + "      },\n"
                + "        \"data\": \n"
                + "        [\n";

        for (int i = 0; i < auftdetItem.getData().length; i++) {
          jsonString += "{\n"
                  + "            \"mandant\": \"" + auftdetItem.getData()[i][0] + "\",\n"
                  + "            \"hersteller\": \"" + auftdetItem.getData()[i][1] + "\",\n"
                  + "            \"teilenummer\": \"" + auftdetItem.getData()[i][2] + "\",\n"
                  + "            \"HERSTELLERTEILENUMMER\": \"" + auftdetItem.getData()[i][3] + "\",\n"
                  + "            \"TEILBEZ\": \"" + auftdetItem.getData()[i][4] + "\",\n"
                  + "            \"le\": \"" + auftdetItem.getData()[i][5] + "\",\n"
                  + "            \"LAGERORTBEZ\": \"" + auftdetItem.getData()[i][6] + "\",\n"
                  + "            \"ZONEAKTUELL\": \"" + auftdetItem.getData()[i][7] + "\"\n";
          if (i == (auftdetItem.getData().length - 1)) {
            jsonString += "}\n";
          } else {
            jsonString += "},\n";
          }
        }
        jsonString += "]\n"
                + "}\n";

        /*
        jsonString += "{\n"
        + "            \"mandant\": \"" + auftdetItem.getData()[0][0] + "\",\n"
        + "            \"hersteller\": \"" + auftdetItem.getData()[0][1] + "\",\n"
        + "            \"teilenummer\": \"" + auftdetItem.getData()[0][2] + "\",\n"
        + "            \"HERSTELLERTEILENUMMER\": \"" + auftdetItem.getData()[0][3] + "\",\n"
        + "            \"TEILBEZ\": \"" + auftdetItem.getData()[0][4] + "\",\n"
        + "            \"le\": \"" + auftdetItem.getData()[0][5] + "\",\n"
        + "            \"LAGERORTBEZ\": \"" + auftdetItem.getData()[0][6] + "\",\n"
        + "            \"ZONEAKTUELL\": \"" + auftdetItem.getData()[0][7] + "\"\n"
        + "          },\n"
        + "          {\n"
        + "            \"mandant\": \"" + auftdetItem.getData()[1][0] + "\",\n"
        + "            \"hersteller\": \"" + auftdetItem.getData()[1][1] + "\",\n"
        + "            \"teilenummer\": \"" + auftdetItem.getData()[1][2] + "\",\n"
        + "            \"HERSTELLERTEILENUMMER\": \"" + auftdetItem.getData()[1][3] + "\",\n"
        + "            \"TEILBEZ\": \"" + auftdetItem.getData()[1][4] + "\",\n"
        + "            \"le\": \"" + auftdetItem.getData()[1][5] + "\",\n"
        + "            \"LAGERORTBEZ\": \"" + auftdetItem.getData()[1][6] + "\",\n"
        + "            \"ZONEAKTUELL\": \"" + auftdetItem.getData()[1][7] + "\"\n"
        + "          }\n"
        + "        ]\n"
        + "      }\n"
        + "";
         */
      }

      MyLogger.log(className, "jsonString: " + jsonString);
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
