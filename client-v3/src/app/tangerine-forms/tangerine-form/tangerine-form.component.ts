import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TangerinePageComponent } from '../tangerine-page/tangerine-page.component';
import { TangerineFormResult } from '../tangerine-form-result';
import { TangerineForm } from '../tangerine-form';
import { TangerineFormContext } from '../tangerine-form-context';

@Component({
  selector: 'app-tangerine-form',
  templateUrl: './tangerine-form.component.html',
  styleUrls: ['./tangerine-form.component.css']
})
export class TangerineFormComponent implements OnInit {

  // IO.
  @Input() form: TangerineForm;
  @Input() result: TangerineFormResult;
  @Output() resultUpdate: EventEmitter<Object> = new EventEmitter();
  @Output() resultDone: EventEmitter<Object> = new EventEmitter();

  // State is stored in Result, but from that state we need a valid context for our Template to work from.
  private context: TangerineFormContext;

  // TODO: Should be in context as hasNext boolean.
  disableNext = true;

  constructor() {

  }

   ngOnInit() {

    // TODO: Could do this.result and this.form as a setter to instantiate the classes.
    // Set up this.result.
    if (!this.result) {
      this.result = new TangerineFormResult();
    }
    this.form = new TangerineForm(this.form);

    // Get the Context and then go there.
    const context = this.form.findContextFromPath(this.result.currentPath);
    this.goTo(context);
  }

  // TODO: this.context could be a setter.
  private goTo(context) {
    this.context = context;
    this.result.currentPath = this.context.pagePath;
    // TODO: Save new path to log.
  }

  private onTangerinePageUpdate(datum) {
    if (datum.status === 'VALID') {
      this.disableNext = false;
    }
    this.result.currentPageVariables = datum.variables;
    this.result.currentPageStatus = datum.status;
  }

  private saveCurrentResult() {
    this.result.log.push({
      time: (new Date()).toUTCString(),
      action: 'next',
      currentPageVariables: this.result.currentPageVariables,
      currentPageStatus: this.result.currentPageStatus
    });
    this.result.variables = Object.assign(this.result.variables, this.result.currentPageVariables);
    this.result.currentPageVariables = {};
    this.result.currentPageStatus = '';
    this.resultUpdate.emit(this.result);
  }

  private onClickNext() {
    this.saveCurrentResult();
    const context = this.form.findNextContextFromPath(this.result.currentPath);
    // TODO Run skip logic.
    this.goTo(context);
  }

  private onClickDone() {
    this.saveCurrentResult();
    this.resultDone.emit(this.result);
  }

        /*
        Skip logic stuff to be migrated up.


        This stuff needs to go in the component I think.
        const nextObject = this.objectByPath[path];
        if (nextObject.collection === 'section') {
        this.currentSection = nextObject;
        const shouldSkip = false;
        if (nextObject.preCondition !== '') {
            const variables = this.result.variables;
            const skipLogic = 'var preCondition = function() { ' + nextObject.preCondition + ' }; shouldSkip = preCondition();';
            console.log('Executing skipLogic:');
            console.log(skipLogic);
            eval(skipLogic);
        }
        if (shouldSkip) {
            // Find the next sibling section.
            let i = this.currentPathIndex;
            let nextSiblingPath = null;
            const sectionDepth = (this.currentPath.split('\/')).length;
            while (nextSiblingPath == null) {
            i++;
            const nextPotentialSiblingPath = this.pathByIndex[i];
            if (nextPotentialSiblingPath) {
                const nextPotentialSiblingPathFragments = nextPotentialSiblingPath.split('\/');
                if (nextPotentialSiblingPathFragments.length === sectionDepth) {
                nextSiblingPath = nextPotentialSiblingPath;
                }
            } else {
                nextSiblingPath = 'done';
            }
            }
            if (nextSiblingPath === 'done') {
            this.done();
            } else {
            return nextSiblingPath;
            }
        }
        // return this.step();
        } else {
        this.currentPage = nextObject;
        this.showCurrentPage();
        return;
    }
    */
}
