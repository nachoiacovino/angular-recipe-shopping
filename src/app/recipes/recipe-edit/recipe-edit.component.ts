import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl, FormArray } from "@angular/forms";
import { RecipesService } from "../recipes.service";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.scss"],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = params.id != null;
      this.editRecipe();
    });
  }

  initForm() {
    this.recipeForm = new FormGroup({
      name: new FormControl(null),
      imagePath: new FormControl(null),
      description: new FormControl(null),
      ingredients: new FormArray([]),
    });
  }

  editRecipe() {
    this.initForm();
    if (this.editMode) {
      const recipe = this.recipesService.getRecipe(this.id);
      const { name, imagePath, description, ingredients } = recipe;

      let recipeIngredients = this.recipeForm.controls.ingredients as FormArray;
      if (recipe.ingredients) {
        for (let ingredient of ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name),
              amount: new FormControl(ingredient.amount),
            })
          );
        }
      }

      this.recipeForm.patchValue({
        name,
        imagePath,
        description,
        ingredients: recipeIngredients.controls,
      });
    }
  }

  onSubmit() {
    console.log(this.recipeForm);
  }
}
