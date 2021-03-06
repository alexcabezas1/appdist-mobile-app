import * as SQLite from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";
import { validateYupSchema } from "formik";
import moment from "moment";

const DATABASE_NAME = "mybudget.db";

const openDatabase = async () => SQLite.openDatabase(DATABASE_NAME);

const currentDateTime = () => moment().format("YYYY-MM-DDTHH:mm:ss") + "Z";
const timestamp = () => Date.now();

class Ingreso extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "ingresos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      origen: { type: types.TEXT, not_null: true },
      cuenta_destino_id: { type: types.INTEGER, not_null: true },
      frecuencia: { type: types.TEXT, not_null: true },
      recurrencia: { type: types.INTEGER, not_null: true, default: () => 0 },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }

  static async registrar(values) {
    const newValues = {
      ...values,
      recurrencia: values.frecuencia === "una_vez" ? 0 : values.recurrencia,
    };
    const newIngreso = new Ingreso(newValues);
    const ingreso = await newIngreso.save();
    console.log(ingreso);
    const { recurrencia, frecuencia, cuenta_destino_id, cantidad } = newValues;

    let currentFutureDate = moment();
    const newMovimiento = new CuentaMovimiento({
      cuenta_id: cuenta_destino_id,
      concepto: CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.INGRESO,
      tipo: CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.ACREDITA,
      cantidad,
      ingreso_id: ingreso.id,
      fecha_operacion: currentFutureDate.format("YYYY-MM-DD"),
    });
    await newMovimiento.save();

    if (recurrencia > 0 && frecuencia != "una_vez") {
      for (let i = 0; i < recurrencia - 1; i++) {
        const futureDate = currentFutureDate.add(
          1,
          FRECUENCIA_A_MOMENT[frecuencia]
        );
        currentFutureDate = futureDate;

        const newMovimiento = new CuentaMovimiento({
          cuenta_id: cuenta_destino_id,
          concepto: CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.INGRESO,
          tipo: CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.ACREDITA,
          cantidad,
          ingreso_id: ingreso.id,
          fecha_operacion: currentFutureDate.format("YYYY-MM-DD"),
        });
        await newMovimiento.save();
      }
    }

    await Cuenta.actualizarSaldo(
      cuenta_destino_id,
      cantidad,
      CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.ACREDITA
    );
  }

  static async remover(id) {
    const sql = `DELETE FROM cuentas_movimientos WHERE ingreso_id = ?`;
    await this.repository.databaseLayer.executeSql(sql, [id]);

    const { cantidad, cuenta_destino_id } = await Ingreso.find(id);

    await Cuenta.actualizarSaldo(
      cuenta_destino_id,
      cantidad,
      CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.DEBITA
    );

    await Ingreso.destroy(id);
  }

  static todos() {
    const sql = `
    SELECT
      i.id,
      i.cantidad,
      i.origen,
      i.cuenta_destino_id,
      i.frecuencia,
      i.recurrencia,
      i.fecha_operacion,
      i.fecha_creacion,
      c.numero AS cuenta_numero,
      c.banco_asociado AS cuenta_banco_asociado
    FROM ingresos i
    INNER JOIN cuentas c ON i.cuenta_destino_id = c.id
    ORDER BY i.fecha_creacion DESC
  `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static exportar() {
    const sql = `
    SELECT
      id,
      cantidad,
      origen,
      cuenta_destino_id,
      frecuencia,
      recurrencia,
      fecha_operacion,
      fecha_creacion
    FROM ingresos
  `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class Cuenta extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "cuentas";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      descripcion: { type: types.TEXT },
      numero: { type: types.TEXT },
      banco_asociado: { type: types.TEXT, not_null: true },
      cbu: { type: types.TEXT },
      saldo: { type: types.NUMERIC, default: () => 0 },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static cuentasActivas() {
    const sql = `
      SELECT
        id,
        numero,
        banco_asociado,
        cbu,
        saldo,
        fecha_creacion
      FROM cuentas WHERE borrado = 0
      ORDER BY fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static exportar() {
    const sql = `
      SELECT
        id,
        descripcion,
        numero,
        banco_asociado,
        cbu,
        saldo,
        fecha_creacion,
        fecha_borrado,
        borrado
      FROM cuentas
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static async haySaldoSuficiente(id, cantidad) {
    const cuenta = await Cuenta.find(id);
    if (cuenta.saldo < cantidad) {
      console.log("saldo insuficiente en cuenta");
      return false;
    }
    return true;
  }

  static async actualizarSaldo(id, cantidad, tipoMovimiento) {
    if (tipoMovimiento == CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.DEBITA) {
      await Cuenta.haySaldoSuficiente(id, cantidad);
    }

    let operacion = "";
    if (tipoMovimiento == CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.ACREDITA)
      operacion = "+";
    if (tipoMovimiento == CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.DEBITA)
      operacion = "-";

    const sql = `
    UPDATE cuentas
    SET saldo = saldo ${operacion} ${parseFloat(cantidad)}
    WHERE id = ${id}
    `;
    await this.repository.databaseLayer.executeSql(sql);
    console.log(await Cuenta.find(id));

    return true;
  }

  static saldoPorCuenta() {
    const sql = `
      SELECT
        id,
        numero,
        banco_asociado,
        saldo
      FROM cuentas WHERE borrado = 0
      ORDER BY saldo DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class CuentaMovimiento extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "cuentas_movimientos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      cuenta_id: { type: types.INTEGER, not_null: true },
      concepto: { type: types.TEXT, not_null: true },
      tipo: { type: types.TEXT, not_null: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      ingreso_id: { type: types.INTEGER },
      egreso_id: { type: types.INTEGER },
      tarjeta_id: { type: types.INTEGER },
      prestamo_cuota_id: { type: types.INTEGER },
      inversion_id: { type: types.INTEGER },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }
  static exportar() {
    const sql = `
      SELECT
        id,
        cuenta_id,
        concepto,
        tipo,
        cantidad,
        ingreso_id,
        egreso_id,
        tarjeta_id,
        prestamo_cuota_id,
        inversion_id,
        fecha_operacion,
        fecha_creacion
      FROM cuentas_movimientos
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class Egreso extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "egresos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      motivo: { type: types.TEXT, not_null: true },
      medio_pago: { type: types.TEXT, not_null: true },
      numero_cuotas: { type: types.INTEGER, not_null: true, default: () => 1 },
      tarjeta_id: { type: types.INTEGER },
      cuenta_id: { type: types.INTEGER },
      prestamo_cuota_id: { type: types.INTEGER },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static async registrar(values) {
    console.log(values);
    const {
      cantidad,
      numero_cuotas,
      medio_pago,
      motivo,
      tarjeta_id,
      fecha_operacion,
      prestamo_cuota_id,
      cuenta_id,
    } = values;
    const cuota_cantidad = parseFloat(cantidad) / parseInt(numero_cuotas);

    const newEgreso = new Egreso(values);
    const egreso = await newEgreso.save();
    const { id: egreso_id } = egreso;
    const tipo = CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.DEBITA;

    const esConMovimientoEnCuenta =
      (medio_pago === "debito_automatico" ||
        medio_pago === "transferencia" ||
        medio_pago === "mercadopago" ||
        medio_pago === "tarjeta_de_debito") &&
      motivo != "cuota_de_prestamo";

    const esConMovimientoEnTarjeta =
      medio_pago === "tarjeta_de_credito" && motivo != "cuota_de_prestamo";

    if (motivo == "cuota_de_prestamo") {
      const prestamoCuota = await PrestamoCuota.find(prestamo_cuota_id);
      const { prestamo_id, cantidad } = prestamoCuota;
      const prestamo = await Prestamo.find(prestamo_id);
      if (prestamo.debito_automatico) {
        console.log("actualizar movimiento cuota prestamo existente");
        const update_movimiento_sql = `
        UPDATE cuentas_movimientos
        SET egreso_id = ${egreso_id}
        WHERE prestamo_cuota_id = ${prestamo_cuota_id}`;
        await this.repository.databaseLayer.executeSql(
          update_movimiento_sql,
          []
        );
        await Cuenta.actualizarSaldo(cuenta_id, cantidad, tipo);
      } else {
        console.log("registrar nuevo movimiento por cuota prestamo");
        //solo con tarjeta de débito
        const tarjeta = await Tarjeta.find(tarjeta_id);
        console.log(tarjeta);
        const cuenta_id = tarjeta.cuenta_id;

        const cuentaMovimiento = new CuentaMovimiento({
          cuenta_id,
          concepto: CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.PRESTAMO_CUOTA,
          tipo,
          cantidad: cuota_cantidad,
          egreso_id,
          fecha_operacion,
        });
        await cuentaMovimiento.save();

        await Cuenta.actualizarSaldo(cuenta_id, cuota_cantidad, tipo);
      }

      const update_cuota_sql = `
        UPDATE prestamos_cuotas
        SET pagado = true, fecha_pagado = '${fecha_operacion}'
        WHERE id = ${prestamo_cuota_id}`;
      await this.repository.databaseLayer.executeSql(update_cuota_sql, []);
    }

    if (esConMovimientoEnCuenta) {
      console.log("requiere movimiento en cuenta");
      let { cuenta_id } = values;
      if (medio_pago === "tarjeta_de_debito") {
        const tarjeta = await Tarjeta.find(tarjeta_id);
        console.log(tarjeta);
        cuenta_id = tarjeta.cuenta_id;
      }

      const concepto = CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.EGRESO;
      let currentFechaOperacion = moment(fecha_operacion, "YYYY-MM-DD");
      for (let i = 0; i < numero_cuotas; i++) {
        const newCuentaMovimeinto = new CuentaMovimiento({
          cuenta_id,
          concepto,
          tipo,
          cantidad: cuota_cantidad,
          egreso_id,
          fecha_operacion: currentFechaOperacion.format("YYYY-MM-DD"),
          //descripcion: "cuota " + (i+1),
        });
        await newCuentaMovimeinto.save();
        currentFechaOperacion = currentFechaOperacion.add(1, "months");
      }
      if (numero_cuotas != 1) {
        const newCuentaMovimeinto = new CuentaMovimiento({
          cuenta_id,
          concepto,
          tipo,
          cantidad: cuota_cantidad,
          egreso_id,
          fecha_operacion: currentFechaOperacion.format("YYYY-MM-DD"),
          //descripcion: "cuota " + (i+1),
        });
        await newCuentaMovimeinto.save();
      }
      await Cuenta.actualizarSaldo(cuenta_id, cantidad, tipo);
    }

    if (esConMovimientoEnTarjeta) {
      console.log("requiere movimiento en tarjeta");
      let currentFechaOperacion = moment(fecha_operacion, "YYYY-MM-DD");
      for (let i = 0; i < numero_cuotas; i++) {
        const newTarjetaMovimeinto = new TarjetaMovimiento({
          tarjeta_id,
          egreso_id,
          cantidad: cuota_cantidad,
          fecha_operacion: currentFechaOperacion.format("YYYY-MM-DD"),
          //descripcion: "cuota " + (i+1),
        });
        await newTarjetaMovimeinto.save();
        currentFechaOperacion = currentFechaOperacion.add(1, "months");
      }
      if (numero_cuotas != 1) {
        const newTarjetaMovimeinto = new TarjetaMovimiento({
          tarjeta_id,
          egreso_id,
          cantidad: cuota_cantidad,
          fecha_operacion: currentFechaOperacion.format("YYYY-MM-DD"),
          //descripcion: "cuota " + (i+1),
        });
        await newTarjetaMovimeinto.save();
      }
    }
  }

  static async remover(id) {
    const egreso = await Egreso.find(id);
    const { prestamo_cuota_id, cuenta_id, tarjeta_id } = egreso;
    if (prestamo_cuota_id) {
      const prestamoCuota = await PrestamoCuota.find(prestamo_cuota_id);
      const prestamo = await Prestamo.find(prestamoCuota.prestamo_id);
      if (prestamo.debito_automatico) {
        const update_movimiento_sql = `
        UPDATE cuentas_movimientos
        SET egreso_id = null
        WHERE egreso_id = ${id}
        AND prestamo_cuota_id = ${prestamo_cuota_id}`;
        await this.repository.databaseLayer.executeSql(update_movimiento_sql);
      } else {
        const delete_movimiento_sql = `
        DELETE FROM cuentas_movimientos
        WHERE egreso_id = ${id}
        AND prestamo_cuota_id = ${prestamo_cuota_id}`;
        await this.repository.databaseLayer.executeSql(delete_movimiento_sql);
      }

      const update_cuota_sql = `
      UPDATE prestamos_cuotas
      SET pagado = 0, fecha_pagado = null
      WHERE id = ${prestamo_cuota_id}`;
      await this.repository.databaseLayer.executeSql(update_cuota_sql);
    }

    if (cuenta_id) {
      const delete_movimientos_sql = `
        DELETE FROM cuentas_movimientos
        WHERE egreso_id = ${id} AND cuenta_id = ${cuenta_id}`;
      await this.repository.databaseLayer.executeSql(delete_movimientos_sql);
    }

    if (tarjeta_id) {
      const delete_movimientos_sql = `
        DELETE FROM tarjetas_movimientos
        WHERE egreso_id = ${id} AND tarjeta_id = ${tarjeta_id}`;
      await this.repository.databaseLayer.executeSql(delete_movimientos_sql);
    }

    await Egreso.destroy(id);
  }

  static todosActivos() {
    const sql = `
      SELECT
        e.id,
        e.cantidad,
        e.motivo,
        e.medio_pago,
        e.numero_cuotas,
        e.tarjeta_id,
        e.cuenta_id,
        e.prestamo_cuota_id,
        e.fecha_operacion,
        e.fecha_creacion,
        c.numero AS cuenta_numero,
        c.banco_asociado AS cuenta_banco_asociado,
        t.tipo AS tarjeta_tipo,
        t.entidad_emisor AS tarjeta_entidad_emisor,
        t.ultimos_numeros AS tarjeta_ultimos_numeros,
        pc.numero_cuota AS prestamo_cuota_numero_cuota,
        pc.cantidad AS prestamo_cuota_cantidad,
        p.id AS prestamo_id,
        p.descripcion AS prestamo_descripcion
      FROM egresos e
      LEFT JOIN cuentas c ON e.cuenta_id = c.id
      LEFT JOIN tarjetas t ON e.tarjeta_id = t.id
      LEFT JOIN prestamos_cuotas pc ON e.prestamo_cuota_id = pc.id
      LEFT JOIN prestamos p ON pc.prestamo_id = p.id
      WHERE e.borrado = 0
      ORDER BY e.fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static exportar() {
    const sql = `
      SELECT
        id,
        cantidad,
        motivo,
        medio_pago,
        numero_cuotas,
        tarjeta_id,
        cuenta_id,
        prestamo_cuota_id,
        fecha_operacion,
        fecha_creacion,
        fecha_borrado,
        borrado
      FROM egresos
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static async mesMasReciente() {
    const mesMasReciente_sql = `
    SELECT strftime('%m', max(fecha_creacion)) AS mes_reciente
    FROM egresos
    `;
    const { rows } = await this.repository.databaseLayer.executeSql(
      mesMasReciente_sql
    );
    return rows[0]["mes_reciente"];
  }

  static async sumaMesActualYMedioPago() {
    const mesMasReciente = await Egreso.mesMasReciente();
    console.log("Mes:", mesMasReciente);
    //const mesActual = moment().format("MM");
    const sql = `
      SELECT
        e.medio_pago,
        SUM(e.cantidad) AS cantidad
      FROM egresos e
      WHERE strftime('%m', e.fecha_operacion) = '${mesMasReciente}'
      GROUP BY medio_pago
      ORDER BY cantidad
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class Tarjeta extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "tarjetas";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      tipo: { type: types.TEXT, not_null: true },
      entidad_emisor: { type: types.TEXT, not_null: true },
      cuenta_id: { type: types.INTEGER },
      ultimos_numeros: { type: types.TEXT },
      fecha_vencimiento: { type: types.DATE, not_null: true },
      fecha_cierre_resumen: { type: types.DATE },
      fecha_vencimiento_resumen: { type: types.DATE },
      debito_automatico: {
        type: types.BOOLEAN,
        not_null: true,
        default: () => false,
      },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static tarjetasActivas() {
    const sql = `
      SELECT
        t.id,
        t.tipo,
        t.entidad_emisor,
        t.cuenta_id,
        t.ultimos_numeros,
        t.fecha_vencimiento,
        t.fecha_cierre_resumen,
        t.fecha_vencimiento_resumen,
        t.debito_automatico,
        t.fecha_creacion,
        c.banco_asociado AS cuenta_banco_asociado,
        c.numero AS cuenta_numero
      FROM tarjetas t
      LEFT JOIN cuentas c ON t.cuenta_id = c.id
      WHERE t.borrado = 0
      ORDER BY t.fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static exportar() {
    const sql = `
      SELECT
        id,
        tipo,
        entidad_emisor,
        cuenta_id,
        ultimos_numeros,
        fecha_vencimiento,
        fecha_cierre_resumen,
        fecha_vencimiento_resumen,
        debito_automatico,
        fecha_creacion,
        fecha_borrado,
        borrado
      FROM tarjetas
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class TarjetaMovimiento extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "tarjetas_movimientos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      tarjeta_id: { type: types.INTEGER, not_null: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      egreso_id: { type: types.INTEGER, not_null: true },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }

  static exportar() {
    const sql = `
      SELECT
        id,
        tarjeta_id,
        cantidad,
        fecha_operacion,
        fecha_creacion,
        egreso_id
      FROM tarjetas_movimientos
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class Inversion extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "inversiones";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      tipo_inversion: { type: types.INTEGER, not_null: true },
      descripcion: { type: types.TEXT, not_null: true },
      capital_invertido: { type: types.NUMERIC, not_null: true },
      interes: { type: types.INTEGER },
      cantidad_adquirida: { type: types.INTEGER },
      intermediario: { type: types.TEXT },
      cuenta_origen_id: { type: types.INTEGER, not_null: true },
      cuenta_destino_id: { type: types.INTEGER, not_null: true },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_vencimiento: { type: types.DATE },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }

  static async registrar(values) {
    const inversionNew = new Inversion(values);
    const inversion = await inversionNew.save();

    const { id: inversion_id } = inversion;
    const {
      cuenta_origen_id: cuenta_id,
      capital_invertido: cantidad,
      fecha_operacion,
    } = values;
    const concepto = CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.INVERSION;
    const tipo = CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.DEBITA;
    const newMovimiento = new CuentaMovimiento({
      cuenta_id,
      concepto,
      tipo,
      cantidad,
      inversion_id,
      fecha_operacion,
    });
    await newMovimiento.save();
  }

  static async remover(id) {
    const inversion = await Inversion.find(id);
    const { cuenta_origen_id: cuenta_id } = inversion;
    const delete_movimientos_sql = `
    DELETE FROM cuentas_movimientos
    WHERE cuenta_id = ${cuenta_id} AND inversion_id = ${id}
    `;
    await this.repository.databaseLayer.executeSql(delete_movimientos_sql);
    await Inversion.destroy(id);
  }

  static todos() {
    const sql = `
      SELECT
        i.id,
        i.tipo_inversion,
        i.descripcion,
        i.capital_invertido,
        i.interes,
        i.cantidad_adquirida,
        i.intermediario,
        i.cuenta_origen_id,
        i.cuenta_destino_id,
        i.fecha_operacion,
        i.fecha_vencimiento,
        c1.banco_asociado AS cuenta_origen_banco_asociado,
        c1.numero AS cuenta_origen_numero,
        c2.banco_asociado AS cuenta_destino_banco_asociado,
        c2.numero AS cuenta_destino_numero
      FROM inversiones i
      LEFT JOIN cuentas c1 ON i.cuenta_origen_id = c1.id
      LEFT JOIN cuentas c2 ON i.cuenta_destino_id = c2.id
      ORDER BY i.fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static exportar() {
    const sql = `
      SELECT
        id,
        tipo_inversion,
        descripcion,
        capital_invertido,
        interes,
        cantidad_adquirida,
        intermediario,
        cuenta_origen_id,
        cuenta_destino_id,
        fecha_operacion,
        fecha_vencimiento,
        fecha_creacion
      FROM inversiones
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class Prestamo extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "prestamos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      capital_principal: { type: types.NUMERIC, not_null: true },
      interes: { type: types.INTEGER, not_null: true },
      dia_vencimiento_cuota: { type: types.INTEGER },
      plazo: { type: types.INTEGER, not_null: true, default: () => 1 },
      debito_automatico: {
        type: types.BOOLEAN,
        not_null: true,
        default: () => false,
      },
      cuenta_id: { type: types.INTEGER },
      rol: { type: types.TEXT, not_null: true },
      descripcion: { type: types.TEXT },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static calcularCuota({ capital_principal, interes, plazo }) {
    const interes_porcentaje = parseFloat(interes) / 100;
    return (
      (interes_porcentaje * parseFloat(capital_principal)) /
      (1 - Math.pow(1 + interes_porcentaje, -plazo))
    );
  }

  static async registrar(values) {
    const newPrestamo = new Prestamo(values);
    const prestamo = await newPrestamo.save();

    const { dia_vencimiento_cuota, plazo, debito_automatico, rol } = values;
    const now = moment();
    let fechaActualVencimiento = moment(
      now.format("Y") +
        "-" +
        now.format("M") +
        "-" +
        dia_vencimiento_cuota.padStart(2, "0"),
      "YYYY-MM-DD"
    );
    const plazo_numero = PRESTAMOS_PLAZO_OPCIONES[plazo].numero;
    const cuotaCantidad = Prestamo.calcularCuota({
      ...values,
      plazo: plazo_numero,
    });

    for (let i = 0; i < plazo_numero; i++) {
      const fechaFuturaVencimiento = fechaActualVencimiento.add(1, "months");

      const newPrestamoCuota = new PrestamoCuota({
        prestamo_id: prestamo.id,
        numero_cuota: i + 1,
        cantidad: cuotaCantidad,
        fecha_vencimiento: fechaFuturaVencimiento.format("YYYY-MM-DD"),
      });
      const prestamoCuota = await newPrestamoCuota.save();

      if (debito_automatico && rol === "prestatario") {
        const newCuentaMovimiento = new CuentaMovimiento({
          cuenta_id: prestamo.cuenta_id,
          concepto: CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.PRESTAMO_CUOTA,
          tipo: CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.DEBITA,
          cantidad: cuotaCantidad,
          prestamo_cuota_id: prestamoCuota.id,
          fecha_operacion: fechaFuturaVencimiento.format("YYYY-MM-DD"),
        });
        await newCuentaMovimiento.save();
      }

      fechaActualVencimiento = fechaFuturaVencimiento;
    }
  }

  static async remover(id) {
    const delete_movimientos_sql = `
    DELETE FROM cuentas_movimientos
    WHERE prestamo_cuota_id IN (
        SELECT id
        FROM prestamos_cuotas
        WHERE prestamo_id = ?
    )`;
    await this.repository.databaseLayer.executeSql(delete_movimientos_sql, [
      id,
    ]);

    const delete_cuotas_sql = `DELETE FROM prestamos_cuotas WHERE prestamo_id = ?`;
    await this.repository.databaseLayer.executeSql(delete_cuotas_sql, [id]);

    await Prestamo.destroy(id);
  }

  static todosActivos() {
    const sql = `
      SELECT
        p.id,
        p.capital_principal,
        p.interes,
        p.plazo,
        p.dia_vencimiento_cuota,
        p.debito_automatico,
        p.cuenta_id,
        p.rol,
        p.descripcion,
        p.fecha_operacion,
        p.fecha_creacion,
        c.banco_asociado AS cuenta_banco_asociado,
        c.numero AS cuenta_numero
      FROM prestamos p
      LEFT JOIN cuentas c ON p.cuenta_id = c.id
      WHERE p.borrado = 0
      ORDER BY p.fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static exportar() {
    const sql = `
      SELECT
        id,
        capital_principal,
        interes,
        plazo,
        dia_vencimiento_cuota,
        debito_automatico,
        cuenta_id,
        rol,
        descripcion,
        fecha_operacion,
        fecha_creacion,
        fecha_borrado,
        borrado
      FROM prestamos
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class PrestamoCuota extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "prestamos_cuotas";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      prestamo_id: { types: types.INTEGER, not_null: true },
      numero_cuota: { types: types.INTEGER, not_null: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      fecha_vencimiento: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
      fecha_pagado: { type: types.DATE },
      pagado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static todosActivosNoPagadosRolPrestatario() {
    const sql = `
      SELECT
        pc.id,
        pc.prestamo_id,
        pc.numero_cuota,
        pc.cantidad,
        pc.fecha_vencimiento,
        pc.fecha_creacion,
        p.descripcion,
        p.capital_principal
      FROM prestamos_cuotas pc
      LEFT JOIN prestamos p ON pc.prestamo_id = p.id
      WHERE
        pc.borrado = 0
        AND pc.pagado = 0
        AND p.rol = "prestatario"
      ORDER BY pc.fecha_creacion ASC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }

  static exportar() {
    const sql = `
      SELECT
        id,
        prestamo_id,
        numero_cuota,
        cantidad,
        fecha_vencimiento,
        fecha_creacion,
        fecha_borrado,
        borrado,
        fecha_pagado,
        pagado
      FROM prestamos_cuotas
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class Presupuesto extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "presupuestos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }

  static async registrar(items) {
    console.log(items);
    const presupuestoNew = new Presupuesto({});
    const presupuesto = await presupuestoNew.save();
    console.log(presupuesto);
    const { id: presupuesto_id } = presupuesto;
    items.forEach(async ({ rubro, cantidad_estimada }) => {
      const detalleNew = new PresupuestoDetalle({
        presupuesto_id,
        rubro,
        cantidad_estimada,
      });
      const detalle = await detalleNew.save();
      console.log(detalle);
    });
  }

  static async gestionar(items) {
    const mesActual = moment().format("MM");
    const delete_presupuesto_sql = `
    DELETE FROM presupuestos_detalle
    WHERE presupuesto_id IN (
      SELECT id FROM presupuestos
      WHERE strftime('%m', fecha_creacion) = '${mesActual}'
    )`;
    const rows = await this.repository.databaseLayer.executeSql(
      delete_presupuesto_sql
    );

    const detele_detalle_sql = `
    DELETE FROM presupuestos
    WHERE strftime('%m', fecha_creacion) = '${mesActual}'
    `;
    await this.repository.databaseLayer.executeSql(detele_detalle_sql);

    await this.registrar(items);
  }

  static async masReciente() {
    const sql = `
    SELECT
      pd.id,
      pd.presupuesto_id,
      pd.rubro,
      pd.cantidad_estimada
    FROM presupuestos_detalle pd
    WHERE pd.presupuesto_id IN (
      SELECT id FROM presupuestos
      ORDER BY fecha_creacion DESC
      LIMIT 1
    )`;
    return this.repository.databaseLayer
      .executeSql(sql, [])
      .then(({ rows }) => rows);
  }

  static async exportar() {
    const sql = `
    SELECT
      p.id,
      p.fecha_creacion,
      pd.rubro,
      pd.cantidad_estimada
    FROM presupuestos_detalle pd
    INNER JOIN presupuestos p on pd.presupuesto_id = p.id
    `;
    return this.repository.databaseLayer
      .executeSql(sql, [])
      .then(({ rows }) => rows);
  }

  static async presupuestoMasReciente() {
    const mesMasReciente_sql = `
    SELECT id, strftime('%m', max(fecha_creacion)) AS mes_reciente
    FROM presupuestos
    `;
    const { rows } = await this.repository.databaseLayer.executeSql(
      mesMasReciente_sql
    );
    return rows[0];
  }

  static async realVSEstimado({ pagina = 1, tamanoDePagina = 5 }) {
    const mesMasRecienteEgreso = await Egreso.mesMasReciente();
    console.log(mesMasRecienteEgreso);
    const {
      id: presupuesto_id,
      mes_reciente: mesMasRecientePresupuesto,
    } = await Presupuesto.presupuestoMasReciente();
    console.log(presupuesto_id, mesMasRecientePresupuesto);
    const sql = `
    SELECT
      pd.rubro,
      pd.cantidad_estimada,
      COALESCE(e.cantidad, 0) AS cantidad_real
    FROM presupuestos_detalle pd
    LEFT JOIN (
      SELECT
        motivo,
        SUM(cantidad) AS cantidad
      FROM egresos
      WHERE strftime('%m', fecha_operacion) = '${mesMasRecienteEgreso}'
      GROUP BY motivo
    ) e ON pd.rubro = e.motivo
    WHERE presupuesto_id = '${presupuesto_id}'
    ORDER BY pd.rubro, pd.cantidad_estimada
    LIMIT ${tamanoDePagina} OFFSET ${(pagina - 1) * tamanoDePagina}
    `;
    return this.repository.databaseLayer
      .executeSql(sql, [])
      .then(({ rows }) => rows);
  }
}

class PresupuestoDetalle extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "presupuestos_detalle";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      presupuesto_id: { type: types.INTEGER, not_null: true },
      rubro: { type: types.TEXT, not_null: true },
      cantidad_estimada: { type: types.NUMERIC, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }

  static async totalItems(id) {
    const sql = `
    SELECT COUNT(0) AS cantidad
    FROM presupuestos_detalle
    WHERE presupuesto_id = ${id}
    `;
    const { rows } = await this.repository.databaseLayer.executeSql(sql);
    return rows[0]["cantidad"];
  }
}

const createTables = () =>
  Promise.all(
    Ingreso.createTable(),
    Cuenta.createTable(),
    CuentaMovimiento.createTable(),
    Egreso.createTable(),
    Tarjeta.createTable(),
    TarjetaMovimiento.createTable(),
    Inversion.createTable(),
    Prestamo.createTable(),
    PrestamoCuota.createTable(),
    Presupuesto.createTable(),
    PresupuestoDetalle.createTable()
  );

const dropTables = () =>
  Promise.all(
    Ingreso.dropTable(),
    Cuenta.dropTable(),
    CuentaMovimiento.dropTable(),
    Egreso.dropTable(),
    Tarjeta.dropTable(),
    TarjetaMovimiento.dropTable(),
    Inversion.dropTable(),
    Prestamo.dropTable(),
    PrestamoCuota.dropTable(),
    Presupuesto.dropTable(),
    PresupuestoDetalle.dropTable()
  );

const prepareDatabase = async () => {
  await createTables();
};

const BANCOS_OPCIONES = {
  banco_nacion: { name: "Nación", tipo: "cbu" },
  banco_santander: { name: "Santander Río", tipo: "cbu" },
  banco_galicia: { name: "Galicia", tipo: "cbu" },
  banco_provincia: { name: "Provincia", tipo: "cbu" },
  banco_hsbc: { name: "HSBC", tipo: "cbu" },
  banco_citibank: { name: "CitiBank", tipo: "cbu" },
  banco_comafi: { name: "Comafi", tipo: "cbu" },
  banco_frances: { name: "Frances", tipo: "cbu" },
  mercadopago: { name: "MercadoPago", tipo: "cvu" },
};

const TARJETAS_TIPO_OPCIONES = {
  credito: "Crédito",
  debito: "Débito",
};

const TARJETAS_ENTIDAD_OPCIONES = {
  visa: "Visa",
  amex: "American Express",
  mastercard: "MasterCard",
  otro: "Otro",
};

const INGRESOS_FRECUENCIA_OPCIONES = {
  mensual: "Mensual",
  semanal: "Semanal",
  diario: "Diario",
  una_vez: "Una sola vez",
};

const FRECUENCIA_A_MOMENT = {
  mensual: "months",
  semanal: "weeks",
  diario: "days",
};

const INGRESOS_ORIGEN_OPCIONES = {
  sueldo_relacion_dependencia: "Sueldo en Relación de Dependencia",
  alquiler_propiedad: "Alquiler de Propiedad",
  facturacion_autonomo: "Facturación como Autónomo",
  extraordinario: "Extraordinario",
  otro: "Otro",
};

const CUENTAS_MOVIMIENTOS_TIPO_OPCIONES = {
  ACREDITA: "ACREDITA",
  DEBITA: "DEBITA",
};

const CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES = {
  INGRESO: "INGRESO",
  EGRESO: "EGRESO",
  TARJETA: "TARJETA",
  PRESTAMO_CUOTA: "PRESTAMO_CUOTA",
  INVERSION: "INVERSION",
};

const PRESTAMOS_PLAZO_OPCIONES = {
  "3_meses": { name: "3 meses", numero: 3 },
  "6_meses": { name: "6 meses", numero: 6 },
  "12_meses": { name: "12 meses", numero: 12 },
  "24_meses": { name: "24 meses", numero: 24 },
  "36_meses": { name: "36 meses", numero: 36 },
  "48_meses": { name: "48 meses", numero: 48 },
  "60_meses": { name: "60 meses", numero: 60 },
};

const PRESTAMOS_ROL_OPCIONES = {
  prestamista: "Prestamista",
  prestatario: "Prestatario",
};

const EGRESOS_RUBROS_OPCIONES = {
  alquiler: { desc: "Alquiler" },
  expensas: { desc: "Expensas" },
  luz: { desc: "Luz" },
  gas: { desc: "Gas" },
  cable: { desc: "Cable" },
  internet: { desc: "Internet" },
  telefono: { desc: "Teléfono" },
  servicio_limpieza: { desc: "Servicio Limpieza" },
  servicio_lavado: { desc: "Servicio Lavado" },
  reparacion_hogar: { desc: "Reparación Hogar" },
  gasolina: { desc: "Gasolina" },
  reparacion_auto: { desc: "Reparación Auto" },
  mudanza: { desc: "Mudanza" },
  cuota_de_prestamo: { desc: "Cuota Préstamo" },
  resumen_tarjeta_crédito: { desc: "Resumen Tarjeta Crédito" },
  impuestos_nacionales: {
    desc: "Impuestos Nacionales",
  },
  educación: { desc: "Educación" },
  salud: { desc: "Salud" },
  comida: { desc: "Comida" },
  gimnasio: { desc: "Gimnasio" },
  transporte: { desc: "Transporte" },
  hospedaje: { desc: "Hospedaje" },
  viáticos: { desc: "Viáticos" },
  transporte_en_viajes: {
    desc: "Transporte Viajes",
  },
  entretenimiento: { desc: "Entretenimiento" },
  comer_afuera: { desc: "Comer Afuera" },
  cine: { desc: "Cine" },
  compra_ropa: { desc: "Compra Ropa" },
  compra_para_hogar: { desc: "Compra para Hogar" },
  regalo: { desc: "Regalo" },
  donacion: { desc: "Donación" },
  compra_dolares: { desc: "Compra Dólares" },
  compra_criptomonedas: {
    desc: "Compra Criptomonedas",
  },
  extraordinario: { desc: "Extraordinario" },
  otro: { desc: "Otro" },
};

const EGRESOS_MEDIO_PAGO_OPCIONES = {
  de_contado: "De Contado",
  tarjeta_de_credito: "Tarjeta de Crédito",
  tarjeta_de_debito: "Tarjeta de Débito",
  debito_automatico: "Débito Automático en Cuenta",
  transferencia: "Transferencia",
  mercadopago: "MercadoPago",
};

const INVERSIONES_TIPO_INVERSION_OPCIONES = {
  plazo_fijo: "Plazo Fijo",
  compra_de_titulo: "Compra de Título",
  accion: "Acción",
  bono: "Bono",
  otro: "Otro",
};

export {
  Ingreso,
  Cuenta,
  CuentaMovimiento,
  Egreso,
  Tarjeta,
  TarjetaMovimiento,
  Inversion,
  Prestamo,
  PrestamoCuota,
  Presupuesto,
  PresupuestoDetalle,
  createTables,
  dropTables,
  prepareDatabase,
  currentDateTime,
  timestamp,
  BANCOS_OPCIONES,
  TARJETAS_TIPO_OPCIONES,
  TARJETAS_ENTIDAD_OPCIONES,
  INGRESOS_FRECUENCIA_OPCIONES,
  INGRESOS_ORIGEN_OPCIONES,
  PRESTAMOS_PLAZO_OPCIONES,
  PRESTAMOS_ROL_OPCIONES,
  EGRESOS_RUBROS_OPCIONES,
  EGRESOS_MEDIO_PAGO_OPCIONES,
  INVERSIONES_TIPO_INVERSION_OPCIONES,
};
