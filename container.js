import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';

// const HOST = 'http://192.168.1.8:3000';
const HOST = 'https://qc-live-conference-dev.quancheng-ec.com';

export default class WebContainer extends Component {
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', this.onShow);
  }

  onShow = async () => {
    if (this.sleep) {
      const value = await AsyncStorage.getItem('__ON_POP_OR_BACK_PARAMS__');
      if (value) {
        const onPopBackParams = JSON.parse(value);
        if (Date.now() - onPopBackParams.ts < 1000) {
          console.log('on-pop-or-on-back');
          if (onPopBackParams.type === 'pop') {
            this.onPop(onPopBackParams.data);
          } else if (onPopBackParams.type === 'back') {
            this.onBack(onPopBackParams.data);
          }
        }
      }
    }
  };

  componentWillUnmount() {
    this._unsubscribe();
  }
  onPop = (params = '') => {
    this.webref.injectJavaScript(`
      window.__ON_POP_HOOK__('${JSON.stringify(params)}')
    `);
  };
  onBack = (params = '') => {
    this.webref.injectJavaScript(`
      window.__ON_BACK_HOOK__('${JSON.stringify(params)}')
    `);
  };
  onMessage = event => {
    const payload = JSON.parse(event.nativeEvent.data);
    if (payload.type === 'navigate') {
      if (payload.action === 'push' || payload.action === 'replace') {
        const {
          params,
          page,
          headerConfig: {titleColor, bgColor, title},
        } = payload.data;
        this.sleep = true;
        this.props.navigation[payload.action]('WebContainer', {
          url: `${HOST}/${page}.html?_c=rn&_p=${JSON.stringify({
            params,
          })}`,
          title,
          headerStyle: {
            backgroundColor: bgColor || '#fff',
          },
          headerTintColor: titleColor || (bgColor ? '#fff' : '#333'),
        });
      } else if (payload.action === 'pop') {
        const {params} = payload.data;
        AsyncStorage.setItem(
          '__ON_POP_OR_BACK_PARAMS__',
          JSON.stringify({
            type: 'pop',
            data: params,
            ts: Date.now(),
          }),
        );
        this.props.navigation.pop();
      } else if (payload.action === 'back') {
        const {params, steps} = payload.data;
        console.log(params, steps);
        AsyncStorage.setItem(
          '__ON_POP_OR_BACK_PARAMS__',
          JSON.stringify({
            type: 'back',
            data: params,
            ts: Date.now(),
          }),
        );
        this.props.navigation.pop(parseInt(steps, 10));
      } else if (
        payload.action === 'push-to-native' ||
        payload.action === 'replace-to-native'
      ) {
        const {params, page} = payload.data;
        this.props.navigation[payload.action.replace('-to-native', '')](
          page,
          params,
        );
      }
    }
  };

  render() {
    return (
      <WebView
        ref={r => (this.webref = r)}
        originWhitelist={['*']}
        onMessage={this.onMessage}
        source={{uri: this.props.route.params.url}}
      />
    );
  }
}
