import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { Ingredient } from "src/app/shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.scss"],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editForm: FormGroup;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  editedItemIndex: number;
  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.editForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[1-9]+[0-9]*$"),
      ]),
    });

    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.editForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const newIngredient = new Ingredient(
      this.editForm.value.name,
      this.editForm.value.amount
    );
    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedItemIndex,
        newIngredient
      );
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.onClear();
    console.log(this.editForm);
  }

  onClear() {
    this.editMode = false;
    this.editForm.reset();
  }
}
