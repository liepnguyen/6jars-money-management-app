import * as React from "react";
import {
  Container,
  Header,
  Content,
  Title,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Text,
  Input,
  Item,
  View,
  Form,
} from "native-base";
import { Col, Row, Grid } from 'react-native-easy-grid';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  TouchableOpacity
} from 'react-native';
import { noop } from 'lodash';

import { TransactionFormField } from '../../constants';
import styles from "./styles";

export interface Props {
  navigation: any;
  onFormValueChanged: Function
}
export interface State {
  isDateTimePickerVisible: boolean
}

class AddOrEditTransaction extends React.Component<Props, State> {
  static defaultProps = {
    onFormValueChanged: noop,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      isDateTimePickerVisible: false
    };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  }

  handleDatePicked = (date) => {
    this.hideDateTimePicker();
    this.props.onFormValueChanged(TransactionFormField.Date, date);
  };

  handleCategorySelected = (categoryId) => {
    this.props.onFormValueChanged(TransactionFormField.CategoryId, categoryId);
  }

  handleSelectCategory = () => {
    this.props.navigation.navigate('SelectCategory', { onCategorySelected: this.handleCategorySelected });
  }

  handleAmounEntered = (amount) => {
    this.props.onFormValueChanged(TransactionFormField.Amount, amount);
  }

  handleEnterAmount = () => {
    this.props.navigation.navigate('EnterAmount', { onAmounEntered: this.handleAmounEntered });
  }

  handleSaveTransaction = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { state } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{state.params.mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon active name="md-checkmark" onPress={this.handleSaveTransaction} />
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={{ flex: 1 }}>
            <Form>
              <Item>
                <TouchableOpacity onPress={this.handleEnterAmount} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-cash' style={{ paddingRight: 8, fontSize: 24 }} />
                    <Text style={styles.textValue}>100</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
              <Item>
                <TouchableOpacity onPress={this.handleSelectCategory} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-help-circle' style={{ paddingRight: 8, fontSize: 24 }} />
                    <Text style={styles.textValue}>Select category</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
              <Item>
                <Icon active name='md-list-box' />
                <Input placeholder='Note' />
              </Item>
              <Item>
                <TouchableOpacity onPress={this.showDateTimePicker} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-calendar' style={{ paddingRight: 8, fontSize: 24 }} />
                    <Text style={styles.textValue}>Today</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
            </Form>
          </View>
        </Content>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </Container>
    );
  }
}

export default AddOrEditTransaction;