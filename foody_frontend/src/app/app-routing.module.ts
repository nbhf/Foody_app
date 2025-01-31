import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { authGuard } from './auth/guards/auth.guard';
import { APP_ROUTES } from './config/app-routes.config';

const routes: Routes = [
  { path: APP_ROUTES.home, component: HomeComponent },
  { path: APP_ROUTES.recipedetails, component: RecipeDetailsComponent,  canActivate: [authGuard] },
  //{path: APP_ROUTES.postrecipe, component: PostRecipeComponent, canActivate: [authGuard] },
  { path: APP_ROUTES.signup, component: SignupComponent },
  { path: APP_ROUTES.login, component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
