package rest.listbox;

import java.util.ArrayList;

public class Dropdown {

  ArrayList<DropdownItem> dropdown = new ArrayList<>();

  /*  
          = {new DropdownItem("11", "Option 11"),
            new DropdownItem("2", "Option 2"),
            new DropdownItem("3", "Option 3"),
            new DropdownItem("4", "Option 4"),
            new DropdownItem("5", "Option 5"),};
   */
  public Dropdown() {
  }

  public ArrayList<DropdownItem> getDropdown() {
    return dropdown;
  }

  public void setDropdown(ArrayList<DropdownItem> dropdown) {
    this.dropdown = dropdown;
  }

}
