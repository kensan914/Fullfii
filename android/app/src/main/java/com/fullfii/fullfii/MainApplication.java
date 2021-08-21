package com.fullfii.fullfii;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.actionsheet.ActionSheetPackage;
import im.shimo.react.prompt.RNPromptPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
// import com.facebook.react.BuildConfig; // HACK:
import com.fullfii.fullfii.generated.BasePackageList;

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;

import expo.modules.updates.UpdatesController;
import com.airbnb.android.react.lottie.LottiePackage; // https://github.com/lottie-react-native/lottie-react-native#installing-react-native--0600

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import javax.annotation.Nullable;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import com.fullfii.fullfii.Debug;

public class MainApplication extends Application implements ReactApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(
      new BasePackageList().getPackageList());

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      // return BuildConfig.DEBUG;
      return Debug.debug;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new ModuleRegistryAdapter(mModuleRegistryProvider));
      packages.add(new LottiePackage()); // https://github.com/lottie-react-native/lottie-react-native#installing-react-native--0600
      // https://github.com/crazycodeboy/react-native-splash-screen/issues/522
      // packages.add(new SplashScreenReactPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }

    @Override
    protected @Nullable String getJSBundleFile() {
      // if (BuildConfig.DEBUG) {
      if (Debug.debug) {
        return super.getJSBundleFile();
      } else {
        return UpdatesController.getInstance().getLaunchAssetFile();
      }
    }

    @Override
    protected @Nullable String getBundleAssetName() {
      // if (BuildConfig.DEBUG) {
      if (Debug.debug) {
        return super.getBundleAssetName();
      } else {
        return UpdatesController.getInstance().getBundleAssetName();
      }
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    // if (!BuildConfig.DEBUG) {
    if (!Debug.debug) {
      UpdatesController.initialize(this);
    }
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    // if (BuildConfig.DEBUG) {
    if (Debug.debug) {
      try {
        /*
         * We use reflection here to pick up the class that initializes Flipper, since
         * Flipper library is not available in release mode
         */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
