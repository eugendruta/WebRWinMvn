package rest.callux;

import com.google.gson.Gson;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import util.MyLogger;
import util.JrwCrypt;

public class login extends HttpServlet {

  private final String USER_AGENT = "Mozilla/5.0";
  private final String className = this.getClass().getName();

  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    String _kennwort;
    String encpwd;
    String retval = "{\"data\":[\"-99\",\"Init.\"]}";

    response.setContentType("text/html;charset=UTF-8");
    response.setHeader("Access-Control-Allow-Origin", "*");

    String benutzer = request.getParameter("benutzer");
    String kennwort = request.getParameter("kennwort");
    MyLogger.log(className, "benutzer: " + benutzer + "; kennwort: " + kennwort);

    //JRW Encryption
    JrwCrypt jrwCrypt = new JrwCrypt();
    try {
      encpwd = jrwCrypt.tpEncrypt(kennwort);
      MyLogger.log(className, "encpwd: " + encpwd);

      try {
        //Login über REST-Schnittstelle
        if (login(benutzer, encpwd)) {
          retval = "{\"data\":[\"0\",\"OK\"]}";
        } else {
          //retval = "{\"data\":[\"-1\",\"Falsches Kennwort\"]}";
          //retval = "{\"data\":[\"retcode: 0\",\"retmsg: \"OK\"\"]}";
          retval = "{\n"
                  + "  \"data\" : {\n"
                  + "    \"retcode\" : 0,\n"
                  + "    \"retmsg\" : \"OK\"\n"
                  + "   }\n"
                  + " }";
          System.out.println("login.java: retval: " + retval);
        }
      } catch (Exception ex) {
        MyLogger.log(className, ex.getMessage());
      }
    } catch (NoSuchAlgorithmException | NoSuchPaddingException
            | InvalidKeyException | IllegalBlockSizeException
            | BadPaddingException ex) {
      //retval = "{\"data\":[\"-2\",\"" + ex.getMessage() + "\"]}";
      MyLogger.log(className, ex.getMessage());
    }

    try (PrintWriter out = response.getWriter()) {
      out.println(retval);
    }
  }

