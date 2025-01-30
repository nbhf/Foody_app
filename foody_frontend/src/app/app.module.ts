import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // Importez HttpClientModule
import { FormsModule } from '@angular/forms';  // Importer FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecipeComponent } from './recipe/recipe.component';
import { CommentComponent } from './comment/comment.component';
import { CommentService } from './comment/comment.service';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
@NgModule({
  declarations: [
    AppComponent,
    RecipeComponent,
    CommentComponent,
    RecipeDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule ,
    FormsModule    

  ],
  providers: [CommentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
