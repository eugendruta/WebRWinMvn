package rest.auftueb;

public class AuftuebItem {

  String[][] data;

  public AuftuebItem(int anzRow, int anzCol) {
    data = new String[anzRow][anzCol];
  }

  public String[][] getData() {
    return data;
  }

  public void setData(String[][] data) {
    this.data = data;
  }
}
