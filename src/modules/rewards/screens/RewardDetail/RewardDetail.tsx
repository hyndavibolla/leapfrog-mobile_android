import React, { memo, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { View, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';

import { Icon } from '_commons/components/atoms/Icon';
import { Accordion } from '_components/Accordion';
import { Button } from '_components/Button';
import { Pill } from '_components/Pill';
import { Text } from '_components/Text';
import { Title, TitleType } from '_components/Title';
import { ToastType } from '_components/Toast';
import { ConnectionBanner } from '_components/ConnectionBanner';
import { Modal, ModalSize } from '_components/Modal';
import { Card } from '_components/Card';
import { Divider } from '_components/Divider';

import { ENV, ROUTES, FONT_FAMILY, FONT_SIZE, ICON, COLOR, PageType, TealiumEventType, UxObject, ForterActionType, PageNames } from '_constants';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker, useToast } from '_state_mgmt/core/hooks';
import { useRewardConfigBrandSearch } from '_state_mgmt/reward/hooks';
import { useSendValidationEmail, useGetProfile } from '_state_mgmt/user/hooks';

import { useTestingHelper } from '_utils/useTestingHelper';
import { formatNumber } from '_utils/formatNumber';
import { noop } from '_utils/noop';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { getGiftCardOptionList } from '_utils/getGiftCardOptionList';
import { getDecimals } from '_utils/getNumberListFromRange';
import { getPageNameWithParams } from '_utils/trackingUtils';
import { BackButton } from '_commons/components/molecules/Backbutton/BackButton';

import { RewardModel } from '_models';
import { getFallbackBrand, IBrand } from '_models/reward';
import { EmailStatus } from '_models/user';

import GiftCardWaterMark from '_assets/shared/sywGiftCardWaterMark.svg';
import EmailVerification from '_assets/shared/emailVerification.svg';
import EmailVerificationFailed from '_assets/shared/emailVerificationFailed.svg';

import { RewardDetailSkeleton } from './components/RewardDetailSkeleton';
import { RewardDetailEmptyState } from './components/RewardDetailEmptyState';
import { AccountCriticalError } from './components/AccountCriticalError/AccountCriticalError';
import { CardBrand } from './components/CardBrand/CardBrand';
import { NumberListInput } from './components/NumberListInput';
import { styles } from './styles';

let positionNumberListInput = 300;

export enum GiftCardButtonType {
  CLAIM_WITH_POINTS,
  CLAIM_WITH_CASH,
  CLAIM_WITH_POINTS_AND_CASH
}

export interface Props {
  route: { params: { brandId?: string; brandName?: string } };
  navigation: StackNavigationProp<any>;
}

export const RewardDetail = ({ route, navigation }: Props) => {
  const { getTestIdProps } = useTestingHelper('gift-card-detail');
  const scrollViewRef = useRef<ScrollView>();
  const { showToast } = useToast();
  const { trackUserEvent, trackView } = useEventTracker();
  const [fetchProfile, isFetchingProfile] = useGetProfile();
  const { state, deps } = useContext(GlobalContext);
  const [onCheckLink, , , isSywAppInstalled] = useAsyncCallback(() => deps.nativeHelperService.linking.checkURLScheme('syw', ''), []);
  const { emailValidationStatus, email } = state.user.currentUser;
  const [isEmailModalVisible, setIsEmailModalVisible] = useState<boolean>(false);
  const [isVerifiedModalVisible, setIsVerifiedModalVisible] = useState<boolean>(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);
  const [forcedSentEmail, setForcedSentEmail] = useState<boolean>(false);
  const { slideObjectMapByType } = state.reward;
  const { availablePoints } = state.game.current.balance;
  const [sendValidationEmail, , hasSentEmailError, hasSentEmail] = useSendValidationEmail();
  const onRestart = deps.nativeHelperService.restart;
  const isSuspendedModalVisible = emailValidationStatus === EmailStatus.SUSPENDED;

  const brand = useMemo<IBrand>(() => {
    return (
      (slideObjectMapByType[RewardModel.SlideObjectType.BRAND][route?.params?.brandId] as RewardModel.IBrand) ||
      Object.values(slideObjectMapByType[RewardModel.SlideObjectType.BRAND] as Record<string, RewardModel.IBrand>).find(
        b => b.brandName.toLowerCase().trim() === route?.params?.brandName?.toLowerCase().trim()
      )
    );
  }, [slideObjectMapByType, route]);
  const safeBrand = useMemo(() => brand || getFallbackBrand(route?.params?.brandId), [brand, route?.params?.brandId]);

  const [onRewardConfigBrandSearch, isLoading = !!route?.params?.brandName && !brand] = useRewardConfigBrandSearch();

  useEffect(() => {
    if (brand) {
      trackView(ROUTES.GIFT_CARD_DETAIL, {
        brand_name: brand?.brandName,
        brand_id: brand.id,
        brand_category: brand.categories[0]?.name,
        page_name: getPageNameWithParams(PageNames.REWARDS.REWARDS_BRAND, [brand?.brandName])
      });
    }
  }, [trackView, brand]);
  const { duration } = state.reward.config.limits;
  const { variableLoadSupported } = safeBrand.cardValueConfig;

  const minAmount = Math.max(state.reward.config.limits.minAmount, safeBrand.cardValueConfig.minValue / 100) * 100;
  const maxAmount = Math.min(state.reward.config.limits.maxAmount, safeBrand.cardValueConfig.maxValue);

  const isRedeemDisabled = emailValidationStatus !== EmailStatus.APPROVED;

  const { minValueToDollar, maxValueToDollar } = useMemo(() => {
    return { minValueToDollar: minAmount / 100, maxValueToDollar: maxAmount };
  }, [minAmount, maxAmount]);

  const [cardValue, setCardValue] = useState<string>(getDecimals(minValueToDollar).toString());

  useEffect(() => {
    setCardValue(getDecimals(minAmount / 100).toString());
  }, [minAmount]);

  const optionList = useMemo(() => {
    const valuesForOptionList = {
      ...safeBrand,
      cardValueConfig: {
        ...safeBrand.cardValueConfig,
        maxValue: maxAmount * 100,
        minValue: minAmount
      }
    };
    return getGiftCardOptionList(valuesForOptionList);
  }, [maxAmount, minAmount, safeBrand]);
  const onEmailForSupport = useCallback(
    () => deps.nativeHelperService.linking.openURL(`mailto:${ENV.SYW_SUPPORT_EMAIL}?subject=SYW MAX - Customer Support`),
    [deps.nativeHelperService.linking]
  );

  const redemptionMethodList = safeBrand.redemptionConfigs.methods.filter(({ info }) => info);
  const isCardValueValid = (() => {
    return Number(cardValue) >= minValueToDollar && Number(cardValue) <= maxValueToDollar;
  })();

  const checkoutValidationButton = useMemo(() => {
    return !isCardValueValid || emailValidationStatus !== EmailStatus.APPROVED || isRedeemDisabled;
  }, [isRedeemDisabled, emailValidationStatus, isCardValueValid]);

  const errorLabel = (() => {
    return `Enter a number between $${getDecimals(minValueToDollar)} to $${getDecimals(maxValueToDollar)}`;
  })();

  const navigateToCheckout = () => {
    const cardValueInCents = Number(cardValue) * 100;
    const points = cardValueInCents * 1000;
    trackUserEvent(
      TealiumEventType.CHECKOUT_GIFT_CARD,
      {
        page_name: getPageNameWithParams(PageNames.REWARDS.REWARDS_BRAND, [safeBrand.brandName]),
        page_type: PageType.BOF,
        address: `${ENV.SCHEME}${ROUTES.GIFT_CARD_CHECKOUT}`,
        event_type: safeBrand.brandName,
        event_detail: String(cardValueInCents),
        uxObject: UxObject.BUTTON,
        brand_name: safeBrand.brandName,
        brand_id: safeBrand.id,
        brand_category: safeBrand.categories[0]?.name
      },
      ForterActionType.ADD_TO_CART
    );
    navigation.navigate(ROUTES.GIFT_CARD_CHECKOUT, {
      brandId: safeBrand.id,
      cardValue: cardValueInCents,
      brandName: safeBrand.brandName,
      brandLogo: safeBrand.iconUrl,
      points: points
    });
  };

  const onEditProfileOnSYW = useCallback(() => {
    deps.nativeHelperService.linking.openURL(isSywAppInstalled ? ENV.SYW_APP_PROFILE : ENV.SYW_URL);
  }, [deps.nativeHelperService.linking, isSywAppInstalled]);

  const onSendValidationEmail = useCallback(
    (forceSend = false) => {
      if (!(forceSend || (!hasSentEmail && isEmailModalVisible))) {
        return;
      }

      sendValidationEmail();
      if (forceSend) {
        setIsEmailModalVisible(false);
        setForcedSentEmail(true);
        showToast({ type: ToastType.SUCCESS, title: 'Done! Please re-check your email.' });
      }

      if (hasSentEmailError) {
        setIsEmailModalVisible(false);
        setIsErrorModalVisible(true);
      }
    },
    [hasSentEmail, isEmailModalVisible, sendValidationEmail, hasSentEmailError, showToast]
  );

  useEffect(() => {
    onCheckLink();
  }, [onCheckLink]);

  useEffect(() => {
    if (emailValidationStatus !== EmailStatus.APPROVED) {
      fetchProfile();
    }
  }, [fetchProfile, isEmailModalVisible, emailValidationStatus]);

  useEffect(() => {
    if (isFetchingProfile === false && emailValidationStatus !== EmailStatus.APPROVED) {
      onSendValidationEmail();
    }
  }, [onSendValidationEmail, hasSentEmail, isEmailModalVisible, emailValidationStatus, isFetchingProfile]);

  useEffect(() => {
    if (hasSentEmail && emailValidationStatus === EmailStatus.APPROVED) {
      setIsEmailModalVisible(false);
      setIsVerifiedModalVisible(true);
    }
  }, [hasSentEmail, emailValidationStatus]);

  useEffect(() => {
    if (route?.params?.brandName || !slideObjectMapByType[RewardModel.SlideObjectType.BRAND][route?.params?.brandId]) {
      onRewardConfigBrandSearch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFocusEffect(
    useCallback(() => {
      deps.eventTrackerService.rZero.trackEvent('user_visited_reward_detail');
    }, [deps.eventTrackerService])
  );

  /* istanbul ignore next */
  const onMoveScrollToNumberInput = useCallback(() => scrollViewRef?.current.scrollTo({ y: positionNumberListInput + 32, animated: true }), []);
  /* istanbul ignore next */
  const onLayoutNumberInput = event => {
    positionNumberListInput = event?.nativeEvent?.layout?.y;
  };

  if (isLoading) return <RewardDetailSkeleton />;

  if (!brand) return <RewardDetailEmptyState onPress={() => navigation.navigate(ROUTES.MAIN_TAB.REWARDS)} />;

  return (
    <>
      <ConnectionBanner />
      <View style={styles.headerContainer}>
        <BackButton />
        <Pill style={styles.pill}>{formatNumber(availablePoints)}</Pill>
      </View>
      <ScrollView ref={scrollViewRef} style={styles.container} showsVerticalScrollIndicator={false}>
        {emailValidationStatus === EmailStatus.APPROVED ? null : (
          <TouchableHighlight
            onPress={() => setIsEmailModalVisible(true)}
            underlayColor="transparent"
            activeOpacity={1}
            {...getTestIdProps('email-validation-warning-btn')}
          >
            <View style={styles.emailWarningContainer} {...getTestIdProps('email-validation-warning')}>
              <Text style={styles.emailWarningText}>Almost! To proceed with checkout, please verify your email first.</Text>
              <Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.WHITE} />
            </View>
          </TouchableHighlight>
        )}

        <CardBrand brandLogo={brand.iconUrl} brandName={brand.brandName} cardValue={cardValue} faceplateUrl={brand?.faceplateUrl} />

        <View style={styles.numberInputContainer} {...getTestIdProps('price')} onLayout={onLayoutNumberInput}>
          <NumberListInput
            value={cardValue}
            valid={isCardValueValid}
            optionList={optionList}
            onChange={setCardValue}
            freeSelection={variableLoadSupported}
            disabled={isRedeemDisabled}
            label={`Enter a number between $${getDecimals(minValueToDollar)} to $${getDecimals(maxValueToDollar)}`}
            errorLabel={errorLabel}
            onMoveScroll={onMoveScrollToNumberInput}
          />
        </View>
        <View style={styles.redeemContainer}>
          <Button
            onPress={isCardValueValid ? navigateToCheckout : noop}
            style={styles.touchable}
            innerContainerStyle={checkoutValidationButton && styles.disabledBtn}
            innerContainerDisabledStyle={styles.disabledBtn}
            disabled={checkoutValidationButton}
            {...getTestIdProps('redeem-btn')}
          >
            <View style={styles.buttonContainer}>
              <Text font={FONT_FAMILY.SEMIBOLD} style={[styles.baseButtonText]}>
                Go to Checkout
              </Text>
            </View>
          </Button>
        </View>
        <View style={styles.redeemCardContainer}>
          <View style={styles.redeemCard}>
            <View style={styles.titleContainer}>
              <Title type={TitleType.SECTION}>Redeem your way — with points, cash or both 🎉</Title>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>Now, you can redeem your Gift Cards using Shop Your Way® points, cash, or a combination of points and cash!</Text>
            </View>
          </View>
        </View>
        {!brand.description ? null : (
          <View style={styles.giftCardInformationContainer} {...getTestIdProps('description')}>
            <Accordion title="Brand description">{brand.description}</Accordion>
          </View>
        )}

        <View style={styles.giftCardInformationContainer} {...getTestIdProps('limits')}>
          <Accordion
            title={` ${duration?.[0].toUpperCase()}${duration.substring(1)}  limit`}
          >{`You won't be able to redeem more than $${maxAmount}. This restriction considers every gift card bought ${duration}.`}</Accordion>
        </View>

        {!redemptionMethodList.length ? null : (
          <View style={styles.giftCardAccordionContainer}>
            <View style={styles.titleContainer}>
              <Title type={TitleType.SECTION}>Redemption Method:</Title>
            </View>
            {redemptionMethodList.map(method => (
              <View key={method.kind} style={styles.textContainer}>
                <Text style={styles.text}>{method.info}</Text>
              </View>
            ))}
          </View>
        )}
        {!brand.redemptionConfigs.disclaimer ? null : (
          <View style={styles.giftCardInformationContainer} {...getTestIdProps('disclaimer')}>
            <Accordion title="Disclaimer">{brand.redemptionConfigs.disclaimer}</Accordion>
          </View>
        )}
        {!brand.legalTerms ? null : (
          <View style={styles.giftCardInformationContainer} {...getTestIdProps('legal-terms')}>
            <Accordion title="Details & Terms" textStyle={styles.legals}>
              {brand.legalTerms}
            </Accordion>
          </View>
        )}
        <View style={styles.footer}>
          <GiftCardWaterMark />
        </View>
      </ScrollView>
      <Modal size={ModalSize.FULL_SCREEN} visible={isEmailModalVisible} showCloseButton={true} onClose={() => setIsEmailModalVisible(false)}>
        <ScrollView style={styles.emailModalOuterContainer} {...getTestIdProps('email-validation-modal-container')}>
          <View style={styles.emailModalContainer}>
            <EmailVerification />
            <Text style={styles.emailModalText}>We've sent a verification e-mail to:</Text>
            <Text style={[styles.emailModalTitle, styles.emailModalEmail]}>{email}</Text>
            <Text style={styles.emailModalText}>
              You cannot redeem your points until you verify your account by clicking the link found in your e-mail inbox.
            </Text>
            <View style={styles.emailModalFaqContainer}>
              <Text style={styles.emailModalTitle}>Frequent Questions:</Text>
              <View style={styles.emailModalFaqs}>
                <Card style={styles.emailModalCardContainer}>
                  <Accordion title="Why do you need my e-mail?" startsOpen={false} titleStyle={styles.emailModalFaqTitle}>
                    <Text style={styles.emailModalFaqText}>
                      We validate our clients information in order to keep a safe community for everyone. That's why we ask to validate your account before
                      letting you redeem points.
                    </Text>
                  </Accordion>
                </Card>
                <Card style={styles.emailModalCardContainer}>
                  <Accordion title="I verified my email, but it's not working" startsOpen={false} titleStyle={styles.emailModalFaqTitle}>
                    <TouchableOpacity onPress={onEmailForSupport} {...getTestIdProps('open-support-email-btn')}>
                      <Text style={styles.emailModalFaqText}>
                        If you already did the validation process, please tap
                        <Text style={styles.emailModalLink}> here </Text>
                        to solve this issue. It'll be immediate.
                      </Text>
                    </TouchableOpacity>
                  </Accordion>
                </Card>
                <Card style={styles.emailModalCardContainer}>
                  <Accordion title="That's not my e-mail" startsOpen={false} titleStyle={styles.emailModalFaqTitle}>
                    <>
                      <TouchableOpacity onPress={onEditProfileOnSYW} {...getTestIdProps('open-edit-profile-btn')}>
                        <Text style={styles.emailModalFaqText}>
                          To complete your validation, please proceed to <Text style={styles.emailModalLink}>shopyourway.com/profile</Text> to update your
                          e-mail and try this process again.
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={onEmailForSupport} {...getTestIdProps('open-support-email-btn-2')}>
                        <Text style={[styles.emailModalFaqText, styles.emailModalFaqTextSecond]}>
                          If you need further assistant, please contact us on <Text style={styles.emailModalLink}>sywsolution@syw.com</Text>
                        </Text>
                      </TouchableOpacity>
                    </>
                  </Accordion>
                </Card>
                <Card style={styles.emailModalCardContainer}>
                  <Accordion title="I'm not receiving the e-mail" startsOpen={false} titleStyle={styles.emailModalFaqTitle}>
                    <>
                      <TouchableOpacity onPress={() => onSendValidationEmail(true)} disabled={forcedSentEmail} {...getTestIdProps('force-send-email-btn')}>
                        <Text style={styles.emailModalFaqText}>
                          Please check on your Junk / Spam folders to make sure you didn't get the e-mail. If it isn't there, please tap here to
                          <Text style={[styles.emailModalLink, forcedSentEmail && { color: COLOR.DARK_GRAY }]}> resend the verification email </Text> to your
                          account.
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.emailModalFaqText, styles.emailModalFaqTextSecond]}>
                        Also, please check if the address that's on the top of the screen is correct.
                      </Text>
                    </>
                  </Accordion>
                </Card>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
      <Modal size={ModalSize.FULL_SCREEN} visible={isVerifiedModalVisible} showCloseButton={true} onClose={() => setIsVerifiedModalVisible(false)}>
        <View style={styles.verifiedModalOuterContainer}>
          <View style={styles.verifiedModalContainer} {...getTestIdProps('verified-mail-modal-container')}>
            <Icon name={ICON.TICK_CIRCLE} size={FONT_SIZE.XL_2X} color={COLOR.GREEN} />
            <Text style={styles.verifiedModalTitle}>Your account is now verified!</Text>
            <Text style={styles.verifiedModalText}>You can redeem points and enjoy all other Shop Your Way® MAX benefits.</Text>
            <View style={styles.verifiedModalBtnContainer}>
              <Button onPress={() => setIsVerifiedModalVisible(false)} textStyle={styles.verifiedModalBtnText} {...getTestIdProps('verified-email-btn')}>
                Awesome!
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <Modal size={ModalSize.FULL_SCREEN} visible={isErrorModalVisible} showCloseButton={true} onClose={() => setIsErrorModalVisible(false)}>
        <View style={styles.verifiedModalOuterContainer}>
          <View style={styles.verifiedModalContainer} {...getTestIdProps('email-validation-fail-modal-container')}>
            <View style={styles.verifiedModalMessageContainer}>
              <EmailVerificationFailed />
              <Text style={styles.verifiedModalTitle}>For some reason, we couldn't validate your account 😥</Text>
              <Text style={styles.verifiedModalText}>We're sorry about this! Please, restart the app or try again later.</Text>
              <View style={styles.verifiedModalBtnContainer}>
                <Button
                  onPress={onRestart}
                  innerContainerStyle={styles.verifiedModalBtnInnerContainer}
                  textStyle={styles.verifiedModalBtnText}
                  {...getTestIdProps('email-validation-fail-btn')}
                >
                  Refresh the app
                </Button>
              </View>
            </View>
            <View>
              <Divider lineStyle={styles.dividerStyle} />
              <Text style={styles.verifiedModalText}>If the problem persist, please contact our support center.</Text>
              <TouchableOpacity onPress={onEmailForSupport}>
                <Text style={[styles.verifiedModalText, styles.emailModalLink]}>sywsolutions@syw.com</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal size={ModalSize.FULL_SCREEN} visible={isSuspendedModalVisible} showCloseButton onClose={navigation.goBack}>
        <AccountCriticalError hideSignOut />
      </Modal>
    </>
  );
};

export default memo(RewardDetail);
