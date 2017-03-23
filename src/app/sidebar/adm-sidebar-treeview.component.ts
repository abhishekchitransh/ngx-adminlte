/**
 * Created by zml on 2016/4/17.
 */

import {Component, Input} from "@angular/core";
import {AdmSideBarTreeItem} from "../shared/models/AdmSideBarTreeItem";

import * as _ from 'lodash';

@Component({
  selector: 'adm-sidebar-treeview',
  templateUrl: './adm-sidebar-treeview.component.html',
})
export class AdmSideBarTreeViewComponent {

  @Input('items')
  items:AdmSideBarTreeItem[];

  /**
   * Click action handler.
   * @param event The click event.
   * @param clickedItem The clicked item.
   */
  private onClick(event, clickedItem:AdmSideBarTreeItem):void {

    // here is the event terminal, stop propagating.
    event.stopPropagation();

    // 1. temp record current status.
    let currentStatus = clickedItem.isActive;

    // 2. deactive all items.
    this.deactiveAll(this.items);

    // 3. switch clicked item status.
    clickedItem.isActive = !currentStatus;

    // 4. active all parent of clicked item if it is not top item.
    if (clickedItem.type !== 'treeview') {
      for (let item of this.getAllParents(clickedItem)) {
        item.isActive = true;
      }
    }
  }

  private deactiveAll(allItems:AdmSideBarTreeItem[]):void {
    if (!allItems) {
      return;
    }
    for (let item of allItems) {
      item.isActive = false;
      this.deactiveAll(item.children);
    }
  }

  /**
   *  Return all parents of target item from whole defined items.
   * @param targetItem The target item.
   * @returns {Array} All parent items.
   */
  private getAllParents(targetItem:AdmSideBarTreeItem):AdmSideBarTreeItem[] {
    let parents = [];
    for (let possibleItem of this.items) {
      parents = this.getParents(targetItem, possibleItem);
      if (parents.length > 0) {
        break;
      }
    }
    return parents;
  }

  /**
   *  Recursively collect all parents of target item from the possible item.
   *
   * @param targetItem The target item.
   * @param possibleItem The possible parent item.
   * @returns {Array} All parents of target item.
   */
  private getParents(targetItem:AdmSideBarTreeItem, possibleItem:AdmSideBarTreeItem):AdmSideBarTreeItem[] {

    if (!possibleItem.children) {
      return [];
    }

    let parents = [];

    // Recursively collect parents!
    for (let child of possibleItem.children) {

      // Check direct child of possible item.
      if (child === targetItem) {
        parents.push(possibleItem);
        break;
      }

      // Recursively check all child's children of possible item.
      let parentsFromChild = this.getParents(targetItem, child);
      if (parentsFromChild.length > 0) { // Means find target item from child's children.
        parents.push(possibleItem);
        parents = parents.concat(parentsFromChild);
        break;
      }
    }

    return parents;
  }

  private getLeftIcon(item:AdmSideBarTreeItem) {
    if (item.isActive && item.leftActiveIcon) {
      return item.leftActiveIcon;
    }
    return item.leftIcon;
  }

  private getRightIcon(item:AdmSideBarTreeItem) {
    if (item.isActive && item.rightActiveIcon) {
      return item.rightActiveIcon;
    }
    return item.rightIcon;
  }

}
