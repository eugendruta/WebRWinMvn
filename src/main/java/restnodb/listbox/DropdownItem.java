package restnodb.listbox;

import com.google.gson.annotations.SerializedName;
import java.util.ArrayList;

public class DropdownItem {

  @SerializedName("id")
  private String id;
  @SerializedName("name")
  private String name;

  public DropdownItem() {
  }

  public DropdownItem(String id, String name) {
    this.id = id;
    this.name = name;
  }

  DropdownItem(ArrayList<Object> columns) {
    if (columns.get(0) instanceof java.math.BigDecimal) {
      this.id = ((java.math.BigDecimal) columns.get(0)).toString();
    } else if (columns.get(0) instanceof oracle.sql.TIMESTAMP) {
      this.id = ((oracle.sql.TIMESTAMP) columns.get(0)).toString();
    } else {
      //ev typeof String
      this.id = (String) columns.get(0);
    }

    if (columns.get(1) instanceof java.math.BigDecimal) {
      this.name = ((java.math.BigDecimal) columns.get(1)).toString();
    } else if (columns.get(1) instanceof oracle.sql.TIMESTAMP) {
      this.name = ((oracle.sql.TIMESTAMP) columns.get(1)).toString();
    } else {
      //ev typeof String
      this.name = (String) columns.get(1);
    }
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

}