// HTTP POST request Kennwort
  private String getKennwort(String benutzer) throws Exception {
    String JSON_STRING
            = "{\n"
            + "  \"dialogIdent\" : {\n"
            + "    \"dialogIdent\" : 1,\n"
            + "    \"dialog\" : {\n"
            + "      \"kuerzel\" : \"dia_kuerzel\",\n"
            + "      \"guiPackage\" : \"proj.guibasic.gui.\",\n"
            + "      \"isStartDialog\" : false,\n"
            + "      \"multisystem\" : {\n"
            + "        \"DefaultMultisystem\" : {\n"
            + "          \"id\" : \"EFLSKA\"\n"
            + "        }\n"
            + "      }\n"
            + "    },\n"
            + "    \"stationName\" : \"STATIONS-NAME\",\n"
            + "    \"appID\" : \"APPID\",\n"
            + "    \"benutzer\" : \"EUGEN-TEST\",\n"
            + "    \"stationAdr\" : \"STATIONS-IP\",\n"
            + "    \"dialogVersion\" : null,\n"
            + "    \"separateSession\" : false,\n"
            + "    \"osUser\" : \"jenkins\",\n"
            + "    \"locale\" : {\n"
            + "       \"language\" : \"de\",\n"
            + "       \"country\" : \"DE\"\n"
            + "     }\n"
            + "   },\n"
            + "   \"parameter\" : {\n"
            + "     \"SelectStmtParameter\" : {\n"
            + "       \"sqlSelectStmt\" : "
            + "\"SELECT KENNWORT FROM elvisdiasystem.V_LOGIN_DATA where benutzer = '"
            + benutzer + "'\"\n"
            + "     }\n"
            + "   }\n"
            + " }";

    MyLogger.log(className, "JSON_STRING: " + JSON_STRING);

//    http://elvisdev.ka.tup.com:8020/elvis-devRESTfulService-0.0.1-SNAPSHOT/rest/read/select/list
//    URL url = new URL("http://www.android.com/");
//    HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
//    try {
//      InputStream in = new BufferedInputStream(urlConnection.getInputStream());
//      InputStreamReader inputReader = new InputStreamReader(in, "utf-8");
//      BufferedReader buffReader = new BufferedReader(inputReader);
//      System.out.print("Write a line :");
//      String line = buffReader.readLine();
//      System.out.println("Line read :" + line);
//    } finally {
//      urlConnection.disconnect();
//    }
    StringEntity requestEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
    HttpClient client = new DefaultHttpClient();
    HttpPost postMethod = new HttpPost("http://elvisdev.ka.tup.com:8020/elvis-devRESTfulService-0.0.1-SNAPSHOT/rest/read/select/list");

    String auth = "jbox-user:tup2014";
    byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.ISO_8859_1));
    String authHeader = "Basic " + new String(encodedAuth);
    postMethod.setHeader(HttpHeaders.AUTHORIZATION, authHeader);
    postMethod.setHeader("Content-Type", "application/json");
    postMethod.setEntity(requestEntity);
    HttpResponse rawResponse = client.execute(postMethod);

    MyLogger.log(className, "statusCode: " + rawResponse.getStatusLine().getStatusCode());
    MyLogger.log(className, "rawResponse: " + rawResponse);

    InputStream is = rawResponse.getEntity().getContent();
    BufferedReader rd = new BufferedReader(new InputStreamReader(is));

    StringBuilder result = new StringBuilder();
    String line = "";
    while ((line = rd.readLine()) != null) {
      result.append(line);
    }

    /* result: 
    {"hasBabylonTexte":false,"queryDate":"20190115 15:05:23.972 MEZ",
    "memoryLimitReached":false,"requestCancelled":false,"recordLimit":0,
    "data":[["37#32#95#-34#-107#-109#80#97#79#74#-116#-108#-117#-11#5#45"]]}    
     */
    MyLogger.log(className, "result: " + result.toString());
    String jsonString = result.toString();
    Gson gson = new Gson();
    LoginItem loginItem = gson.fromJson(jsonString, LoginItem.class
    );

    String _kennwort = loginItem.getData()[0][0];
    MyLogger.log(className, "_kennwort: " + _kennwort);

    //Release connection   
    rd.close();
    is.close();

    return _kennwort;
  }

  // HTTP POST request Login
  private boolean login(String benutzer, String encpwd) throws Exception {
    String url = "http://elvisdev.ka.tup.com:8020/elvis-devRESTfulService-0.0.1-SNAPSHOT/rest/core/login";
    String JSON_STRING
            = "{\n"
            + "  \"dialogIdent\" : {\n"
            + "    \"dialogIdent\" : 1,\n"
            + "    \"dialog\" : {\n"
            + "      \"kuerzel\" : \"mainframe\",\n"
            + "      \"guiPackage\" : \"proj.guibasic.gui.\",\n"
            + "      \"isStartDialog\" : false,\n"
            + "      \"multisystem\" : {\n"
            + "        \"DefaultMultisystem\" : {\n"
            + "          \"id\" : \"EFLSKA\"\n"
            + "        }\n"
            + "      }\n"
            + "    },\n"
            + "    \"stationName\" : \"PC3012\",\n"
            + "    \"appID\" : \"123456\",\n"
            + "    \"benutzer\" : \"e.druta\",\n"
            + "    \"stationAdr\" : \"172.31.13.12\",\n"
            + "    \"dialogVersion\" : null,\n"
            + "    \"separateSession\" : false,\n"
            + "    \"osUser\" : \"e.druta\",\n"
            + "    \"locale\" : {\n"
            + "       \"language\" : \"de\",\n"
            + "       \"country\" : \"DE\"\n"
            + "     }\n"
            + "   },\n"
            + "   \"parameter\" : {\n"
            + "     \"LoginParameter\" : {\n"
            + "       \"user\" : " + " \"" + benutzer + "\",\n"
            + "       \"password\" : " + " \"" + encpwd + "\",\n"
            + "       \"stationAdr\" : \"172.31.13.12\",\n"
            + "       \"station\" : \"PC3012\",\n"
            //+ "       \"barcodePin\" : " + " \"" + encpwd + "\",\n"
            + "       \"successClientCallbackPort\" : \"1250\"\n"
            + "     }\n"
            + "   }\n"
            + " }";

    MyLogger.log(className, "login(): JSON_STRING: " + JSON_STRING);

    StringEntity requestEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
    HttpClient client = new DefaultHttpClient();
    HttpPost postMethod = new HttpPost(url);

    String auth = "jbox-user:tup2014";
    byte[] encodedAuth = Base64.encodeBase64(auth.getBytes(StandardCharsets.ISO_8859_1));
    String authHeader = "Basic " + new String(encodedAuth);
    postMethod.setHeader(HttpHeaders.AUTHORIZATION, authHeader);
    postMethod.setHeader("Content-Type", "application/json");
    postMethod.setEntity(requestEntity);
    HttpResponse rawResponse = client.execute(postMethod);

    MyLogger.log(className, "login(): statusCode: " + rawResponse.getStatusLine().getStatusCode());
    MyLogger.log(className, "login(): rawResponse: " + rawResponse);

    InputStream is = rawResponse.getEntity().getContent();
    BufferedReader rd = new BufferedReader(new InputStreamReader(is));

    StringBuilder result = new StringBuilder();
    String line = "";
    while ((line = rd.readLine()) != null) {
      result.append(line);
    }

    MyLogger.log(className, "login(): result: " + result.toString());
    String jsonString = result.toString();
    Gson gson = new Gson();
    LoginItem loginItem = gson.fromJson(jsonString, LoginItem.class);

    //String _kennwort = loginItem.getData()[0][0];
    //MyLogger.log(className, "_kennwort: " + _kennwort);
    //Release connection   
    rd.close();
    is.close();

    return false;
  }
// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.

  /**
   * /**
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
    MyLogger.log(className, "doGet()");    
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
    MyLogger.log(className, "doPost()");
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
