import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { useState } from '@storybook/addons';

import { styles } from '../styles';
import { ClaimPointsModal } from '../../src/views/shared/ClaimPointsModal';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';
import { Modal, ModalSize } from '../../src/views/shared/Modal';
import { getActivity_1, getActivity_2, getActivity_3, getActivity_6, getOffer_2 } from '../../src/test-utils/entities';

export const ClaimPointsStory = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [isOpenModal3, setIsOpenModal3] = useState(false);
  const [isOpenModal4, setIsOpenModal4] = useState(false);
  const [isOpenModal5, setIsOpenModal5] = useState(false);
  const activityList = [
    getActivity_1(),
    getActivity_2(),
    getActivity_1(),
    getActivity_1(),
    getActivity_3(),
    { ...getActivity_1(), offers: [getOffer_2(), { ...getOffer_2(), id: 'unique' }] }
  ].map((a, i) => ({
    ...a,
    requestorName: `${a.requestorName}-${i + 1}`,
    timestamp: new Date(i).toJSON()
  }));
  const activityList2 = [getActivity_1()].map((a, i) => ({ ...a, requestorName: `${a.requestorName}-${i + 1}`, timestamp: new Date(i).toJSON() }));

  const handleOnClose = () => {
    setIsOpenModal(false);
    setIsOpenModal2(false);
    setIsOpenModal3(false);
    setIsOpenModal4(false);
    setIsOpenModal5(false);
  };

  return (
    <RenderGlobalContextWrapped>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Claim Points modal</Text>
        <Text style={styles.subtitle}>With many activities</Text>
        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenModal(true)}>
              click me to open the claim points modal with many here
            </Text>
          </TouchableHighlight>
          <Modal visible={isOpenModal} size={ModalSize.EXTRA_LARGE} onClose={() => setIsOpenModal(false)}>
            <ClaimPointsModal activityList={activityList} onRequestClose={handleOnClose} showAnimation={true} />
          </Modal>
        </View>
        <View style={styles.division} />
        <Text style={styles.subtitle}>With few activities</Text>
        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenModal2(true)}>
              click me to open the claim points modal with few
            </Text>
          </TouchableHighlight>
          <Modal visible={isOpenModal2} size={ModalSize.EXTRA_LARGE} onClose={() => setIsOpenModal2(false)}>
            <ClaimPointsModal activityList={activityList2} onRequestClose={handleOnClose} showAnimation={true} />
          </Modal>
        </View>
        <View style={styles.division} />
        <Text style={styles.subtitle}>Without animation on close</Text>
        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenModal3(true)}>
              click me to open the claim points modal with few
            </Text>
          </TouchableHighlight>
          <Modal visible={isOpenModal3} size={ModalSize.EXTRA_LARGE} onClose={() => setIsOpenModal3(false)}>
            <ClaimPointsModal activityList={activityList2} onRequestClose={handleOnClose} showAnimation={false} />
          </Modal>
        </View>
        <View style={styles.division} />
        <Text style={styles.subtitle}>With the same icon</Text>
        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenModal4(true)}>
              click me to open the claim points modal the same icon
            </Text>
          </TouchableHighlight>
          <Modal visible={isOpenModal4} size={ModalSize.EXTRA_LARGE} onClose={() => setIsOpenModal4(false)}>
            <ClaimPointsModal
              activityList={[{ ...getActivity_1(), offers: [getOffer_2(), { ...getOffer_2(), id: 'unique' }] }]}
              onRequestClose={handleOnClose}
              showAnimation={false}
            />
          </Modal>
        </View>
        <View style={styles.division} />
        <Text style={styles.subtitle}>With one survey activity</Text>
        <View style={styles.componentContainer}>
          <TouchableHighlight>
            <Text style={styles.text} onPress={() => setIsOpenModal5(true)}>
              click me to open the claim points modal with many here
            </Text>
          </TouchableHighlight>
          <Modal visible={isOpenModal5} size={ModalSize.EXTRA_LARGE} onClose={() => setIsOpenModal5(false)}>
            <ClaimPointsModal activityList={[getActivity_6()]} onRequestClose={handleOnClose} showAnimation={true} />
          </Modal>
        </View>
        <View style={styles.division} />
      </View>
    </RenderGlobalContextWrapped>
  );
};
