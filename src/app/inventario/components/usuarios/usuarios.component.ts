import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { admUbicaciones } from 'src/app/core/models/admUbicaciones.model';
import { SaecService } from 'src/app/core/services/saec.service';
import { map, startWith } from 'rxjs/operators';
import { checkError } from 'src/app/core/functions/checkError';
import { admUserInv } from 'src/app/core/models/admUserInv.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  user: FormGroup;
  isBusy = false;
  ubicaciones: admUbicaciones[] = [];
  filterubicaciones!: Observable<admUbicaciones[]>;
  dataSource: MatTableDataSource<admUserInv> = new MatTableDataSource<admUserInv>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  displayedColumns: string[] = ['Usuario', 'Contraseña', 'Ubicacion', 'Activo', 'Creado'];
  isLoadingResults = false;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private saecService: SaecService,
    private titleservice: Title
  ) {
    this.user = this.builder.group({
      sUser: ['', Validators.required],
      sPassword: ['', [Validators.required, Validators.minLength(8)]],
      uiClaveUbicacion: ['', Validators.required],
      bActive: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.titleservice.setTitle('Usuarios App');
    this.isLoadingResults = true;
    this.saecService.GetUsers()
    .subscribe(result => {
      this.dataSource.data = result;
      this.isLoadingResults = false;
    }, error => {
      this.isLoadingResults = false;
      checkError(error, this.router, this.snackBar)
    });

    this.saecService.GetAllUbicacion()
    .subscribe( result => {
      this.ubicaciones = result;
    }, error => {
      checkError(error, this.router, this.snackBar)
    });

    this.filterubicaciones = this.user.controls.uiClaveUbicacion.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUbi(value))
    );
  }

  private _filterUbi(value: string): admUbicaciones[] {
    const filterValue = value.toString().toUpperCase();
    return this.ubicaciones.filter(option => option.sNombre.toString().toUpperCase().includes(filterValue));
  }

  displayDivision(ubicacion: admUbicaciones): string {
    return ubicacion ? ubicacion.sNombre : '';
  }

  searchProveedor(value: string) {
    this.dataSource.filter = value;
  }

  submit() {
    this.isBusy = true;
    let newUser: admUserInv = new admUserInv();
    newUser.sUser = this.user.controls.sUser.value;
    newUser.sPassword = this.user.controls.sPassword.value;
    newUser.uiClaveUbicacion = this.user.controls.uiClaveUbicacion.value.uiClaveEmpresa;
    newUser.bActive = true;
    console.log(newUser)
    this.saecService.PostUser(newUser)
    .subscribe(result => {
      this.isBusy = false;
      this.dataSource.data.push(result);
      this.dataSource._updateChangeSubscription();
      this.snackBar.open('El usuario fue creado.', 'Aceptar', {
        duration: 10000
      });
    }, error => {
      console.log(error);
      this.isBusy = false;
      checkError(error, this.router, this.snackBar)
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
