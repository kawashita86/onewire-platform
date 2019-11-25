
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';
import * as ThermocronActions from '../actions/thermocron';

function mapStateToProps(state) {
  return {
    counter: state.counter,
    thermocron: state.thermocron
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...CounterActions,
      ...ThermocronActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
