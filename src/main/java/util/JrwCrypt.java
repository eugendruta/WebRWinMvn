package util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class JrwCrypt {

  private final String charset = "ISO-8859-1";
  private static final int cryptBitSize = 128;
  private static final String algorithm = "AES";
  private static final String cryptKey = "tup2013JrwGuibasicSchluessel";

  private java.security.Key createSecretKey(String key, String algorithm, int cryptBitSize) {
    // ID für Schlüssel auf die cryptBitSize zurecht schneiden
    byte[] arrID = new byte[cryptBitSize / 8];
    if (key.getBytes().length < cryptBitSize / 8) {
      // Key erweitern
      byte[] tmp = key.getBytes();
      for (int i = 0; i < (cryptBitSize / 8 - tmp.length); i++) {
        arrID[i] = (byte) 0x0;
      }
      for (int i = (cryptBitSize / 8 - tmp.length); i < arrID.length; i++) {
        arrID[i] = tmp[i - (cryptBitSize / 8 - tmp.length)];
      }
    } else if (key.getBytes().length > cryptBitSize / 8) {
      // Key reduizieren
      byte[] tmp = key.getBytes();
      for (int i = 0; i < cryptBitSize / 8; i++) {
        arrID[i] = tmp[i];
      }
    } else if (key.getBytes().length == cryptBitSize / 8) {
      arrID = key.getBytes();
    }

    // SecretKey erzeugen
    java.security.Key secretKey = new javax.crypto.spec.SecretKeySpec(arrID, algorithm);

    return secretKey;
  }

  /**
   * String entschlüsseln mit standard/eigenen cryptKey
   *
   * @param verschluesselterString
   * @return
   * @throws NoSuchPaddingException
   * @throws NoSuchAlgorithmException
   * @throws InvalidKeyException
   * @throws BadPaddingException
   * @throws IllegalBlockSizeException
   * @throws UnsupportedEncodingException
   */
  public String tpDecrypt(String verschluesselterString) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, UnsupportedEncodingException, IllegalBlockSizeException, BadPaddingException {
    return tpDecrypt(verschluesselterString, cryptKey);
  }

  /**
   * String entschlüsseln
   *
   * @param verschluesselterString
   * @param key
   * @return
   * @throws NoSuchPaddingException
   * @throws NoSuchAlgorithmException
   * @throws InvalidKeyException
   * @throws BadPaddingException
   * @throws IllegalBlockSizeException
   * @throws UnsupportedEncodingException
   */
  public String tpDecrypt(String verschluesselterString, String key) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, UnsupportedEncodingException, IllegalBlockSizeException, BadPaddingException {
    String decryptedString = null;
    byte[] verschluesselterStringInBytes = null;

    // Bytes lesen, aus String getrennt durch #
    String[] bytesAsString = verschluesselterString.split("#"); //$NON-NLS-1$
    verschluesselterStringInBytes = new byte[bytesAsString.length];
    for (int i = 0; i < bytesAsString.length; i++) {
      int iByteWert = Integer.parseInt(bytesAsString[i]);
      verschluesselterStringInBytes[i] = (byte) iByteWert;
    }

    javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(algorithm);
    cipher.init(javax.crypto.Cipher.DECRYPT_MODE, createSecretKey(key, algorithm, cryptBitSize));

    decryptedString = new String(cipher.doFinal(verschluesselterStringInBytes), charset);

    return decryptedString;
  }

  /**
   * String verschlüsseln mit standard/eigenen cryptKey
   *
   * @param unverschluesselterString
   * @return
   * @throws NoSuchPaddingException
   * @throws NoSuchAlgorithmException
   * @throws InvalidKeyException
   * @throws BadPaddingException
   * @throws IllegalBlockSizeException
   */
  public String tpEncrypt(String unverschluesselterString) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    return tpEncrypt(unverschluesselterString, cryptKey);
  }

  /**
   * String verschlüsseln
   *
   * @param unverschluesselterString
   * @param key
   * @return
   * @throws NoSuchPaddingException
   * @throws NoSuchAlgorithmException
   * @throws InvalidKeyException
   * @throws BadPaddingException
   * @throws IllegalBlockSizeException
   */
  public String tpEncrypt(String unverschluesselterString, String key) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
    String encryptedString = null;

    // String verschlüsseln
    javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(algorithm);
    cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, createSecretKey(key, algorithm, cryptBitSize));

    byte[] encryptedBytes = cipher.doFinal(unverschluesselterString.getBytes());

    // ByteStream in getrennt durch # in einem String speichern
    for (int i = 0; i < encryptedBytes.length; i++) {
      if (encryptedString == null || encryptedString.trim().length() == 0) {
        encryptedString = encryptedBytes[i] + ""; //$NON-NLS-1$
      } else {
        encryptedString += "#" + encryptedBytes[i]; //$NON-NLS-1$
      }
    }

    return encryptedString;
  }
}
