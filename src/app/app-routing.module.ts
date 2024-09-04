import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
      },
      {
        path: 'index',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'dispositivos',
        loadChildren: () => import('./dispositivos/dispositivos.module').then(m => m.DispositivosModule)
      },
      {
        path: 'inventario',
        loadChildren: () => import('./inventario/inventario.module').then(m => m.InventarioModule)
      },
      {
        path: 'asignacion',
        loadChildren: () => import('./asignacion/asignacion.module').then(m => m.AsignacionModule)
      },
      {
        path: 'administracion',
        loadChildren: () => import('./administracion/administracion.module').then(m => m.AdministracionModule)
      },
      {
        path: 'consulta',
        loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule)
      },
      {
        path: 'tramites',
        loadChildren: () => import('./tramites/tramites.module').then(m => m.TramitesModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
