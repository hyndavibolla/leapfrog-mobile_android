import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { number, boolean } from '@storybook/addon-knobs';
import { useState } from '@storybook/addons';

import { styles } from '../styles';
import { Modal, ModalType, ModalSize } from '../../src/views/shared/Modal';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

const getTextLines = (nroLines: number = 1) => {
  const label = Math.random().toString(36).substring(7);
  if (nroLines === 0) return null;
  return [<Text key={label}>{label}</Text>, getTextLines(nroLines - 1)];
};

export const ModalStory = () => {
  const [isOpenCenterDynamicModal, setIsOpenCenterDynamicModal] = useState(false);
  const [isOpenCenterSmallModal, setIsOpenCenterSmallModal] = useState(false);
  const [isOpenCenterMediumModal, setIsOpenCenterMediumModal] = useState(false);
  const [isOpenCenterExtraLargeModal, setIsOpenCenterExtraLargeModal] = useState(false);
  const [isOpenBottomDynamicModal, setIsOpenBottomDynamicModal] = useState(false);
  const [isOpenBottomSmallModal, setIsOpenBottomSmallModal] = useState(false);
  const [isOpenBottomMediumModal, setIsOpenBottomMediumModal] = useState(false);
  const [isOpenBottomExtraLargeModal, setIsOpenBottomExtraLargeModal] = useState(false);

  return (
    <RenderGlobalContextWrapped>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Modal</Text>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenCenterDynamicModal(true)}>
              click me to open dynamic center modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenCenterDynamicModal}
            size={ModalSize.DYNAMIC}
            type={ModalType.CENTER}
            onClose={() => setIsOpenCenterDynamicModal(false)}
            showCloseButton={boolean('showCloseButton', true, 'centerD')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content wil</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenCenterDynamicModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'centerD'))}
            </View>
          </Modal>
        </View>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenCenterSmallModal(true)}>
              click me to open small center modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenCenterSmallModal}
            size={ModalSize.SMALL}
            type={ModalType.CENTER}
            onClose={() => setIsOpenCenterSmallModal(false)}
            showCloseButton={boolean('showCloseButton', true, 'centerS')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenCenterSmallModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'centerS'))}
            </View>
          </Modal>
        </View>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenCenterMediumModal(true)}>
              click me to open medium center modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenCenterMediumModal}
            size={ModalSize.MEDIUM}
            type={ModalType.CENTER}
            onClose={() => setIsOpenCenterMediumModal(false)}
            showCloseButton={boolean('showCloseButton', true, 'centerM')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenCenterMediumModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'centerM'))}
            </View>
          </Modal>
        </View>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenCenterExtraLargeModal(true)}>
              click me to open extra large center modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenCenterExtraLargeModal}
            onClose={() => setIsOpenCenterExtraLargeModal(false)}
            size={ModalSize.EXTRA_LARGE}
            type={ModalType.CENTER}
            showCloseButton={boolean('showCloseButton', true, 'centerXL')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenCenterExtraLargeModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'centerXL'))}
            </View>
          </Modal>
        </View>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenBottomDynamicModal(true)}>
              click me to open dynamic bottom modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenBottomDynamicModal}
            onClose={() => setIsOpenBottomDynamicModal(false)}
            showCloseButton={boolean('showCloseButton', false, 'bottomD')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenBottomDynamicModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'bottomD'))}
            </View>
          </Modal>
        </View>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenBottomSmallModal(true)}>
              click me to open small bottom modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenBottomSmallModal}
            onClose={() => setIsOpenBottomSmallModal(false)}
            size={ModalSize.SMALL}
            showCloseButton={boolean('showCloseButton', false, 'bottomS')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenBottomSmallModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'bottomS'))}
            </View>
          </Modal>
        </View>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenBottomMediumModal(true)}>
              click me to open medium bottom modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenBottomMediumModal}
            onClose={() => setIsOpenBottomMediumModal(false)}
            size={ModalSize.MEDIUM}
            showCloseButton={boolean('showCloseButton', false, 'bottomM')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenBottomMediumModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'bottomM'))}
            </View>
          </Modal>
        </View>

        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenBottomExtraLargeModal(true)}>
              click me to open extra large bottom modal
            </Text>
          </TouchableHighlight>
          <Modal
            visible={isOpenBottomExtraLargeModal}
            onClose={() => setIsOpenBottomExtraLargeModal(false)}
            size={ModalSize.EXTRA_LARGE}
            showCloseButton={boolean('showCloseButton', false, 'bottomXL')}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.subtitle}>I am the modal's content</Text>
              <TouchableHighlight>
                <Text style={styles.text} onPress={() => setIsOpenBottomExtraLargeModal(false)}>
                  click me to close
                </Text>
              </TouchableHighlight>
              {getTextLines(number('dummyContentLines', 5, {}, 'bottomXL'))}
            </View>
          </Modal>
        </View>
      </View>
    </RenderGlobalContextWrapped>
  );
};
