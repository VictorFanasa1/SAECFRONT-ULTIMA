import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';
//#region Models
import { admEmpleados } from '../models/admEmpleados.model';
import { admRegistrarDispositivos } from '../models/admRegistrarDispositivos.model';
import { admReporteEquipos } from '../models/admReporteEquipos.model';
import { admResponsables } from '../models/admResponsables.model';
import { admUbicaciones } from '../models/admUbicaciones.model';
import { admUserInv } from '../models/admUserInv.model';
import { asgAdicionales } from '../models/asgAdicionales.model';
import { asgAsignaciones } from '../models/asgAsignaciones.model';
import { asgEntregaLiberacion } from '../models/asgEntregaLiberacion.model';
import { asgExternos } from '../models/asgExternos.modal';
import { asgMotivoLiberacion } from '../models/asgMotivoLiberacion.model';
import { catAccesorios } from '../models/catAccesorios.model';
import { catComercial } from '../models/catComercial.model';
import { catGeneral } from '../models/catGeneral.model';
import { catStatus } from '../models/catStatus.model';
import { catSubStatus } from '../models/catSubStatus.model';
import { catTipoArrendamiento } from '../models/catTipoArrendamiento.model';
import { catTipoAsignacion } from '../models/catTipoAsignacion.model';
import { catTiposComercial } from '../models/catTiposComercial.model';
import { viewPreLiberados } from '../models/viewPreLiberados.model';
import { vwReporteInventario } from '../models/vwReporteInventario.model';
import { activofijo } from '../modelviews/activofijo.model';
import { addicional } from '../modelviews/addicional.model';
import { asighistory } from '../modelviews/asighistory.model';
import { assigment } from '../modelviews/assigment.model';
import { assigments } from '../modelviews/assigments.model';
import { bodega } from '../modelviews/bodega.model';
import { bodegafile } from '../modelviews/bodegafile.model';
import { changesdevices } from '../modelviews/changesdevices.model';
import { comercial } from '../modelviews/comercial.model';
import { dataemail } from '../modelviews/dataemail.model';
import { detaildevice } from '../modelviews/detaildevice.model';
import { detailsupport } from '../modelviews/detailsupport.model';
import { dispositivos } from '../modelviews/dispositivos.model';
import { employedassigment, employedassigments } from '../modelviews/employedassigments.model';
import { factura } from '../modelviews/factura.model';
import { invoiceHeader } from '../modelviews/invoiceHeader.model';
import { remision } from '../modelviews/remision.model';
import { reportes } from '../modelviews/reportes.model';
import { series } from '../modelviews/series.model';
import { seriesaf } from '../modelviews/seriesaf.model';
import { solicitudes } from '../modelviews/solicitudes.model';
import { transferencia } from '../modelviews/transferencia.model';
import { traspaso } from '../modelviews/traspaso.model';
import { downloadfile } from '../modelviews/downloadfile';
import { admUbicacionesEmpleado } from '../models/admUbicacionesEmpleado';
import {MLogin} from './../models/MLogin'
import {asgLiberaciones} from './../models/asgLiberaciones'
import { ListaSeries } from '../modelviews/ListaSeries';
import { InventoryAsgEmployedFinally} from '../modelviews/InventoryAsgEmployedFinally';
//#endregion

@Injectable({
  providedIn: 'root'
})
export class SaecService {

  constructor(
    private http: HttpClient
  ) { }

  GenerateOptions(){
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    const Options = {
      headers
    };

    return Options;
  }

  // LogIn(user: string, password: string) {
  //   return this.http.get<string[]>(`${environment.apiURL}Auth/LogIn/${user}/${password}`);
  // }

  LogIn(login: MLogin) {
    return this.http.post<string[]>(`${environment.apiURL}Auth/LogIn/`, login);
  }

  ObtainData() {
    return this.http.get<string[]>(`${environment.apiURL}Auth/ObtainData`, this.GenerateOptions());
  }

  //#region Administration

  GetAllStatus() {
    return this.http.get<catStatus[]>(`${environment.apiURL}Administracion/GetAllStatus`, this.GenerateOptions());
  }

  GetAllSubStatus() {
    return this.http.get<catSubStatus[]>(`${environment.apiURL}Administracion/GetAllSubStatus`, this.GenerateOptions());
  }

