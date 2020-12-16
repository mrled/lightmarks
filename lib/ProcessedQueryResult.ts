/* The result of useQuery or useMutation with the data converted to another type
 */

import {QueryResult} from 'react-query';

class ProcessedQueryResult<QueryResultType, ProcessedType> {
  constructor(
    public result: QueryResult<QueryResultType>,
    public processed: ProcessedType,
  ) {}
}

export default ProcessedQueryResult;
