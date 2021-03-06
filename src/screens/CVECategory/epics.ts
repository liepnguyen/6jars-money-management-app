
import { Observable } from 'rxjs';
import { ActionsObservable } from 'redux-observable';
import { merge } from 'lodash';
import moment from 'moment';
import { saveCategoryAsync, deleteCategoryAsync } from './actions';
import { Category } from '../../realm/models';
import storage from '../../storage';

const saveCategoryEpic = (action$: ActionsObservable<any>) => {
  return action$.ofType(saveCategoryAsync.START)
    .mergeMap((action) => {
      const realm = storage.getRealmInstance();
      const category = action.payload;
      let persistedCategory = realm.objectForPrimaryKey(Category, category.id);
			realm.write(() => {
        if (persistedCategory) {
          merge(persistedCategory, category);
        } else {
          persistedCategory = realm.create(Category, {
            ...category,
            createdTimestamp: moment().valueOf(),
          });
        }
      });
      return Observable.of(saveCategoryAsync.succeeded());
    })
    .takeUntil(action$.ofType(saveCategoryAsync.CANCELLED))
    .catch((err) => {
      return Observable.of(saveCategoryAsync.failed(err));
    });
}

const deleteCategoryEpic = (action$: ActionsObservable<any>) => {
  return action$.ofType(deleteCategoryAsync.START)
    .mergeMap((action) => {
      const realm = storage.getRealmInstance();
      const id = action.payload;
			realm.write(() => {
        let persistedCategory = realm.objectForPrimaryKey(Category, id);
        persistedCategory && realm.delete(persistedCategory);
      });
      return Observable.of(deleteCategoryAsync.succeeded());
    })
    .takeUntil(action$.ofType(deleteCategoryAsync.CANCELLED))
    .catch((err) => {
      return Observable.of(deleteCategoryAsync.failed(err));
    });
}

export default [
  saveCategoryEpic,
  deleteCategoryEpic,
]