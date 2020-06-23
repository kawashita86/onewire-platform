import errors from '../../app/reducers/errors';
import {
  ADD_ERROR,
  REMOVE_ERROR
} from '../../app/reducers/errors';

describe('reducers', () => {
  describe('errors', () => {
    it('should handle initial state', () => {
      expect(errors(undefined, {})).toMatchSnapshot();
    });

    it('should handle ADD_ERROR', () => {
      expect(errors(1, { type: ADD_ERROR })).toMatchSnapshot();
    });

    it('should handle REMOVE_ERROR', () => {
      expect(errors(1, { type: REMOVE_ERROR })).toMatchSnapshot();
    });

    it('should handle unknown action type', () => {
      expect(errors(1, { type: 'unknown' })).toMatchSnapshot();
    });
  });
});
