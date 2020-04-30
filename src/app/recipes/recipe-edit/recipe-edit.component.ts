import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { RecipesService } from "../recipes.service";
import { Recipe } from "../recipe.model";

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
    private router: Router,
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
      name: new FormControl(null, [Validators.required]),
      imagePath: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      ingredients: new FormArray([]),
    });
  }

  //FormArray
  // https://stackblitz.com/edit/angular-form-array-example

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
              name: new FormControl(ingredient.name, [Validators.required]),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern("^[1-9]+[0-9]*$"),
              ]),
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
    if (this.editMode) {
      this.recipesService.updateRecipe(this.id, <Recipe>this.recipeForm.value);
    } else {
      this.recipesService.addRecipe(<Recipe>this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  addIngredient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        name: new FormControl(null, [Validators.required]),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[1-9]+[0-9]*$"),
        ]),
      })
    );
  }
}
