package rest.callux;

import rest.auftueb.*;

public class LoginItem {

  /* result: 
    {"hasBabylonTexte":false,"queryDate":"20190115 15:05:23.972 MEZ",
    "memoryLimitReached":false,"requestCancelled":false,"recordLimit":0,
    "data":[["37#32#95#-34#-107#-109#80#97#79#74#-116#-108#-117#-11#5#45"]]}    
   */
  String[][] data;

  public LoginItem(int anzRow, int anzCol) {
    data = new String[anzRow][anzCol];
  }

  public String[][] getData() {
    return data;
  }

  public void setData(String[][] data) {
    this.data = data;
  }
}
