import React, {
  useState,
  useImperativeHandle,
  useRef,
  forwardRef,
  useEffect,
} from 'react';
import styles from './index.module.scss';
import Input from '../Input';
import { IFeedItemPostPayload } from '@feedfarm-shared/types';
import SubmitButton from '../SubmitButton';
import Button from '../Button';
import { Trans, useTranslation } from 'react-i18next';
import Textarea from '../Textarea';
import useProcessing from '../../hooks/use-processing';
import * as utils from 'feedfarm-shared/utils';
import useFormValidator from '../../hooks/use-form-validator';
import useFeed from '../../hooks/use-feed';

function PostEditor(
  {
    onAdd,
    onCancel,
  }: {
    onAdd: (asset: IFeedItemPostPayload) => Promise<void>;
    onCancel: () => void;
  },
  ref: any,
) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState('');
  const formValidator = useFormValidator({ title, tags, message });
  const { t } = useTranslation();
  const processing = useProcessing();
  const feed = useFeed();

  useImperativeHandle(ref, () => ({
    focus: () => {
      formValidator.refs.title?.current?.focus();
    },
  }));

  async function handleAdd() {
    if (formValidator.checkValidity()) {
      // if (formValidator.checkValidity(['tags'])) {
      return;
    }

    processing.start();
    await onAdd({
      title,
      message,
      tags: utils.parseTags(tags),
    });

    processing.stop();
    setTitle('');
    setMessage('');
    setTags('');
  }

  function handleCancel() {
    formValidator.hideAlert();

    onCancel();
  }

  return (
    <form className={styles.wrapper}>
      <div className={styles.formField}>
        <div>
          <label className={styles.label} htmlFor="title">
            <Trans i18nKey="addAsset.step0">Give your post a title</Trans>
          </label>
        </div>
        <div className="margin-h-sm" />
        <Input
          ref={formValidator.refs.title}
          id="title"
          size="lg"
          fullWidth
          placeholder=""
          value={title}
          onValueChange={setTitle}
          disabled={processing.state}
        />
        <div className="margin-h-xlg" />
      </div>
      <div className={styles.formField}>
        <div>
          <label className={styles.label} htmlFor="link">
            <Trans i18nKey="addPost.step1">What's on your mind?</Trans>
          </label>
        </div>
        <div className="margin-h-sm" />
        <Textarea
          ref={formValidator.refs.message}
          id="link"
          placeholder=""
          value={message}
          onValueChange={setMessage}
          resize="none"
          disabled={processing.state}
        />
        <div className="margin-h-xlg" />
      </div>
      {feed?.allowsTags && (
        <div className={styles.formField}>
          <div>
            <label className={styles.label} htmlFor="tags">
              <Trans i18nKey="addAsset.step2">Add hashtags</Trans>{' '}
            </label>
            <span
              aria-label={t(
                'addAsset.step2Description',
                'Space separated hashtags, use underscore for multi-worded hashtags',
              )}
              data-balloon-pos="up"
              data-balloon-multiline
              data-balloon-wide
              className={styles.subscriptLabel}
            >
              <i className="fa fa-info" />
            </span>
          </div>
          <div className="margin-h-sm" />
          <Input
            ref={formValidator.refs.tags}
            id="tags"
            size="lg"
            fullWidth
            placeholder={t('#ff #win #giveaway')}
            value={tags}
            onValueChange={setTags}
            disabled={processing.state}
          />
          <div className="margin-h-xlg" />
        </div>
      )}
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

export default forwardRef(PostEditor);