  GetAsiggmentByUI(uiAsiggment: Guid) {
    return this.http.get<asgAsignaciones>(`${environment.apiURL}Asignacion/GetAsiggmentByUI/${uiAsiggment}`, this.GenerateOptions());
  }

  //#region Employed
  GetAllEmployeds() {
    return this.http.get<admEmpleados[]>(`${environment.apiURL}Administracion/GetAllEmployeds`, this.GenerateOptions());
  }

  GetAllEmployed(uiEmployed: number) {
    return this.http.get<admEmpleados>(`${environment.apiURL}Administracion/GetEmployedUpdate/${uiEmployed}`, this.GenerateOptions());
  }

  GetEmployedByUi(uiEmployed: any) {
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    const Options = {
      headers
    };
    return this.http.get<admEmpleados>(`${environment.apiURL}Administracion/GetEmployedByUi/${uiEmployed}`, Options);
  }

  PutEmployed(employed: admEmpleados) {
    return this.http.put<admEmpleados>(`${environment.apiURL}Asignacion/PutEmployed`, employed, this.GenerateOptions());
  }

  PostEmployed(employed: admEmpleados) {
    return this.http.post<admEmpleados>(`${environment.apiURL}Administracion/PostEmployed`, employed, this.GenerateOptions());
  }

  PutEmployedNew(employed: admEmpleados) {
    return this.http.put<admEmpleados>(`${environment.apiURL}Administracion/PutEmployedNew`, employed, this.GenerateOptions());
  }

  PostEmployedNew(employed: admEmpleados) {
    return this.http.post<admEmpleados>(`${environment.apiURL}Administracion/PostEmployedNew`, employed, this.GenerateOptions());
  }

  DeleteEmployed(uiEmployed: number){
    return this.http.get<admEmpleados>(`${environment.apiURL}Administracion/DeleteEmployed/${uiEmployed}`, this.GenerateOptions());
  }

  GetAllNameEmailHCM(uiEmployed: number){
    return this.http.get<admEmpleados>(`${environment.apiURL}Asignacion/GetAllNameUIHCM/${uiEmployed}`, this.GenerateOptions());
  }

  GetUbicacionesEmpleados() {
    return this.http.get<any[]>(`${environment.apiURL}Administracion/GetEmployedLocations`, this.GenerateOptions());
  }

  GetUbicacionEmpleado(uiIdUicacion:number) {
    return this.http.get<admUbicacionesEmpleado>(`${environment.apiURL}Administracion/GetEmployedLocationsEmployed/${uiIdUicacion}`, this.GenerateOptions());
  }
  //#endregion

  //#region Transfer
  GettransferByUI(uiDivice: Guid) {
    return this.http.get<transferencia[]>(`${environment.apiURL}Administracion/GettransferByUI/${uiDivice}`, this.GenerateOptions());
  }
  //#endregion

  //#endregion

  //#region Comercial

  GetAllOrdenes() {
    return this.http.get<any>(`${environment.apiURL}Comercial/GetAllOrdenes`, this.GenerateOptions());
  }

  GetAllSOC() {
    return this.http.get<any[]>(`${environment.apiURL}Comercial/GetAllSOC`, this.GenerateOptions());
  }

  GetAllsContrato() {
    return this.http.get<string[]>(`${environment.apiURL}Comercial/GetAllsContrato`, this.GenerateOptions());
  }

  PostComercial(comercial: catComercial) {
    return this.http.post<catComercial>(`${environment.apiURL}Administracion/PostComercial/`, comercial, this.GenerateOptions());
  }

  GetRemisionByUI(uiRemision: Guid) {
    return this.http.get<remision>(`${environment.apiURL}Comercial/GetRemisionByUI/${uiRemision}`, this.GenerateOptions());
  }

  GetFacturaByUI(uiFactura: Guid, uiRemision: Guid) {
    return this.http.get<factura>(`${environment.apiURL}Comercial/GetFacturaByUI/${uiFactura}/${uiRemision}`, this.GenerateOptions());
  }

  GetComercialByUI(uiComercial: Guid){
    return this.http.get<comercial>(`${environment.apiURL}Comercial/GetComercialByUI/${uiComercial}`, this.GenerateOptions());
  }

