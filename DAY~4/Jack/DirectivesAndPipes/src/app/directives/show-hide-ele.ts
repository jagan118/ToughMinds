import { Directive, Input, ViewContainerRef, TemplateRef, inject, effect, signal } from '@angular/core';

@Directive({
  selector: '[appShowHideEle]',
  standalone: true
})
export class ShowHideEle {
  private templateRef = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);

  // 1. Create internal signals to hold the values
  private allowedRoles = signal<string[]>([]);
  private currentRole = signal<string>('');

  // 2. Accept the static roles array as before
  @Input() set appShowHideEle(roles: string[]) {
    this.allowedRoles.set(roles);
  }

  // 3. Add a second input to accept the active live role from the component
  @Input() set appShowHideEleCurrentRole(role: string) {
    this.currentRole.set(role);
  }

  constructor() {
    // 4. This effect now tracks Angular Signals, so it will fire instantly on click!
    effect(() => {
      const roles = this.allowedRoles();
      const userRole = this.currentRole();
      const hasPermission = roles.includes(userRole);

      // Clear previous views to prevent duplication
      this.vcr.clear();

      if (hasPermission) {
        this.vcr.createEmbeddedView(this.templateRef);
      }
    });
  }
}




// import { Directive,ElementRef,Input, PLATFORM_ID,ViewContainerRef,TemplateRef ,inject} from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';

// @Directive({
//   selector: '[appShowHideEle]',
//   standalone:true
// })
// export class ShowHideEle {
//   private platformId = inject(PLATFORM_ID);

//   @Input()  set appShowHideEle(roles:string[]){
//     const userRole = this.getCurrentUserRole();
//     const hasPermision = roles.includes(userRole);

//     if(hasPermision){
//       this.vcr.createEmbeddedView(this.templateRef)
//     }else{
//       this.vcr.clear();
//     }
//   }

//   constructor(private templateRef:TemplateRef<any>,
//     private vcr:ViewContainerRef
//   ) {}

//   private getCurrentUserRole():string {
//      if (!isPlatformBrowser(this.platformId)) {
//       return ''; 
//     }

//     return localStorage.getItem('userRole') || 'viewer';
//   }

 
// }
