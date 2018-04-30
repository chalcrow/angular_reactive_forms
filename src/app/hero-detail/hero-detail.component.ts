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

  constructor(private fb: FormBuilder) { // <--- inject FormBuilder
    this.createForm();
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
  
  ngOnChanges(){
    this.rebuildForm();
  }

}