  GetAllInvoices() {
    return this.http.get<invoiceHeader[]>(`${environment.apiURL}Comercial/GetAllInvoices/`, this.GenerateOptions());
  }

  //#endregion

  //#region Catalogo

  GetAllTypesDevice() {
    return this.http.get<catGeneral[]>(`${environment.apiURL}Catalogo/GetAllTypesDevice`, this.GenerateOptions());
  }

  GetAllBranchs() {
    return this.http.get<catGeneral[]>(`${environment.apiURL}Catalogo/GetAllBranchs`, this.GenerateOptions());
  }

  GetAllModels() {
    return this.http.get<catGeneral[]>(`${environment.apiURL}Catalogo/GetAllModels`, this.GenerateOptions());
  }

  GetAllTypesLease() {
    return this.http.get<catTipoArrendamiento[]>(`${environment.apiURL}Catalogo/GetAllTypesLease`, this.GenerateOptions());
  }

  GetAllTypesComercial() {
    return this.http.get<catTiposComercial[]>(`${environment.apiURL}Catalogo/GetAllTypesComercial`, this.GenerateOptions());
  }

  GetTipoByAF() {
    return this.http.get<catGeneral[]>(`${environment.apiURL}Catalogo/GetTipoByAF`, this.GenerateOptions());
  }

  //#endregion

  GetAllUbicacion() {
    return this.http.get<admUbicaciones[]>(`${environment.apiURL}Dispositivos/GetAllUbicacion`, this.GenerateOptions());
  }

  GetResponsables(){
    return this.http.get<admResponsables[]>(`${environment.apiURL}Administracion/GetResponsables`, this.GenerateOptions());
  }

  GetAllAlmacen() {
    return this.http.get<admUbicaciones[]>(`${environment.apiURL}Dispositivos/GetAllAlmacen`, this.GenerateOptions());
  }

  GetResponsable(uiClave: string) {
    return this.http.get<admResponsables>(`${environment.apiURL}Dispositivos/GetResponsable/${uiClave}`, this.GenerateOptions());
  }

  GetBodega() {
    return this.http.get<bodega[]>(`${environment.apiURL}Dispositivos/GetBodega/`, this.GenerateOptions());
  }

  //#region Inventary

  GetReportes() {
    return this.http.get<reportes[]>(`${environment.apiURL}Inventario/GetReportes`, this.GenerateOptions());
  }

  GetSolicitudes() {
    return this.http.get<solicitudes[]>(`${environment.apiURL}Inventario/GetSolicitudes`, this.GenerateOptions());
  }

  PutSolicitud(Record: admRegistrarDispositivos, uiRecord: number) {
    return this.http.put<any>(`${environment.apiURL}Inventario/PutSolicitud/${uiRecord}`, Record, this.GenerateOptions());
  }

  PutReporte(Record: admReporteEquipos, uiRecord: number) {
    return this.http.put<any>(`${environment.apiURL}Inventario/PutReporte/${uiRecord}`, Record, this.GenerateOptions());
  }

  GetUsers() {
    return this.http.get<admUserInv[]>(`${environment.apiURL}Inventario/GetUsers`, this.GenerateOptions());
  }

  PostUser(user: admUserInv) {
    return this.http.post<admUserInv>(`${environment.apiURL}Inventario/PostUser`, user, this.GenerateOptions());
  }

  GetReportInventory() {
    return this.http.get<vwReporteInventario[]>(`${environment.apiURL}Inventario/GetReportInventory`, this.GenerateOptions());
  }

  DownLoadLogError() {
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const options = {
      headers, 
      responseType: 'blob' as 'json'
    };
    return this.http.get<Blob>(`${environment.apiURL}Inventario/DownLoadLogError`, options);
  }

  DownLoadReportInventory(report: vwReporteInventario[]) {
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const options = {
      headers,
      responseType: 'blob' as 'json'
    };
    return this.http.post<Blob>(`${environment.apiURL}Inventario/DownLoadReportInventory`, report, options);
  }

  //#endregion

  //#region Divices
  GetAllDivices() {
    return this.http.get<dispositivos[]>(`${environment.apiURL}Dispositivos/GetAllDivices`, this.GenerateOptions());
  }

