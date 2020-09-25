/*!

 =========================================================
 * Material Kit React Native - v1.4.0
 =========================================================
 * Product Page: https://demos.creative-tim.com/material-kit-react-native/
 * Copyright 2019 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/creativetimofficial/material-kit-react-native/blob/master/LICENSE)
 =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
blabla
*/

import React, { useState, useCallback } from "react";
import { Platform, StatusBar, Image, Text } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Block, GalioProvider } from "galio-framework";

import { Images, products, materialTheme } from "./constants/";

import { NavigationContainer } from "@react-navigation/native";
import Screens from "./navigation/Screens";

import { createTables, dropTables } from "./services/models";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

// cache app images
const assetImages = [
  Images.Pro,
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
];

// cache product images
products.map((product) => assetImages.push(product.image));

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App(props) {
  useCallback(async () => {
    //await dropTables();
    await createTables();
    console.log("Tablas creadas");
  }, [])();

  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  const _loadResourcesAsync = async () => {
    const assetFont = Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    return Promise.all([assetFont, ...cacheImages(assetImages)]);
  };

  const _handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  const _handleFinishLoading = () => {
    setIsLoadingComplete(true);
  };

  return (
    <React.Fragment>
      {!isLoadingComplete && !props.skipLoadingScreen && (
        <AppLoading
          startAsync={_loadResourcesAsync}
          onError={_handleLoadingError}
          onFinish={_handleFinishLoading}
        />
      )}
      {isLoadingComplete && (
        <NavigationContainer>
          <GalioProvider theme={materialTheme}>
            <Block flex>
              {Platform.OS === "ios" && <StatusBar barStyle="default" />}
              <Screens />
            </Block>
          </GalioProvider>
        </NavigationContainer>
      )}
    </React.Fragment>
  );
}
