import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import styles from './index.module.scss';
import Input from '../Input';
import { IFeedItemLinkPayload, IExtract } from '@feedfarm-shared/types';
import SubmitButton from '../SubmitButton';
import Button from '../Button';
import { Trans, useTranslation } from 'react-i18next';
import { parseTags } from 'feedfarm-shared/utils';
import useFormValidator from '../../hooks/use-form-validator';
import useFeed from '../../hooks/use-feed';
import { getExtract } from '../../firebase-functions';

function LinkEditor(
  {
    onAdd,
    onCancel,
  }: {
    onAdd: (asset: IFeedItemLinkPayload) => Promise<void>;
    onCancel: () => void;
  },
  ref: any,
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorCode, setErrorCode] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const { t } = useTranslation();
  const formValidator = useFormValidator({ title, tags, url });
  const feed = useFeed();

  useImperativeHandle(ref, () => ({
    focus: () => {
      formValidator.refs.title?.current?.focus();
    },
  }));

  async function handleAdd() {
    if (formValidator.checkValidity()) {
      return;
    }

    setIsProcessing(true);
    setErrorCode('');

    const urlWithSchema = url.match(/^http(s?):/) ? url : 'http://' + url;

    let extract = await getExtract({ url: urlWithSchema });

    const item: IFeedItemLinkPayload = {
      title,
      url: urlWithSchema,
      tags: parseTags(tags),
      extract: {
        url: urlWithSchema,
      },
    };

    if (!('error' in extract)) {
      item.extract = extract;
    }

    onAdd(item);
    setIsProcessing(false);
    setTitle('');
    setUrl('');
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
          {/* <div className={styles.stepIndicator}>1</div> */}
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
          disabled={isProcessing}
        />
        <div className="margin-h-xlg" />
      </div>
      <div className={styles.formField}>
        <div>
          <label className={styles.label} htmlFor="link">
            <Trans i18nKey="addAsset.step1">
              Paste a link to something that you want to share
            </Trans>
          </label>
        </div>
        <div className="margin-h-sm" />
        <Input
          ref={formValidator.refs.url}
          id="link"
          size="lg"
          fullWidth
          placeholder=""
          value={url}
          onValueChange={setUrl}
          disabled={isProcessing}
        />
        <div className="margin-h-xlg" />
      </div>
      {feed?.allowsTags && (
        <div className={styles.formField}>
          <div>
            {/* <div className={styles.stepIndicator}>3</div> */}
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
            disabled={isProcessing}
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
            showSpinner={isProcessing}
          />
        </div>
      </div>

      {errorCode && (
        <div className={styles.errorMessage}>
          {errorCode === 'extract-error' && (
            <Trans i18nKey="addAsset.errorMessage">
              Error trying to load the asset, try another?
            </Trans>
          )}
        </div>
      )}
    </form>
  );
}

export default forwardRef(LinkEditor);