  GetDiviceBySerie(sSerie: string) {
    return this.http.get<dispositivos>(`${environment.apiURL}Dispositivos/GetDiviceBySerie/${sSerie}`, this.GenerateOptions());
  }

  GetDiviceByUI(uiDivice: Guid) {
    return this.http.get<dispositivos>(`${environment.apiURL}Dispositivos/GetDiviceByUI/${uiDivice}`, this.GenerateOptions());
  }

  GetAllSeries() {
    return this.http.get<seriesaf[]>(`${environment.apiURL}Dispositivos/GetAllSeries`, this.GenerateOptions());
  }

  GetStockActivos() {
    return this.http.get<activofijo[]>(`${environment.apiURL}Dispositivos/GetStockActivos`, this.GenerateOptions());
  }

  GetStockAdicionals() {
    return this.http.get<activofijo[]>(`${environment.apiURL}Dispositivos/GetStockAdicionals`, this.GenerateOptions());
  }

  GetAccesories() {
    return this.http.get<catAccesorios[]>(`${environment.apiURL}Dispositivos/GetAccesories`, this.GenerateOptions());
  }

  PutDevice(changes: changesdevices){
    return this.http.put<any>(`${environment.apiURL}Dispositivos/PutDevice/`, changes, this.GenerateOptions());
  }

  DownLoadBodega(almacen: string, status: string, bodega: bodega[]) {
    return this.http.post<bodegafile>(`${environment.apiURL}Dispositivos/DownLoadBodega?almacen=${almacen}&status=${status}`, bodega, this.GenerateOptions());
  }
  //#endregion

  //#region Asiggments
  GetAllNameEmail(){
    return this.http.get<admEmpleados[]>(`${environment.apiURL}Asignacion/GetAllNameUI/`, this.GenerateOptions());
  }

  GetAllAsigments() {
    return this.http.get<assigments[]>(`${environment.apiURL}Asignacion/GetAllAsigments/`, this.GenerateOptions());
  }

  GetUIAsigment(sSerie: string, uiEmployed: number) {
    return this.http.get<asgAsignaciones>(`${environment.apiURL}Asignacion/GetUIAsigment/${sSerie}/${uiEmployed}`, this.GenerateOptions());
  }

  GetAssigmentByuiDevice(uiDevice: Guid) {
    return this.http.get<admEmpleados>(`${environment.apiURL}Asignacion/GetAssigmentByuiDevice/${uiDevice}`, this.GenerateOptions());
  }

  DownLoadAllAsigments(assigments: assigments[]) {
    return this.http.post<bodegafile>(`${environment.apiURL}Asignacion/DownLoadAllAsigments`, assigments, this.GenerateOptions());
  }

  GetExrnalByUI(uiAsg: Guid) {
    return this.http.get<any>(`${environment.apiURL}Asignacion/GetExrnalByUI/${uiAsg}`, this.GenerateOptions());
  }

  PostExternal(external: asgExternos) {
    return this.http.post<any>(`${environment.apiURL}Asignacion/PostExternal/`, external, this.GenerateOptions());
  }

  PutExternal(external: asgExternos) {
    return this.http.put<any>(`${environment.apiURL}Asignacion/PutExternal/`, external, this.GenerateOptions());
  }

  DeleteExternal(external: asgExternos) {
    return this.http.delete<any>(`${environment.apiURL}Asignacion/DeleteExternal/${external.uiResponsable}`, this.GenerateOptions());
  }

  GetAddicionalsByAsiigment(uiAsg: Guid) {
    return this.http.get<addicional[]>(`${environment.apiURL}Asignacion/GetAddicionalsByAsiigment/${uiAsg}`, this.GenerateOptions());
  }

  PostAccesories(accesories: any){
    return this.http.post<any[]>(`${environment.apiURL}Asignacion/PostAccesories`, accesories, this.GenerateOptions());
  }

  PostAddicional(uiAsg: Guid, divice: activofijo) {
    return this.http.post<any>(`${environment.apiURL}Asignacion/PostAddicional/${uiAsg}`, divice, this.GenerateOptions());
  }

  RealeseAddicional(uiAddicional: number) {
    return this.http.get<asgAdicionales>(`${environment.apiURL}Asignacion/RealeseAddicional/${uiAddicional}`, this.GenerateOptions());
  }

