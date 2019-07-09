package rest.auftdet;

public class Detaildata {

  String[][] data = new String[5][6];

  public Detaildata() {
    String[] dataItem = new String[6];

    for (int i = 0; i < 5; i++) {
      for (int j = 0; j < 6; j++) {
        dataItem[j] = j + "Tiger Nixon";
        data[i][j] = dataItem[j];
      }
    }
  }

  public String[][] getData() {
    return data;
  }

  public void setData(String[][] data) {
    this.data = data;
  }

}
