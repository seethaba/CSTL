import { Directive } from '@angular/core';

@Directive({
  selector: '[parallax]',
  host: {
  	'(ionScroll)': 'onCntScroll($event)'
  }
})
export class ParallaxDirective {

  constructor() {
    
  }
  onCntScroll(ev){
  	
  }

}
