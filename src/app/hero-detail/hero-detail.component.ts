import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Address, Hero, states } from '../data-model';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnChanges {
  
  @Input() hero: Hero;

  heroForm: FormGroup; // <--- heroForm is of type FormGroup
  states = states;
  nameChangeLog: string[] = [];
  
  constructor(private fb: FormBuilder) { // <--- inject FormBuilder
    this.createForm();
    this.logNameChange();
  }

  createForm() {
    this.heroForm = this.fb.group({
      name: ['', Validators.required ],
      secretLairs: this.fb.array([]), // <-- a FormGroup with a new address
      power: '',
      sidekick: ''
    });
  }
  
  rebuildForm() {
    this.heroForm.reset({
      name: this.hero.name
    });
    this.setAddresses(this.hero.addresses);
  }
  
  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map(address => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);
    this.heroForm.setControl('secretLairs', addressFormArray);
  }
  
  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }


  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };
  // ngOnInit() {
  //     this.heroForm.setValue({
  //     name:    this.hero.name,
  //     address: this.hero.addresses[0] || new Address()
  // });
  // }
  
  logNameChange() {
    const nameControl = this.heroForm.get('name');
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }
  
  prepareSaveHero(): Hero {
    const formModel = this.heroForm.value;

    // deep copy of form model lairs
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );

    // return new `Hero` object containing a combination of original hero value(s)
    // and deep copies of changed form model values
    const saveHero: Hero = {
      id: this.hero.id,
      name: formModel.name as string,
      // addresses: formModel.secretLairs // <-- bad!
      addresses: secretLairsDeepCopy
    };
    return saveHero;
  }
  
  revert() { this.rebuildForm(); }
  
  ngOnChanges(){
    this.rebuildForm();
  }
  
  onSubmit() {
    this.hero = this.prepareSaveHero();
    this.heroService.updateHero(this.hero).subscribe(/* error handling */);
    this.rebuildForm();
  }

}
