// @flow
import React, {
  useState,
  useRef,
  type Element,
  type Node,
  useEffect,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { I18n } from 'libs/i18n';
import { Utils } from 'utils';
import { Avatar } from 'components/Avatar';
import { useFocusTrap } from '../../hooks';
import css from './Modal.scss';

type CustomElement = {
  component: string,
  props: Object,
};

export type Props = {
  element?: CustomElement | Element<any> | any,
  elementId?: string,
  body?: string | Element<any> | any,
  title?: string,
  openListener?: Function,
  open?: boolean,
  className?: string,
};

type ModalPropsExtended = Props & {
  modalKey?: string,
};

export type State = {
  open: boolean,
  modalHasFocus: boolean,
};

export const Modal = (props: Props): Node => {
  const {
    element,
    elementId,
    body,
    title,
    openListener,
    open: openProps,
    className,
  } = props;

  const [open, setOpen] = useState(!!openProps);
  const [isInteractive, setIsInteractive] = useState(false);
  const [modalHasFocus, setModalHasFocus] = useState(true);
  const modalEl = useRef(null);

  const toggleOpen = () => {
    const documentBody = ((document.body: any): HTMLBodyElement);
    if (!open) {
      documentBody.classList.add('bodyModalOpen');
    } else {
      documentBody.classList.remove('bodyModalOpen');
    }
    if (!open && openListener) {
      openListener();
    }
    setOpen(!open);
  };

  useFocusTrap(modalEl, open);

  useEffect(
    () => () => {
      const documentBody = ((document.body: any): HTMLBodyElement);
      documentBody.classList.remove('bodyModalOpen');
    },
    [],
  );

  const handleKeyPress = (
    event: SyntheticKeyboardEvent<HTMLDivElement>,
    keyName: string,
  ) => {
    if (event.key !== keyName) return;
    toggleOpen();
  };

  const displayModalHeader = () => (
    <div className={css.modalBoxHeader}>
      {title && (
        <div
          id="modalTitle"
          className={css.modalBoxHeaderTitle}
          aria-label={title}
        >
          {title}
        </div>
      )}
      <div
        className={`modalClose ${css.modalBoxHeaderClose}`}
        onClick={toggleOpen}
        onKeyDown={(event) => handleKeyPress(event, 'Enter')}
        role="button"
        tabIndex={0}
        aria-label={I18n.t('close')}
      >
        <FontAwesomeIcon icon={faTimes} color="#6D0839" />
      </div>
    </div>
  );

  const displayModalBody = () => (
    <div id="modalDesc" className={css.modalBoxBody}>
      {Utils.renderContent(body)}
    </div>
  );

  const handleClick = () => {
    if (modalHasFocus) return;
    toggleOpen();
  };

  const displayModalBox = () => (
    <div
      className={`modalBackdrop ${css.modalBackdrop}`}
      onClick={handleClick}
      onKeyDown={(event) => handleKeyPress(event, 'Escape')}
      tabIndex={-1}
      role="button"
    >
      <div
        className={`modal ${css.modalBox}`}
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDesc"
        onMouseOver={() => setModalHasFocus(true)}
        onMouseLeave={() => setModalHasFocus(false)}
        onFocus={() => setModalHasFocus(true)}
        onBlur={() => setModalHasFocus(false)}
        ref={modalEl}
      >
        {displayModalHeader()}
        {displayModalBody()}
      </div>
    </div>
  );

  const resolveComponent = (component: string) => {
    /** Really only returns Avatar right now but more could be added if needed */
    switch (component) {
      case 'Avatar':
      default:
        return Avatar;
    }
  };

  useEffect(() => {
    if (element && element.component) {
      const { props: elementProps } = element;
      setIsInteractive(!!elementProps.onClick);
    } else if (
      element
      && typeof element === 'object'
      && element.type === 'button'
    ) {
      setIsInteractive(true);
    }
  }, [element]);

  const resolveElement = () => {
    if (element) {
      return (
        <div
          id={elementId}
          className={`modalElement ${css.modalElement} ${className || ''}`}
          role={!isInteractive ? 'button' : undefined}
          tabIndex={!isInteractive ? 0 : undefined}
          onClick={!isInteractive ? toggleOpen : undefined}
          onKeyDown={
            !isInteractive ? (event) => handleKeyPress(event, 'Enter') : undefined
          }
        >
          {element && element.component
            ? React.createElement(resolveComponent(element.component), {
              ...element.props,
              tabIndex: !isInteractive ? 0 : undefined,
              onClick: !isInteractive ? toggleOpen : undefined,
              onKeyDown: !isInteractive
                ? (event) => handleKeyPress(event, 'Enter')
                : undefined,
            })
            : Utils.renderContent(
              element,
              typeof element === 'object' && element.type === 'button'
                ? {
                  tabIndex: 0,
                  onClick: toggleOpen,
                  onKeyDown: (event) => handleKeyPress(event, 'Enter'),
                }
                : {},
            )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {resolveElement()}
      {open ? displayModalBox() : null}
    </>
  );
};

export default ({
  element,
  elementId,
  title,
  openListener,
  open,
  body,
  modalKey,
  className,
}: ModalPropsExtended): Node => (
  <Modal
    element={element}
    elementId={elementId}
    title={title}
    openListener={openListener}
    body={body}
    open={open}
    key={modalKey}
    className={className}
  />
);
