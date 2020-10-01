import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import {
  Container,
  Header,
  Content,
  Footer,
  Button,
  Picker,
  Icon,
} from "native-base";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryGroup,
  VictoryStack,
  VictoryContainer,
} from "victory-native";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";
import {
  Egreso,
  Cuenta,
  Presupuesto,
  PresupuestoDetalle,
  EGRESOS_MEDIO_PAGO_OPCIONES,
  EGRESOS_RUBROS_OPCIONES,
  BANCOS_OPCIONES,
} from "../services/models";
import {
  formatDate,
  formatDateMonthAndYear,
  formatDateTime,
  formatNumber,
  timestamp,
} from "../services/common";
import _ from "lodash";

const DashboardScreen = ({ route, navigation, props }) => {
  const [version, setVersion] = useState();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setVersion(timestamp());
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Container>
      <Content>
        <Dashboard {...route.params} version={version} />
      </Content>
    </Container>
  );
};

const { width } = Dimensions.get("screen");
const width2 = width * 0.95;

const GastosPorMedioDePagoChart = (props) => (
  <React.Fragment>
    <VictoryChart
      width={width2}
      theme={VictoryTheme.material}
      domainPadding={{ x: 60 }}
      padding={{ top: 60, bottom: 50, left: 110, right: 0 }}
    >
      <VictoryAxis
        style={{
          tickLabels: { fill: "transparent" },
        }}
      />
      <VictoryBar
        data={props.data}
        style={{
          data: {
            fill: ({ datum }) => (datum.i % 2 === 0 ? "#4f73f2" : "#d84343"),
          },
        }}
      />
      <VictoryAxis dependentAxis />
    </VictoryChart>
  </React.Fragment>
);

const SaldoPorCuentaBancariaChart = (props) => (
  <React.Fragment>
    <VictoryChart
      width={width2}
      theme={VictoryTheme.material}
      domainPadding={{ x: 60 }}
      padding={{ top: 60, bottom: 50, left: 95, right: 0 }}
    >
      <VictoryAxis
        style={{
          tickLabels: { fill: "transparent" },
        }}
      />
      <VictoryBar
        data={props.data}
        style={{
          data: {
            fill: ({ datum }) => (datum.y < 160000 ? "#d84343" : "#4f73f2"),
          },
        }}
      />
      <VictoryAxis dependentAxis />
    </VictoryChart>
  </React.Fragment>
);

const PresupuestoTotalVSGastadoChart = (props) => (
  <React.Fragment>
    <VictoryChart
      width={width2}
      theme={VictoryTheme.material}
      domainPadding={{ x: 60 }}
      padding={{ top: 60, bottom: 50, left: 110, right: 0 }}
    >
      <VictoryAxis
        style={{
          tickLabels: { fill: "transparent" },
        }}
      />
      <VictoryBar
        data={props.data}
        style={{
          data: {
            fill: ({ datum }) => (datum.y < 160000 ? "#d84343" : "#4f73f2"),
          },
        }}
      />
      <VictoryAxis dependentAxis />
    </VictoryChart>
  </React.Fragment>
);

const PresupuestoRealVSDesvioChart = (props) => {
  const dataA = [
    { x: "Alquiler", y: 57 },
    { x: "Expensas", y: 40 },
    { x: "Luz", y: 38 },
    { x: "Gas", y: 37 },
    { x: "Cable", y: 25 },
    { x: "Internet", y: 19 },
    { x: "Teléfono", y: 15 },
    { x: "Servicio de Limpieza", y: 13 },
    { x: "Servicio de Lavado", y: 12 },
    { x: "Reparación en el hogar", y: 34 },
    { x: "Reparación del Auto", y: 60 },
    { x: "Cuota de Préstamo", y: 14 },
    { x: "Impuestos Nacionales", y: 67 },
    { x: "Educación", y: 25 },
    { x: "Salud", y: 40 },
    { x: "Comida", y: 67 },
    { x: "Gimnasio", y: 80 },
    { x: "Transporte", y: 35 },
    { x: "Hospedaje", y: 39 },
    { x: "Viáticos", y: 20 },
    { x: "Transporte al Viajar", y: 70 },
    { x: "Entretenimiento", y: 34 },
    { x: "Comer afuera", y: 19 },
    { x: "Cine", y: 40 },
    { x: "Compra de Ropa", y: 61 },
    { x: "Compra para el Hogar", y: 56 },
    { x: "Compra de Dólares", y: 54 },
    { x: "Compra de Criptomonedas", y: 68 },
    { x: "Extraordinario", y: 43 },
    { x: "Otro", y: 56 },
  ];

  const dataB = dataA.map((point) => {
    const y = Math.round(point.y + 3 * (Math.random() - 0.5));
    return { ...point, y };
  });

  const height = 1200;

  return (
    <React.Fragment>
      <VictoryChart horizontal height={height} width={width2} padding={40}>
        <VictoryStack style={{ data: { width: 25 }, labels: { fontSize: 15 } }}>
          <VictoryBar
            style={{ data: { fill: "tomato" } }}
            data={dataA}
            y={(data) => -Math.abs(data.y)}
            labels={({ datum }) => `${Math.abs(datum.y)}%`}
          />
          <VictoryBar
            style={{ data: { fill: "orange" } }}
            data={dataB}
            labels={({ datum }) => `${Math.abs(datum.y)}%`}
          />
        </VictoryStack>

        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fontSize: 15, fill: "black" },
          }}
          tickLabelComponent={
            <VictoryLabel x={width2 / 2} textAnchor="middle" />
          }
          tickValues={dataA.map((point) => point.x).reverse()}
        />
      </VictoryChart>
    </React.Fragment>
  );
};

