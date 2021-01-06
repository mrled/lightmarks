import {usePbApiQuery} from './usePbApi';

/* Returns a list of the user's notes
 */
const usePbApiNotesList = () => {
  const result = usePbApiQuery<any>('notes/list', {});
  return result;
};

export default usePbApiNotesList;
