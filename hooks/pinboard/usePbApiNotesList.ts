import {usePbApiQuery} from './usePbApi';

/* Returns a list of the user's notes
 */
const usePbApiNotesList = () => {
  return usePbApiQuery<any>('notes/list', 'common', {}, 'notes/byid');
};

export default usePbApiNotesList;