  GetUserData(uiEmployed: string) {
    return this.http.get<admEmpleados>(`${environment.apiURL}Asignacion/GetUserData/${uiEmployed}`, this.GenerateOptions());
  }

  GetTypesAsigments() {
    return this.http.get<catTipoAsignacion[]>(`${environment.apiURL}Asignacion/GetTypesAsigments`, this.GenerateOptions());
  }

  ReSendEmail(uiAssigment: Guid) {
    return this.http.get<dataemail>(`${environment.apiURL}Asignacion/ReSendEmail/${uiAssigment}`, this.GenerateOptions());
  }

  PostAssigment(newassigment: assigment) {
    return this.http.post<any>(`${environment.apiURL}Asignacion/PostAssigment`, newassigment, this.GenerateOptions());
  }

  GetEmployedAssigments(uiEmployed: string) {
    return this.http.get<employedassigments>(`${environment.apiURL}Asignacion/GetEmployedAssigments/${uiEmployed}`, this.GenerateOptions());
  }

  GetAssigmentsByEmployed(uiEmployed: number) {
    return this.http.get<detaildevice[]>(`${environment.apiURL}Asignacion/GetAssigmentsByEmployed/${uiEmployed}`, this.GenerateOptions());
  }

  GetAsiggmentsByUser(data: string){
    return this.http.get<employedassigment[]>(`${environment.apiURL}Asignacion/GetAsiggmentsByUser/${data}`, this.GenerateOptions());
  }

  GetAccesoriesByAssigment(uiAssigment: Guid) {
    return this.http.get<catAccesorios[]>(`${environment.apiURL}Asignacion/GetAccesoriesByAssigment/${uiAssigment}`, this.GenerateOptions());
  }

  GetAccesoriesByUI(uiAssigment: Guid) {
    return this.http.get<number[]>(`${environment.apiURL}Asignacion/GetAccesoriesByUI/${uiAssigment}`, this.GenerateOptions());
  }

  GetHistoryByDivice(uiDivice: Guid) {
    return this.http.get<asighistory[]>(`${environment.apiURL}Asignacion/GetHistoryByDivice/${uiDivice}`, this.GenerateOptions());
  }

  PostTraspaso(traspaso: traspaso) {
    return this.http.post<any>(`${environment.apiURL}Asignacion/PostTraspaso`, traspaso, this.GenerateOptions());
  }

  PutAssgiment(uiAssigment: Guid, data: any) {
    return this.http.put<any>(`${environment.apiURL}Asignacion/PutAssgiment/${uiAssigment}`, data, this.GenerateOptions());
  }

  GetEntregas() {
    return this.http.get<asgEntregaLiberacion[]>(`${environment.apiURL}Asignacion/GetEntregas`, this.GenerateOptions());
  }

  GetMotivos() {
    return this.http.get<asgMotivoLiberacion[]>(`${environment.apiURL}Asignacion/GetMotivos`, this.GenerateOptions());
  }

  PostRealese(realese: any) {
    return this.http.post<any>(`${environment.apiURL}Asignacion/PostRealese`, realese, this.GenerateOptions());
  }
  //#endregion

  GetPreLiberados() {
    return this.http.get<viewPreLiberados[]>(`${environment.apiURL}Querys/GetPreLiberados`, this.GenerateOptions());
  }

  DownLoadPre(preliberados: viewPreLiberados[]) {
    return this.http.post<bodegafile>(`${environment.apiURL}Querys/DownLoadPre`, preliberados, this.GenerateOptions());
  }

  DownLoadFile(uiOrigen: Guid) {
    return this.http.get<any>(`${environment.apiURL}Administracion/DownLoadFile/${uiOrigen}`, this.GenerateOptions());
  }

  DownLoadResponsiva(uiAsiggment: Guid) {
    return this.http.get<any>(`${environment.apiURL}Asignacion/DownLoadResponsiva/${uiAsiggment}`, this.GenerateOptions());
  }

  GetPowerBi() {
    return this.http.get<string[]>(`${environment.apiURL}Querys/GetPowerBi`, this.GenerateOptions());
  }

  PostDocument(repos: File, uiOrigen: Guid) {
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const options = {
      headers
    };
    const fd = new FormData();
    fd.append('File', repos);
    return this.http.post<any>(`${environment.apiURL}Administracion/PostDocument/${uiOrigen}`, fd, options);
  }

