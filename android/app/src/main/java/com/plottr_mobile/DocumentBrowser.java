package com.plottr_mobile;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class DocumentBrowser extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private static final int CREATE_REQUEST_CODE = 1;
  private static final int OPEN_REQUEST_CODE = 2;
  private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
  private static final String E_BROWSER_CANCELLED = "E_BROWSER_CANCELLED";
  private static final String E_FAILED_TO_SHOW_BROWSER = "E_FAILED_TO_SHOW_BROWSER";
  private static final String E_NO_DOCUMENT_DATA_FOUND = "E_NO_DOCUMENT_DATA_FOUND";
  private Promise browserPromise; // promise is used for failures
  private int currentAction;
  private final String newFileString = "{\"newFile\":true}";

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
      if (browserPromise != null) {
        if (resultCode == Activity.RESULT_CANCELED) {
          browserPromise.reject(E_BROWSER_CANCELLED, "Browser was cancelled");
          browserPromise = null;
          currentAction = 0;
        } else if (resultCode == Activity.RESULT_OK) {
          if (requestCode == OPEN_REQUEST_CODE) {
            Uri uri = intent.getData();

            if (uri == null) {
              browserPromise.reject(E_NO_DOCUMENT_DATA_FOUND, "No document data found");
            } else {
              WritableMap map = getFileData(uri, false);
              sendEvent(reactContext, "onOpenDocument", map);
            }
            browserPromise = null;
            currentAction = 0;
          }
          if (requestCode == CREATE_REQUEST_CODE) {
            Uri uri = intent.getData();

            if (uri == null) {
              browserPromise.reject(E_NO_DOCUMENT_DATA_FOUND, "No document data found");
            } else {
              WritableMap map = getFileData(uri, true);
              sendEvent(reactContext, "onOpenDocument", map);
            }

            browserPromise = null;
            currentAction = 0;
          }
        }


      }
    }
  };

  DocumentBrowser(ReactApplicationContext context) {
    super(context);
    reactContext = context;

    // Add the listener for `onActivityResult`
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public String getName() {
    return "AndroidDocumentBrowser";
  }

  @ReactMethod
  public void openBrowser (final String action, final Promise promise) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
      return;
    }

    browserPromise = promise;

    try {
      if (action.equals("open")) {
        Intent openIntent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        openIntent.addCategory(Intent.CATEGORY_OPENABLE);
        openIntent.setType("*/*");
        currentActivity.startActivityForResult(openIntent, OPEN_REQUEST_CODE);
        currentAction = OPEN_REQUEST_CODE;
      } else if (action.equals("create")) {
        Intent createIntent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        createIntent.addCategory(Intent.CATEGORY_OPENABLE);
        createIntent.setType("*/*");
        createIntent.putExtra(Intent.EXTRA_TITLE, "story.pltr");
        currentActivity.startActivityForResult(createIntent, CREATE_REQUEST_CODE);
        currentAction = CREATE_REQUEST_CODE;
      }
    } catch (Exception e) {
      browserPromise.reject(E_FAILED_TO_SHOW_BROWSER, e);
      browserPromise = null;
      currentAction = 0;
    }

  }

  @ReactMethod
  public void closeBrowser () {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      return;
    }

    currentActivity.finishActivity(currentAction);
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  private WritableMap getFileData (Uri uri, Boolean isNew) {
    WritableMap map = Arguments.createMap();
    map.putString("documentURL", uri.toString());

    String name = readNameFromUri(uri);
    map.putString("storyName", name);

    String data;
    if (isNew) {
      data = newFileString;
    } else {
      data = readTextFromUri(uri);
      if (data == "" || data == null) {
        data = newFileString;
      }
    }
    map.putString("data", data);

    return map;
  }

  private String readNameFromUri(final Uri uri) {
    String fileName = "";
    ContentResolver contentResolver = reactContext.getContentResolver();
    Cursor returnCursor = contentResolver.query(uri, null, null, null, null);
    if (returnCursor != null && returnCursor.moveToFirst()) {
      int nameIndex = returnCursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
//          int sizeIndex = returnCursor!!.getColumnIndex(OpenableColumns.SIZE);
      fileName = returnCursor.getString(nameIndex);
      returnCursor.close();
    }

    return fileName;
  }

  private String readTextFromUri(final Uri uri) {
    try {
      ContentResolver contentResolver = reactContext.getContentResolver();
      InputStream inputStream = contentResolver.openInputStream(uri);
      BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
      StringBuilder stringBuilder = new StringBuilder();
      String currentline = reader.readLine();

      while (currentline != null) {
        stringBuilder.append(currentline + "\n");
        currentline = reader.readLine();
      }
      inputStream.close();
      return stringBuilder.toString();
    } catch (IOException e) {
      // Handle error here
    }
    return "";
  }
}
