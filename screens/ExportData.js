
import XLSX from "xlsx";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useCallback } from "react";
import { StyleSheet, Dimensions, Alert } from "react-native";
import * as Yup from "yup";
import { Formik, ErrorMessage, yupToFormErrors } from "formik";
import { Block, theme } from "galio-framework";
import { materialTheme } from "../constants";


import {
  Container,
  Header,
  Content,
  Footer,
  Icon,
  Button,
  Text,
  Form,
  Left,
  Right,
} from "native-base";
import { formStyles } from "./shared/styles";
import { Cuenta, Ingreso, Egreso, Inversion, Prestamo, PrestamoCuota, CuentaMovimiento, Tarjeta, TarjetaMovimiento, Presupuesto} from "../services/models";



export default function ExportData({ navigation, props }) {


  const onSubmit = async () => {
    const ingresos = await Ingreso.exportar();
    const egresos = await Egreso.exportar();
    const cuentas = await Cuenta.exportar();
    const inversiones = await Inversion.exportar();
    const prestamos = await Prestamo.exportar();
    const prestamocuotas = await PrestamoCuota.exportar();
    const cuentamovimientos = await CuentaMovimiento.exportar();
    const tarjetas = await Tarjeta.exportar();
    const tarjetamovimientos = await TarjetaMovimiento.exportar();
    const presupuestos = await Presupuesto.exportar();


    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ingresos), "Ingresos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(egresos), "Egresos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cuentas), "Cuentas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(cuentamovimientos), "Cuentas Movimientos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inversiones), "Inversiones");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prestamos), "Prestamos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prestamocuotas), "Prestamo Cuotas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tarjetas), "Tarjetas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tarjetamovimientos), "Tarjetas Movimientos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(presupuestos), "Presupuestos");
   
    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });

    const uri = FileSystem.cacheDirectory + "MyBudget.xlsx";
    console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
     FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });
     Sharing.shareAsync(uri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "MyWater data",
      UTI: "com.microsoft.excel.xlsx",
    });
  

  };
    


  return (
    <Container>
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => navigation.navigate("Home")}
          >
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button
            transparent
            onPress={() => navigation.navigate("Home")}
          >
            <Text>Cancelar</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <Formik
          onSubmit={onSubmit}
        >
          {({
            handleSubmit,
            
          
          }) => (
            <Form>
              <Text> Desea guardar los datos en formato Excel? </Text>
              <Button block primary onPress={onSubmit} title="Download">
                <Text>Descargar</Text>
              </Button>
            </Form>
          )}
        </Formik>
      </Content>
    </Container>
  );
}

const styles = { ...formStyles };
