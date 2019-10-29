package rest.auftdet;

public class AuftdetItem {

  String[][] data;

  public AuftdetItem(int anzRow, int anzCol) {
    data = new String[anzRow][anzCol];
  }

  public String[][] getData() {
    return data;
  }

  public void setData(String[][] data) {
    this.data = data;
  }
}
