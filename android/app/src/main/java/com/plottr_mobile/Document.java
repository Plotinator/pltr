package com.plottr_mobile;

import android.content.ContentResolver;
import android.net.Uri;
import android.os.ParcelFileDescriptor;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class Document extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  Document(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "AndroidDocument";
  }


  @ReactMethod
  public void saveDocument(String docURI, String docData) {

    try {
      Uri uri = Uri.parse(docURI);
      ContentResolver contentResolver = reactContext.getContentResolver();
      ParcelFileDescriptor pfd = contentResolver.openFileDescriptor(uri, "w");
      FileOutputStream fileOutputStream = new FileOutputStream(pfd.getFileDescriptor());
      fileOutputStream.write(docData.getBytes());
      // Let the document provider know you're done by closing the stream.
      fileOutputStream.close();
      pfd.close();
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
