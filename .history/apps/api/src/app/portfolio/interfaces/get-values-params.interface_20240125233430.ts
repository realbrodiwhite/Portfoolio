import { IDataGatheringItem } from '@portfoolio/api/services/interfaces/interfaces';

import { DateQuery } from './date-query.interface';

export interface GetValuesParams {
  dataGatheringItems: IDataGatheringItem[];
  dateQuery: DateQuery;
}
