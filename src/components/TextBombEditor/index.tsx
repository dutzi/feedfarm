import React, {
  useState,
  useImperativeHandle,
  useRef,
  forwardRef,
  useEffect,
} from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Input from '../Input';
import {
  IFeedItemTextBombPayload,
  TTextBombStyle,
} from '@feedfarm-shared/types';
import SubmitButton from '../SubmitButton';
import Button from '../Button';
import { Trans, useTranslation } from 'react-i18next';
import Textarea from '../Textarea';
import useProcessing from '../../hooks/use-processing';
import * as utils from 'feedfarm-shared/utils';
import useFormValidator from '../../hooks/use-form-validator';
import TextBombRenderer from '../TextBombRenderer';
import Select from '../Select';

function TextBombEditor(
  {
    onAdd,
    onCancel,
  }: {
    onAdd: (asset: IFeedItemTextBombPayload) => Promise<void>;
    onCancel: () => void;
  },
  ref: any,
) {
  const [text, setText] = useState('');
  const [style, setStyle] = useState<TTextBombStyle>('pop');
  const formValidator = useFormValidator({
    text,
  });
  const { t } = useTranslation();
  const processing = useProcessing();

  useImperativeHandle(ref, () => ({
    focus: () => {
      formValidator.refs.text?.current?.focus();
    },
  }));

  async function handleAdd() {
    if (formValidator.checkValidity()) {
      return;
    }

    processing.start();
    await onAdd({
      text,
      style,
    });

    processing.stop();
    setText('');
    setStyle('pop');
  }

  function handleCancel() {
    formValidator.hideAlert();

    onCancel();
  }

  return (
    <form className={styles.wrapper}>
      <div className={styles.formField}>
        <div>
          <label className={styles.label} htmlFor="text">
            <Trans i18nKey="textBombEditor.step1">
              Post a message and it will animate nicely into the feed:
            </Trans>
          </label>
        </div>
        <div className="margin-h-sm" />
        <Input
          ref={formValidator.refs.text}
          id="text"
          size="lg"
          fullWidth
          placeholder=""
          value={text}
          onValueChange={setText}
          disabled={processing.state}
          maxLength={100}
          autoComplete="off"
        />
        <div className="margin-h-md" />
      </div>
      <div className={styles.formField}>
        <div>
          <label className={styles.label} htmlFor="style">
            <Trans i18nKey="textBombEditor.step2">
              Select which animation style you prefer
            </Trans>
          </label>
        </div>
        <div className="margin-h-sm" />
        <Select
          value={style}
          options={[
            { value: 'pop', label: 'Pop' },
            { value: 'skewyPop', label: 'Skewy Pop' },
            { value: 'wave', label: 'Wave' },
            { value: 'complex', label: 'Elevated' },
          ]}
          onValueChange={setStyle}
        />
        <div className="margin-h-xlg" />
      </div>
      <label className={styles.label}>
        <Trans i18nKey="textBombEditor.preview">Preview:</Trans>
      </label>

      <TextBombRenderer text={text} animationStyle={style} />
      <div className={styles.formField}>
        <div className="margin-h-xlg" />
      </div>
      <div className={styles.formFieldFlex}>
        <div className={styles.flex1} />
        <div className={styles.actionButtons}>
          <Button
            href="#cancel"
            label={t('Cancel')}
            variant="ghost"
            onClick={handleCancel}
            size="md"
          />
          <div className="margin-v-sm" />
          <SubmitButton
            label={t('addAsset.add', 'Add')}
            onClick={handleAdd}
            // disabled={isSubmitDisabled}
            showSpinner={processing.state}
          />
        </div>
      </div>
    </form>
  );
}

export default forwardRef(TextBombEditor);
