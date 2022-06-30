import { ComponentProps } from 'react';

import Modal from './Modal';

export { default as ModalTitle } from './ModalTitle';
export { default as ModalSubtitle } from './ModalSubtitle';
export { default as Modal } from './Modal';
export { ModalType, ModalSize } from './utils/constants';

export type Props = ComponentProps<typeof Modal>;
