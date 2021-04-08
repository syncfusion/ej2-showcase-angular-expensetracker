import { Component, Directive, ElementRef } from '@angular/core';

import { Browser, rippleEffect, isNullOrUndefined as isNOU, enableRipple } from '@syncfusion/ej2-base';

import { userInfo } from '../common/common.data';
enableRipple(true);

@Component({
  selector: 'ng-app',
  templateUrl: 'menu.component.html'
})

export class MenuComponent {
  public menu: HTMLElement;
  public userName: string;
  public filterMenu: HTMLElement;
  public overlay: HTMLElement;

  constructor(public eleRef: ElementRef) {
    /** Loads the user data in the profile from the sidebar */
    this.userName = userInfo.FullName;
    rippleEffect(document.body, { selector: '.ripple-element', rippleFlag: true });
  }

  public ngAfterViewInit(): void {
    /** Holds the sidebar elements for later use */
    this.menu = this.eleRef.nativeElement.querySelector('#sidebar-wrapper');
    this.overlay = this.eleRef.nativeElement.querySelector('#overlay');
  }

  /** Toggles the sidebar open and close actions - for small resoultion */
  public toggleMenu(): void {
    if (this.menu.classList.contains('open')) {
      this.removeToggleClass();
      this.menu.classList.add('close');
      this.disableOverlay();
    } else if (this.menu.classList.contains('close')) {
      this.removeToggleClass();
      this.menu.classList.add('open');
      this.enableOverlay();
    } else {
      this.menu.classList.add('open');
      this.enableOverlay();
    }
  }

  public removeToggleClass(): void {
    this.menu.classList.remove('open');
    this.menu.classList.remove('close');
  }

  public enableOverlay(): void {
    this.overlay.classList.add('dialog');
    this.overlay.style.background = '#383838';
  }

  public disableOverlay(): void {
    this.overlay.classList.remove('dialog');
    this.overlay.style.background = 'none';
  }

  public handleOverlay(): void {
    this.disableOverlay();
    this.removeToggleClass();
    this.removeFilterToggleClass();
  }

  public removeFilterToggleClass(): void {
    this.menu.style.zIndex = '100001';
    this.filterMenu = this.eleRef.nativeElement.querySelector('.sidebar-wrapper-filter');
    if (!isNOU(this.filterMenu)) {
      this.filterMenu.classList.remove('filter-open');
      this.filterMenu.classList.remove('filter-close');
    }
  }

  /** Toggles the filter bar open and close actions */
  public toggleFilterMenu(): void {
    this.menu.style.zIndex = '10000';
    this.filterMenu = this.eleRef.nativeElement.querySelector('.sidebar-wrapper-filter');
    if (this.filterMenu.classList.contains('filter-open')) {
      this.filterMenu.classList.remove('filter-open');
      this.filterMenu.classList.add('filter-close');
      this.disableOverlay();
    } else if (this.filterMenu.classList.contains('filter-close')) {
      this.filterMenu.classList.remove('filter-close');
      this.filterMenu.classList.add('filter-open');
      this.enableOverlay();
    } else {
      this.filterMenu.classList.add('filter-open');
      this.enableOverlay();
    }
  }

  public onNavigationClick(args: MouseEvent): void {
    if ((args.target as HTMLElement).nodeName === 'A') {
        this.handleOverlay();
    }
  }
}