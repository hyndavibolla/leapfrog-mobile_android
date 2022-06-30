import React from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { styles } from '../styles';
import { ActivityModel, OfferModel } from '../../src/models';
import { ActivityItem } from '../../src/views/shared/ActivityItem/ActivityItem';
import { ActivityDetail } from '../../src/views/PointBalanceDetail/components/ActivityDetail';
import { PointRow } from '../../src/views/PointBalanceDetail/components/PointRow';

import { getOffer_1, getOffer_2, getOffer_4, getActivity_1, getActivity_2, getActivity_4, getActivity_5 } from '../../src/test-utils/entities';
import { RenderGlobalContextWrapped } from './RenderGlobalContextWrapped';

export const ActivityDetailStory = () => (
  <RenderGlobalContextWrapped>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Activities</Text>
      <Text style={styles.subtitle}>Activity Detail</Text>
      <View style={styles.componentContainer}>
        <ActivityDetail
          activity={{
            points: 1500,
            activityType: ActivityModel.Type.AVAILABLE,
            requestorName: 'Kmart',
            brandDetails: {
              brandLogo: 'https://www.vodafone.es/c/particulares/es/acceso-area-privada/mvf/static/img/modules/backgrounds/New_VF_Icon_RGB_RED.png',
              brandName: '',
              brandShortDescription: ''
            },
            offers: [getOffer_1()],
            timestamp: '2020-01-01T12:00:00.000Z',
            txnId: ''
          }}
          offer={{
            id: 'abcd1234cea',
            points: 1000,
            name: 'completed survey',
            pointsType: OfferModel.PointsType.EARN,
            programType: OfferModel.ProgramType.STREAK,
            programSubCategory: OfferModel.ProgramSubCategory.GROCERY,
            pointStartDate: '2020-01-01T12:00:00.000Z',
            pointEndDate: '2021-01-01T12:00:00.000Z',
            dollarRedeemed: 10
          }}
        />
      </View>

      <Text style={styles.subtitle}>Activity Item</Text>
      <View style={[styles.componentContainer, styles.dark]}>
        <ActivityItem activity={getActivity_1()} offer={getOffer_1()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <ActivityItem activity={getActivity_2()} offer={getOffer_1()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <ActivityItem activity={getActivity_2()} offer={getOffer_1()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <ActivityItem activity={getActivity_4()} offer={getOffer_2()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <ActivityItem activity={getActivity_1()} offer={getOffer_2()} />
      </View>

      <Text style={styles.subtitle}>Point Row</Text>
      <View style={[styles.componentContainer, styles.dark]}>
        <PointRow activity={getActivity_1()} offer={getOffer_1()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <PointRow activity={getActivity_2()} offer={getOffer_1()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <PointRow activity={getActivity_2()} offer={getOffer_1()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <PointRow activity={getActivity_4()} offer={getOffer_2()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <PointRow activity={getActivity_1()} offer={getOffer_2()} />
      </View>
      <View style={[styles.componentContainer, styles.dark]}>
        <PointRow activity={getActivity_5()} offer={getOffer_4()} />
      </View>
    </View>
  </RenderGlobalContextWrapped>
);
