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
  Thumbnail,
} from "native-base";
import { Row } from 'react-native-easy-grid';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  TouchableOpacity,
  Alert,
} from 'react-native';
import { noop, capitalize, isEmpty } from 'lodash';
import moment from 'moment';

import I18n, { formatNumber, translate } from '../../../../locales/i18n';
import styles from "./styles";
import { loadIcon } from '../../../../resources';
import { CVE_SCREEN_MODES } from '../../../../constants';
import { showWarningMessage } from '../../../../utils/toast';

export interface Props {
  onFormValueChanged: (keyValue: any) => void;
  transaction: any;
  onSave: (transaction: any) => void;
  onDelete: (transactionId: string) => void;
  onGoBackButtonPressed: () => void;
  onEnterAmountFieldPressed: (amount: number) => void;
  onSelectCategoryFieldPressed: () => void;
  onJarFieldPressed: () => void;
  mode: string;
}
export interface State {
  isDateTimePickerVisible: boolean
}

class CVETransaction extends React.PureComponent<Props, State> {
  static defaultProps = {
    onFormValueChanged: noop,
    transaction: {},
    onDelete: noop,
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
    this.props.onFormValueChanged({ date: +date });
  };

  validateTransaction = (transaction) => {
    if (transaction.amount <= 0) {
      showWarningMessage('Amount must be greater than zero');
      return false;
    }
    if (!transaction.category) {
      showWarningMessage('You must select a category');
      return false;
    }
    if (transaction.category.type === 'expense' && !transaction.jar) {
      showWarningMessage('You must select an account to debit');
      return false;
    }
    return true;
  }

  handleSaveTransaction = () => {
    const { transaction, onSave } = this.props;
    if (this.validateTransaction(transaction)) {
      onSave(transaction);
    }
  }

  handleDeleteTransaction = () => {
    const { transaction: { id }, onGoBackButtonPressed, onDelete } = this.props;
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'NO', onPress: () => { }, style: 'cancel' },
      { text: 'YES', onPress: () => { onDelete(id); onGoBackButtonPressed(); } },
    ])
  }

  handleNoteInputted = (note) => {
    const { onFormValueChanged } = this.props;
    onFormValueChanged({ note });
  }

  handleSelectJar = () => {
    const { onJarFieldPressed } = this.props;
    onJarFieldPressed();
  }

  handleSelectCategory = () => {
    const { onSelectCategoryFieldPressed } = this.props;
    onSelectCategoryFieldPressed();
  }

  handleEnterAmount = () => {
    const { transaction: { amount }, onEnterAmountFieldPressed } = this.props;
    onEnterAmountFieldPressed(amount);
  }

  formatTransactionDate = (date) => {
    if (moment(date).isSame(moment(), 'day')) {
      return translate('today');
    }
    return moment(date).format('dddd, L');
  }

  render() {
    const { onGoBackButtonPressed, transaction, mode } = this.props;
    const { category = {}, date, jar = {}, amount } = transaction;
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={onGoBackButtonPressed}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{mode === CVE_SCREEN_MODES.NEW ? 'Add Transaction' : 'Edit Transaction'}</Title>
          </Body>
          <Right>
            {
              mode === CVE_SCREEN_MODES.VIEW ?
                <Button transparent onPress={this.handleDeleteTransaction}>
                  <Icon active name="md-trash" />
                </Button>
                : null
            }
            <Button transparent onPress={this.handleSaveTransaction}>
              <Icon active name="md-checkmark" />
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={{ flex: 1 }}>
            <Form>
              <Item>
                <TouchableOpacity onPress={this.handleEnterAmount} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-cash' style={styles.icon} />
                    <Text style={styles.textValue}>{formatNumber(amount)}</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
              <Item>
                <TouchableOpacity onPress={this.handleSelectCategory} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Thumbnail small source={loadIcon(category.icon, { default: 'question_mark.png' })} style={{ marginRight: 5 }} />
                    {
                      isEmpty(category)
                        ? <Text style={[styles.textValue, styles.greyText]}>{I18n.t('select_category')}</Text>
                        : <Text style={[styles.textValue]}>{I18n.t(`category.${category.name}`, { defaultValue: category.name })}</Text>
                    }
                  </Row>
                </TouchableOpacity>
              </Item>
              <Item>
                <Icon active name='md-list-box' style={styles.icon} />
                <Input style={{ height: 70 }} placeholder={I18n.t('note')} onChangeText={this.handleNoteInputted} value={this.props.transaction.note} />
              </Item>
              <Item>
                <TouchableOpacity onPress={this.showDateTimePicker} style={{ flex: 1 }}>
                  <Row style={{ alignItems: 'center' }}>
                    <Icon active name='md-calendar' style={styles.icon} />
                    <Text style={styles.textValue}>{capitalize(this.formatTransactionDate(date))}</Text>
                  </Row>
                </TouchableOpacity>
              </Item>
              {
                category.type === 'expense'
                  ? (
                    <Item>
                      <TouchableOpacity onPress={this.handleSelectJar} style={{ flex: 1 }}>
                        <Row style={{ alignItems: 'center' }}>
                          <Thumbnail small source={loadIcon(jar.icon, { default: 'question_mark.png' })} />
                          {
                            isEmpty(jar)
                              ? <Text style={[styles.textValue, styles.greyText]}>{I18n.t('select_account')}</Text>
                              : <Text style={styles.textValue}>{I18n.t(`jar.${jar.name}`, { defaultValue: jar.name })}</Text>
                          }
                        </Row>
                      </TouchableOpacity>
                    </Item>
                  )
                  : null
              }
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

export default CVETransaction;
