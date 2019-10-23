import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { entityLoaderReducer } from '../../../state/utils/entity-loader/entity-loader.reducer';

import { BUDGET_FEATURE, OrganizationState } from '../organization-state';
import { Budget } from '../../../model/budget.model';

export function getReducers(): ActionReducerMap<OrganizationState> {
  return {
    budget: entityLoaderReducer<Budget>(BUDGET_FEATURE),
  };
}

export const reducerToken: InjectionToken<
  ActionReducerMap<OrganizationState>
> = new InjectionToken<ActionReducerMap<OrganizationState>>(
  'OrganizationReducers'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