const PresupuestoRealVSDesvioChart2 = (props) => {
  return (
    <React.Fragment>
      <VictoryChart
        height={450}
        width={Dimensions.width}
        domainPadding={{ x: 60 }}
        padding={{ top: 20, bottom: 50, left: 10, right: 120 }}
      >
        <VictoryGroup offset={20} colorScale={"qualitative"} horizontal>
          <VictoryBar data={props.data.real} />
          <VictoryBar
            data={props.data.estimado}
            labelComponent={
              <VictoryLabel
                dy={-15}
                textAnchor="start"
                backgroundPadding={[3, { left: 20, right: 20 }, { left: 20 }]}
                backgroundStyle={[{ fill: "white", opacity: 0.4 }]}
              />
            }
          />
        </VictoryGroup>
        <VictoryAxis dependentAxis />
        <VictoryAxis
          style={{
            tickLabels: { fill: "transparent" },
          }}
        />
      </VictoryChart>
    </React.Fragment>
  );
};

const Dashboard = (props) => {
  const [gastosDelMesData, setGastosDelMesData] = useState([]);
  const [cuentasData, setCuentasData] = useState([]);
  const [gastoRealVSEstimadoData, setGastoRealVSEstimadoData] = useState({});
  const [gastoRealVSEstimadoPagina, setGastoRealVSEstimadoPagina] = useState(1);
  const [
    gastoRealVSEstimadoCantidadDetalle,
    setGastoRealVSEstimadoCantidadDetalle,
  ] = useState(0);

  const fetchDataGastosPorMedioPago = async () => {
    const gastos = await Egreso.sumaMesActualYMedioPago();
    const gastosData = gastos.map(({ medio_pago, cantidad }, i) => ({
      x: medio_pago,
      y: formatNumber(cantidad),
      label: EGRESOS_MEDIO_PAGO_OPCIONES[medio_pago].split(" "),
      i,
    }));
    setGastosDelMesData(gastosData);
  };

  const fetchDataSaldoPorCuenta = async () => {
    const cuentas = await Cuenta.saldoPorCuenta();
    const cuentasData = cuentas.map(
      ({ id, saldo, numero, banco_asociado }, i) => ({
        x: id,
        y: saldo,
        label: [BANCOS_OPCIONES[banco_asociado].name, numero],
        i,
      })
    );
    setCuentasData(cuentasData);
  };

  const tamanoDePagina = 5;
  const fetchDataRealVSEstimado = async () => {
    const { id: presupuesto_id } = await Presupuesto.presupuestoMasReciente();
    const totalItems = await PresupuestoDetalle.totalItems(presupuesto_id);
    const pagina = gastoRealVSEstimadoPagina;
    const gastoRealVSGastado = await Presupuesto.realVSEstimado({
      pagina,
      tamanoDePagina,
    });
    const gastoRealData = gastoRealVSGastado.map(
      ({ rubro, cantidad_real }, i) => ({
        x: rubro,
        y: cantidad_real,
        label: "(R)",
        i,
      })
    );
    const gastoEstimadoData = gastoRealVSGastado.map(
      ({ rubro, cantidad_estimada }, i) => ({
        x: rubro,
        y: cantidad_estimada,
        label: (EGRESOS_RUBROS_OPCIONES[rubro].desc + ".(E)").split(" "),
        i,
      })
    );
    const realVSEstimadoData = {
      real: gastoRealData,
      estimado: gastoEstimadoData,
    };
    console.log(gastoRealVSGastado);
    setGastoRealVSEstimadoData(realVSEstimadoData);
    setGastoRealVSEstimadoCantidadDetalle(totalItems);
  };

  useEffect(() => {
    fetchDataGastosPorMedioPago();
    fetchDataSaldoPorCuenta();
  }, [props.version]);

  useEffect(() => {
    fetchDataRealVSEstimado();
  }, [props.version, gastoRealVSEstimadoPagina]);

  return (
    <React.Fragment>
      <View style={styles.container}>
        <B>Gastos del Mes según al Medio de Pago</B>
        <GastosPorMedioDePagoChart data={gastosDelMesData} />
      </View>
      <View style={styles.container}>
        <B>Saldo en Cuentas Bancarias</B>
        <SaldoPorCuentaBancariaChart data={cuentasData} />
      </View>
      <View>
        <View style={styles.container}>
          <B>Gasto Estimado (E) vs Gasto Real (R)</B>
        </View>
        <Picker
          name="medio_pago"
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          style={{ width: undefined, color: "black" }}
          placeholder="Medio de Pago"
          placeholderStyle={{ color: "#bfc6ea" }}
          placeholderIconColor="#007aff"
          selectedValue={gastoRealVSEstimadoPagina}
          onValueChange={(v) => setGastoRealVSEstimadoPagina(v)}
        >
          {_.range(gastoRealVSEstimadoCantidadDetalle / tamanoDePagina).map(
            (i) => (
              <Picker.Item
                label={"Página " + (i + 1)}
                value={i + 1}
                key={i + 1}
              />
            )
          )}
        </Picker>
      </View>
      <View style={styles.container}>
        <PresupuestoRealVSDesvioChart2 data={gastoRealVSEstimadoData} />
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#f5fcff",
  },
});

export default DashboardScreen;
