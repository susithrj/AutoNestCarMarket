import { ParamMap } from '@angular/router';
import { CarsBrowseState } from './browse.models';

export function defaultBrowseState(): CarsBrowseState {
  return {
    q: '',
    brand: '',
    model: '',
    price: '',
    year: '',
    fuelType: '',
    transmission: '',
    maxMileage: '',
    location: '',
    sort: 'createdAt,desc',
    page: 0,
    size: 6
  };
}

export function stateFromQueryParamMap(qp: ParamMap, defaults: CarsBrowseState = defaultBrowseState()): CarsBrowseState {
  const page = Number(qp.get('page') ?? String(defaults.page));
  const size = Number(qp.get('size') ?? String(defaults.size));
  return {
    q: qp.get('q') ?? defaults.q,
    brand: qp.get('brand') ?? defaults.brand,
    model: qp.get('model') ?? defaults.model,
    price: qp.get('price') ?? defaults.price,
    year: qp.get('year') ?? defaults.year,
    fuelType: qp.get('fuelType') ?? defaults.fuelType,
    transmission: qp.get('transmission') ?? defaults.transmission,
    maxMileage: qp.get('maxMileage') ?? defaults.maxMileage,
    location: qp.get('location') ?? defaults.location,
    sort: (qp.get('sort') ?? defaults.sort).trim() || defaults.sort,
    page: Number.isFinite(page) && page >= 0 ? Math.floor(page) : defaults.page,
    size: Number.isFinite(size) && size > 0 && size <= 100 ? Math.floor(size) : defaults.size
  };
}

export function queryParamsFromState(state: CarsBrowseState): Record<string, any> {
  return {
    q: state.q?.trim() || null,
    brand: state.brand?.trim() || null,
    model: state.model?.trim() || null,
    price: state.price?.trim() || null,
    year: state.year?.trim() || null,
    fuelType: state.fuelType?.trim() || null,
    transmission: state.transmission?.trim() || null,
    maxMileage: state.maxMileage?.trim() || null,
    location: state.location?.trim() || null,
    sort: state.sort?.trim() || null,
    page: state.page ?? 0,
    size: state.size ?? 6
  };
}

