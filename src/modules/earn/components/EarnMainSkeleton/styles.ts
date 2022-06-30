import { css } from '@emotion/native';

import { COLOR } from '_constants';

export const styles = {
  backGroundColor: css`
    background-color: ${COLOR.LIGHT_GRAY};
  `,
  body: css`
    padding: 60px 0;
  `,
  title: css`
    padding: 30px 15px 18px 15px;
  `,
  container: css`
    padding-horizontal: 15px;
  `,
  marginText: css`
    margin-top: 10px;
  `,
  mapSearch: css`
    margin-top: 14px;
    align-items: center;
    justify-content: center;
  `,
  cardMap: css`
    margin-top: 20px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 17px;
  `,
  cardDivisor: css`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 2px;
  `,
  cardDivisorDetail: css`
    width: 48%;
    margin-top: 15px;
  `,
  mission: css`
    padding-top: 15px;
    align-items: center;
    margin-left: 4%;
  `
};
