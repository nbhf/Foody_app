import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule , ReactiveFormsModule } from '@angular/forms';  
import { authInterceptorProvider } from './auth/interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipeComponent } from './recipe/recipe.component';
import { CommentComponent } from './comment/comment.component';
import { CommentService } from './comment/comment.service';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './shared/components/home/home.component';
import { AllrecipesComponent } from './allrecipes/allrecipes.component';
import { DefaultImagePipe } from './shared/pipes/default-image.pipe';
import { UserComponent } from './user/user.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
@NgModule({
  declarations: [
    AppComponent,
    RecipeComponent,
    CommentComponent,
    RecipeDetailsComponent,
    LoginComponent,
    SignupComponent,
    RecipeCreateComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AllrecipesComponent,
    DefaultImagePipe,
    NotificationComponent,
    AdminDashboardComponent,
    DefaultImagePipe,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule ,
    FormsModule ,
    ReactiveFormsModule,
    BrowserAnimationsModule  

  ],
  providers: [CommentService ,AuthGuard, authInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
