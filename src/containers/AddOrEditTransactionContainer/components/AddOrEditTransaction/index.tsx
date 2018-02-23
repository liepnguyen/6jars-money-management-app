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
import { Row } from 'react-native-easy-grid';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  TouchableOpacity
} from 'react-native';
import { noop, capitalize } from 'lodash';
import moment from 'moment';

import I18n, { formatNumber } from '../../../../locales/i18n';
import { TransactionFormField } from '../../constants';
import styles from "./styles";

export interface Props {
  navigation: any;
  onFormValueChanged: Function;
  transaction: any;
  onSave: Function,
}
export interface State {
  isDateTimePickerVisible: boolean
}

class AddOrEditTransaction extends React.PureComponent<Props, State> {
  static defaultProps = {
    onFormValueChanged: noop,
    transaction: {}
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

  handleDatePicked = (date: Date) => {
    this.hideDateTimePicker();
    this.props.onFormValueChanged(TransactionFormField.Date, +date);
  };

  handleCategorySelected = (selectedCategory) => {
    this.props.onFormValueChanged(TransactionFormField.Category, selectedCategory);
  }

  handleSelectCategory = () => {
    this.props.navigation.navigate('SelectCategory', { onCategorySelected: this.handleCategorySelected });
  }

  handleAmountEntered = (amount) => {
    this.props.onFormValueChanged(TransactionFormField.Amount, amount);
  }

  handleEnterAmount = () => {
    const { navigation, transaction: { amount } } = this.props;
    navigation.navigate('EnterAmount', {
      onAmountEntered: this.handleAmountEntered,
      value: amount,
    });
  }

  handleSaveTransaction = () => {
    this.props.onSave(this.props.transaction);
    this.props.navigation.goBack();
  }

  handleNoteInputted = (text) => {
    this.props.onFormValueChanged(TransactionFormField.Note, text);
  }

  handleSelectJar = () => {
    this.props.navigation.navigate('SelectJar', { onJarSelected: this.handleJarSelected });
  }

  handleJarSelected = (selectedJar) => {
    this.props.onFormValueChanged(TransactionFormField.Jar, selectedJar);
  }

  render() {
    const { state } = this.props.navigation;
    const { category, date, jar, amount } = this.props.transaction;
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
                    <Text style={styles.textValue}>{formatNumber(amount)}</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
              <Item>
                <TouchableOpacity onPress={this.handleSelectCategory} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-help-circle' style={{ paddingRight: 8, fontSize: 24 }} />
                    <Text style={styles.textValue}>{ category ? I18n.t(`category.${category.name}`, { defaultValue: category.name }) : I18n.t('select_category') }</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
              <Item>
                <Icon active name='md-list-box' />
                <Input placeholder={I18n.t('note')} onChangeText={this.handleNoteInputted} value={this.props.transaction.note} />
              </Item>
              <Item>
                <TouchableOpacity onPress={this.showDateTimePicker} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-calendar' style={{ paddingRight: 8, fontSize: 24 }} />
                    <Text style={styles.textValue}>{capitalize(moment(date).format('dddd, LL'))}</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
              <Item>
                <TouchableOpacity onPress={this.handleSelectJar} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-help-circle' style={{ paddingRight: 8, fontSize: 24 }} />
                    <Text style={styles.textValue}>{ jar ? I18n.t(`jar.${jar.name}`, { defaultValue: jar.name }) : I18n.t('select_jar') }</Text>
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
          date={new Date(date)}
        />
      </Container>
    );
  }
}

export default AddOrEditTransaction;
