import React from "react";
import { Easing, Animated, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { Block, Text, theme } from "galio-framework";

import ComponentsScreen from "../screens/Components";
import HomeScreen from "../screens/Home";
import OnboardingScreen from "../screens/Onboarding";
import ProfileScreen from "../screens/Profile";
import ProScreen from "../screens/Pro";
import SettingsScreen from "../screens/Settings";
import IngresosScreen, { RegistrarIngresoScreen } from "../screens/Ingresos";
import EgresosScreen, { RegistrarEgresoScreen } from "../screens/Egresos";
import TarjetasScreen from "../screens/Tarjetas";
import CuentasBancariasScreen from "../screens/CuentasBancarias";
import CuentasRegistrarScreen from "../screens/CuentasRegistrar";
import InversionesScreen, {
  RegistrarInversionScreen,
} from "../screens/Inversiones";
import PrestamosScreen from "../screens/Prestamos";
import PresupuestosScreen from "../screens/Presupuestos";

import CustomDrawerContent from "./Menu";
import { Icon, Header } from "../components";
import { Images, materialTheme } from "../constants/";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const profile = {
  //Reemplazar por informacion dinamica del usuario
  avatar: Images.Profile,
  name: "Nombre Usuario",
  type: "",
  plan: "",
  rating: 4.8,
};

function IngresosStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Ingresos"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Ingresos"
        component={IngresosScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Ingresos" scene={scene} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="NuevoIngreso"
        component={RegistrarIngresoScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Ingresos / Nuevo Ingreso"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function EgresosStack(props) {
  return (
    <Stack.Navigator initialRouteName="Egresos" mode="card" headerMode="screen">
      <Stack.Screen
        name="Egresos"
        component={EgresosScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Egresos" scene={scene} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="NuevoEgreso"
        component={RegistrarEgresoScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Egresos / Nuevo Egreso"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function TarjetasStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Tarjetas"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Tarjetas"
        component={TarjetasScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Tarjetas" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function CuentasBancariasStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="CuentasBancarias"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="CuentasBancarias"
        component={CuentasBancariasScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Cuentas Bancarias"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
      <Stack.Screen
        name="RegistrarCuenta"
        component={CuentasRegistrarScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Cuentas Bancarias / Registrar Cuenta"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function InversionesStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Inversiones"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Inversiones"
        component={InversionesScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Inversiones" scene={scene} navigation={navigation} />
          ),
        }}
      />
      <Stack.Screen
        name="NuevaInversion"
        component={RegistrarInversionScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Inversiones / Registrar Inversion"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function PrestamosStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Prestamos"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Prestamos"
        component={PrestamosScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Prestamos" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function PresupuestosStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Presupuestos"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Presupuestos"
        component={PresupuestosScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Presupuestos"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      mode="card"
      headerMode="screen"
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ComponentsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Components"
        component={ComponentsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Components" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              tabs
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Pro"
        component={ProScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} profile={profile} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Ingresos"
        component={IngresosStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Egresos"
        component={EgresosStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Tarjetas"
        component={TarjetasStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Cuentas Bancarias"
        component={CuentasBancariasStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Inversiones"
        component={InversionesStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Prestamos"
        component={PrestamosStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Presupuestos"
        component={PresupuestosStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="gears"
              family="font-awesome"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Components"
        component={ComponentsStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-switch"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: 2, marginLeft: 2 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Iniciar Sesión"
        component={ProScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

/*
const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header white transparent title="Profile" navigation={navigation} />,
      headerTransparent: true,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});

const SettingsStack = createStackNavigator({
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header title="Settings" navigation={navigation} />,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});

const ComponentsStack = createStackNavigator({
  Components: {
    screen: ComponentsScreen,
    navigationOptions: ({ navigation }) => ({
      header: <Header title="Components" navigation={navigation} />,
    })
  },
}, {
  cardStyle: { backgroundColor: '#EEEEEE', },
  transitionConfig,
});


const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header search tabs title="Home" navigation={navigation} />,
    })
  },
  Pro: {
    screen: ProScreen,
    navigationOptions: ({navigation}) => ({
      header: <Header back white transparent title="" navigation={navigation} />,
      headerTransparent: true,
    })
  },
},
{
  cardStyle: {
    backgroundColor: '#EEEEEE', //this is the backgroundColor for the app
  },
  transitionConfig,
});

const AppStack = createDrawerNavigator(
  {
    Onboarding: {
      screen: OnboardingScreen,
      navigationOptions: {
        drawerLabel: () => {},
      },
    },
    Home: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Home" title="Home" />
        )
      }
    },
    Woman: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Woman" />
        ),
      }),
    },
    Man: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Man" />
        ),
      }),
    },
    Kids: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Kids" />
        ),
      }),
    },
    NewCollection: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="New Collection" />
        ),
      }),
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Profile" title="Profile" />
        ),
      }),
    },
    Settings: {
      screen: SettingsStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Settings" title="Settings" />
        ),
      }),
    },
    Components: {
      screen: ComponentsStack,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Components" title="Components" />
        ),
      }),
    },
    MenuDivider: {
      screen: HomeStack,
      navigationOptions: {
        drawerLabel: () => <Block style={{marginVertical: 8}}><Text>{` `}</Text></Block>,
      },
    },
    SignIn: {
      screen: ProScreen,
      navigationOptions: (navOpt) => ({
        drawerLabel: ({focused}) => (
          <Drawer focused={focused} screen="Pro" title="Iniciar Sesión" />
        ),
      }),
    },
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;

*/
