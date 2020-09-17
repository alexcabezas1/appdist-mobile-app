import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Container, Header, Content, Footer, Button } from "native-base";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryGroup,
  VictoryStack,
  VictoryLegend,
} from "victory-native";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";

const DashboardScreen = ({ navigation, props }) => {
  return (
    <Container>
      <Content>
        <Dashboard />
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
      domainPadding={{ x: 50 }}
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
      domainPadding={{ x: 50 }}
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
            fill: ({ datum }) => (datum.y < 10000 ? "#d84343" : "#4f73f2"),
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
      <VictoryChart height={600} width={Dimensions.width}>
        <VictoryGroup offset={20} colorScale={"qualitative"} horizontal>
          <VictoryBar
            data={[
              { x: 1, y: 2000, label: "G1" },
              { x: 2, y: 10000, desc: "G2" },
              { x: 3, y: 7000, desc: "G3" },
              { x: 4, y: 2000, label: "G4" },
              { x: 5, y: 10000, desc: "G5" },
              { x: 6, y: 7000, desc: "G6" },
              { x: 7, y: 2000, label: "G7" },
              { x: 8, y: 10000, desc: "G8" },
              { x: 9, y: 7000, desc: "G9" },
            ]}
            labels={({ datum }) => datum.desc}
          />
          <VictoryBar
            data={[
              { x: 1, y: 3000, label: "G1" },
              { x: 2, y: 9000, label: "G2" },
              { x: 3, y: 9000, label: "G3" },
              { x: 4, y: 3000, label: "G4" },
              { x: 5, y: 9000, label: "G5" },
              { x: 6, y: 9000, label: "G6" },
              { x: 7, y: 3000, label: "G7" },
              { x: 8, y: 9000, label: "G8" },
              { x: 9, y: 9000, label: "G9" },
            ]}
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
  const gastos_del_mes = [
    { x: "de_contado", y: 30100, label: ["de", "contado"], i: 1 },
    {
      x: "tarjeta_de_crédito",
      y: 23000,
      label: ["tarjeta de", "crédito"],
      i: 2,
    },
    { x: "tarjeta_de_débito", y: 5200, label: ["tarjeta de", "débito"], i: 3 },
    { x: "débito_automático", y: 12000, label: ["débito", "automático"], i: 4 },
  ];

  const saldo_por_cuenta_bancaria = [
    {
      x: "hsbc_bank_9085978549584",
      y: 30000,
      label: ["HSBC Bank", "#9085978549584"],
      i: 1,
    },
    {
      x: "banco_frances_584954859484",
      y: 10000,
      label: ["Banco Frances", "#584954859484"],
      i: 2,
    },
    {
      x: "banco_ciudad_920398498343",
      y: 5000,
      label: ["Banco Ciudad", "#920398498343"],
      i: 3,
    },
  ];

  return (
    <React.Fragment>
      <View style={styles.container}>
        <B>Gastos del Mes según al Medio de Pago</B>
        <GastosPorMedioDePagoChart data={gastos_del_mes} />
      </View>
      <View style={styles.container}>
        <B>Saldo en Cuentas Bancarias</B>
        <SaldoPorCuentaBancariaChart data={saldo_por_cuenta_bancaria} />
      </View>
      <View style={styles.container}>
        <B>Presupuesto y Gasto Real</B>
        <PresupuestoRealVSDesvioChart2 />
        <PresupuestoRealVSDesvioChart />
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
