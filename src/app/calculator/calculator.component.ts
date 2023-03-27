import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  //variable declaration
 inputType:string="EUR";
 outputType:string="USD";
 overrideRate:number=0
 fxRateManual:number=0;
 inputVal:number=0;
 outputVal:number=0;
 fixRate:number=1.1;
 index:number=0;
 isOverrideActive:boolean=false;
records:{realFxRate:number,
override:number,
intialAmount:number,
convertedAmount:number,
initialCurrency:string,
convertedCurrency:string}[]=Array(5)
  userInput = new FormControl(0);
  
  ngOnInit():void{
  //updating the fix rate after every 3 sec
    const updateFixRate=interval(3000);
    updateFixRate.subscribe(res=>{
        let temp=+(Math.random()*0.1-0.05).toFixed(3);
        this.fixRate+=temp;
        this.fixRate=+this.fixRate.toFixed(3);
        this.outputVal=this.inputVal*this.getExchangeRate();
    })
  }
  //get the exchange rate either overide or fix based on the condition
  getExchangeRate():number{
    let difference=Math.abs(this.fixRate-this.overrideRate)/this.fixRate;
    if(difference<=0.02&&this.isOverrideActive)
          return this.overrideRate
    return this.fixRate;
  }
  //activate overide field
  activateOverride() {
    this.isOverrideActive = true;
  }
  //deactivate override field
  deactivateOverride() {
    this.isOverrideActive = false;
  }
  //perform calculation when click calculate button
  calculate():void{
    this.inputVal=this.userInput.value!;
      this.outputVal=this.inputVal*this.getExchangeRate();
      this.records[this.index]={
        realFxRate:this.fixRate,
        intialAmount:this.inputVal,
        override:this.isOverrideActive?this.overrideRate:0,
        initialCurrency:this.inputType,
        convertedAmount:this.outputVal,
        convertedCurrency:this.outputType
      }
      this.index=(this.index+1)%5;
  }
  //function used to change the input currency
  replace():void{
    [this.inputType,this.outputType]=[this.outputType,this.inputType];
    this.fixRate=+(1/this.fixRate).toFixed(3);
    [this.inputVal,this.outputVal]=[this.outputVal,this.inputVal*this.fixRate];
    
  }
  
}
