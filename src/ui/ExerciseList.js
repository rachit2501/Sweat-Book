import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ListView,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import {fuzzySearch} from '../services/fuzzySearch';
import {Topbar} from './TopBar';
import LinearGradient from 'react-native-linear-gradient';
import {SearchBar} from './SearchBar';
import Icon from 'react-native-vector-icons/MaterialIcons';

export class ExerciseList extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      matchingExercises: ds.cloneWithRows([]),
    };
  }

  handlePress(exercise) {
    this.props.addExercise(exercise);
    this.props.closeModal();
  }

  closeModal = () => {
    this.setState({
      matchingExercises: this.state.matchingExercises.cloneWithRows([]),
    });
    this.props.closeModal();
  };

  handleSearch = searchTerm => {
    let newState;
    if (!searchTerm || searchTerm.length < 3) {
      newState = this.state.matchingExercises.cloneWithRows([]);
    } else {
      newState = this.state.matchingExercises.cloneWithRows(
        fuzzySearch(searchTerm, this.props.exercises, 'name'),
      );
    }
    this.setState({matchingExercises: newState});
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#efefef'}}>
        <Topbar style={{padding: 0}}>
          <LinearGradient
            colors={['#87FC70', '#0BD318']}
            start={[0.0, 0.5]}
            end={[1.0, 0.5]}
            locations={[0.0, 1.0]}
            style={styles.topbar}>
            <SearchBar
              placeholder={'search for exercises'}
              autoFocus
              containerStyle={styles.searchBar}
              style={styles.input}
              onTextChange={this.handleSearch.bind(this)}
            />
            <View style={{flex: 0.1}}>
              <Button
                onPress={this.closeModal}
                textStyle={styles.close}
                style={styles.closeButton}
                children={<Icon name="cancel" size={34} />}
              />
            </View>
          </LinearGradient>
        </Topbar>
        <ListView
          dataSource={this.state.matchingExercises}
          renderRow={exercise => (
            <TouchableWithoutFeedback
              onPress={() => this.handlePress.call(this, exercise)}>
              <View style={styles.row}>
                <Text style={styles.rowName}>{exercise.name}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: 'white',
    flex: 0.9,
    borderColor: 'grey',
    borderRadius: 1,
    borderWidth: 1,
    height: 35,
    padding: 5,
    justifyContent: 'center',
  },
  topbar: {
    flexDirection: 'row',
    flex: 1,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    color: 'black',
    fontSize: 20,
  },
  close: {
    fontSize: 34,
  },
  closeButton: {
    borderWidth: 0,
  },
  row: {
    borderWidth: 1,
    borderColor: 'grey',
  },
  rowName: {
    fontSize: 30,
  },
});
