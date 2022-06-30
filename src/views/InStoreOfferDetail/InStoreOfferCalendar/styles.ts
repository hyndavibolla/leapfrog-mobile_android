import { css } from '@emotion/native';
import { COLOR, FONT_FAMILY, FONT_SIZE } from '_constants';

const styles = {
  container: css`
    flex-direction: row;
    background-color: ${COLOR.WHITE};
    padding: 16px 20px;
  `,
  calendar: css`
    margin-top: 8px;
  `,
  calendarLabel: css`
    color: ${COLOR.DARK_GRAY};
    font-size: ${FONT_SIZE.PETITE};
  `,
  rightCalendarContainer: css`
    margin-left: 16px;
  `,
  rowContainer: css`
    flex-direction: row;
    justify-content: center;
    align-item: center;
  `,
  itemCalendar: css`
    flex-direction: row;
    align-item: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 16px;
  `,
  dayLabel: css`
    color: ${COLOR.DARK_GRAY};
    font-family: ${FONT_FAMILY.MEDIUM};
    text-align: center;
  `
};

export default styles;