  PostSupport(repos: File, uiOrigen: Guid) {
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const httpOptions = {
      headers
    };
    const fd = new FormData();
    fd.append('File', repos);
    return this.http.post<any>(`${environment.apiURL}Administracion/PostSupport/${uiOrigen}`, fd, httpOptions);
  }

  PostResponsiva(repos: File, uiOrigen: Guid) {
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const httpOptions = {
      headers
    };
    const fd = new FormData();
    fd.append('File', repos);
    return this.http.post<any>(`${environment.apiURL}Administracion/PostResponsiva/${uiOrigen}`, fd, httpOptions);
  }

  GetSupportsByUi(uiSupport: Guid) {
    return this.http.get<detailsupport[]>(`${environment.apiURL}Administracion/GetSupportsByUi/${uiSupport}`, this.GenerateOptions());
  }

  DownloadSupport(uiSupport: number) {
    return this.http.get<any>(`${environment.apiURL}Administracion/DoloadSupport/${uiSupport}`, this.GenerateOptions());
  }

  DownLoadReport() {
    return this.http.get<downloadfile>(`${environment.apiURL}Asignacion/DownLoadReport`, this.GenerateOptions());
  }

  DownLoadReportAdicionales() {
    return this.http.get<downloadfile>(`${environment.apiURL}Asignacion/DownLoadReportAdiconales`, this.GenerateOptions());
  }

  GuardarObsoletos(sSerie: string) {
    return this.http.get<asgLiberaciones>(`${environment.apiURL}Dispositivos/GuardarObsoletos/${sSerie}`, this.GenerateOptions());
  }


  // GuardarObsoletos3(archivo: File){
  //   const fd = new FormData();
  //   fd.append('File', archivo);
  //   return this.http.post<string[]>(`${environment.apiURL}Dispositivos/GuardarObsoletos3/`, fd, this.GenerateOptions());
  // }

  GuardarObsoletos3(archivo: File){
    const fd = new FormData();
    fd.append('File', archivo);
    return this.http.post<ListaSeries[]>(`${environment.apiURL}Dispositivos/GuardarObsoletos3/`, fd, this.GenerateOptions());
  }

  GuardarLiberados(sSerie: string) {
    return this.http.get<asgLiberaciones>(`${environment.apiURL}Dispositivos/GuardarLiberados/${sSerie}`, this.GenerateOptions());
  }


  GuardarPDFLiberados(uiOrigin: Guid, archivo: File){
    const fd = new FormData();
    fd.append('File', archivo);
    return this.http.post<string[]>(`${environment.apiURL}Dispositivos/GuardarPDFLiberados/${uiOrigin}`, fd, this.GenerateOptions());
  }

  GetInventoryAsgEmployed() {
    return this.http.get<InventoryAsgEmployedFinally[]>(`${environment.apiURL}Inventario/GetReportInventoryAsgEmployed`, this.GenerateOptions());
  }

  DownLoadReportInventoryAsgEmployed(report: InventoryAsgEmployedFinally[]) {
    const token = localStorage.getItem('tokenSaec');
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const options = {
      headers,
      responseType: 'blob' as 'json'
    };
    return this.http.post<Blob>(`${environment.apiURL}Inventario/DownLoadReportInventoryAsgEmployed`, report, options);
  }


  PostSaleDevice(newassigment: assigment) {
    return this.http.post<any>(`${environment.apiURL}Dispositivos/PostSaleDevice`, newassigment, this.GenerateOptions());
  }

  // DownLoadReportInventoryAdicionalsAsgEmployed() {
  //   // const token = localStorage.getItem('tokenSaec');
  //   // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  //   // const options = {
  //   //   headers,
  //   //   //responseType: 'blob' as 'json'
  //   // };
  //   return this.http.get<Blob>(`${environment.apiURL}Inventario/DownLoadReportInventoryAdicionales`,this.GenerateOptions());
  // }

  DownLoadReportInventoryAdicionalsAsgEmployed() {
    return this.http.get<downloadfile>(`${environment.apiURL}Inventario/DownLoadReportInventoryAdicionales`, this.GenerateOptions());
  }

}
