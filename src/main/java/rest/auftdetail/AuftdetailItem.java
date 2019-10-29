package rest.auftdetail;

public class AuftdetailItem {

  String[][] data;

  public AuftdetailItem(int anzRow, int anzCol) {
    data = new String[anzRow][anzCol];
  }

  public String[][] getData() {
    return data;
  }

  public void setData(String[][] data) {
    this.data = data;
  }
}
