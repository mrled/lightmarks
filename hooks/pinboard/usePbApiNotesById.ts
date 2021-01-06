/* Returns an individual user note.
 * The hash property is a 20 character long sha1 hash of the note text.
 */
import {usePbApiQuery} from './usePbApi';

const usePbApiNotesById = (id: string) => {
  const result = usePbApiQuery<any>(`notes/${id}`, {}, 'notes/byid');
  return result;
};

export default usePbApiNotesById;
