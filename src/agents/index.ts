import { sumNumbers } from './sum-numbers'
import { divideNumbers } from './divide-numbers'
import { viewSchema } from './schema-viewer'
import { listTablesWithRelation } from "./list-table-relation";
import { getXkcdJoke }  from './xkcd-jokes';
import { compareNumbers } from './compare-numbers';
// import { timezoneComparisonAgent } from './timezone-comparison';
import { jsCodeExecutor } from './code-execution';
import { getHotelsAgent } from './get-hotels';
import { queryGoFunctions } from '../code/queryGoFunctions';

export const agentTools = [
    sumNumbers,
    divideNumbers,
    viewSchema,
    listTablesWithRelation,
    getXkcdJoke,
    compareNumbers,
    // timezoneComparisonAgent,
    jsCodeExecutor,
    getHotelsAgent,
    queryGoFunctions,
]
