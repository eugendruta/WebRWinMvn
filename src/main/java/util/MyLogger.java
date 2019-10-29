package util;

/**
 *
 * @author e.druta
 */
public class MyLogger {

  public MyLogger() {
  }

  public static void log(String klasse, String message) {
    System.out.println(klasse + ": " + message);
  }
}
