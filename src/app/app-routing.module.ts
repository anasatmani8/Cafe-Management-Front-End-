import { ImoAchatComponent } from './imo-achat/imo-achat.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ProduitMenuComponent } from './produit-menu/produit-menu.component';
import { CategoryMenuComponent } from './category-menu/category-menu.component';
import { RouteGuardService } from './services/route-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category', component: CategoryMenuComponent },
  { path: 'productMenu/:id', component: ProduitMenuComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'AddAchat', component:ImoAchatComponent},
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),
          canActivate: [RouteGuardService],
          data:{
            expectedRole:['admin', 'user']
          }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [RouteGuardService],
          data:{
            expectedRole:['admin', 'user']
          }
      },
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
