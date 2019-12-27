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
import { IFeedItemPollPayload } from '@feedfarm-shared/types';
import SubmitButton from '../SubmitButton';
import Button from '../Button';
import { Trans, useTranslation } from 'react-i18next';
import Textarea from '../Textarea';
import useProcessing from '../../hooks/use-processing';
import * as utils from 'feedfarm-shared/utils';
import useFormValidator from '../../hooks/use-form-validator';
import Icon from '../Icon';

function PollEditor(
  {
    onAdd,
    onCancel,
  }: {
    onAdd: (asset: IFeedItemPollPayload) => Promise<void>;
    onCancel: () => void;
  },
  ref: any,
) {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<string[]>(['', '']);
  const formValidator = useFormValidator({
    question,
    answer0: answers[0],
    answer1: answers[1],
  });
  const { t } = useTranslation();
  const processing = useProcessing();

  useImperativeHandle(ref, () => ({
    focus: () => {
      formValidator.refs.question?.current?.focus();
    },
  }));

  async function handleAdd() {
    if (formValidator.checkValidity()) {
      return;
    }

    processing.start();
    await onAdd({
      question,
      answers,
    });

    processing.stop();
    setQuestion('');
    setAnswers(['', '']);
  }

  function handleCancel() {
    formValidator.hideAlert();

    onCancel();
  }

  function handleAnswerChange(index: number, value: string) {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  function handleAddAnswer(e: React.MouseEvent) {
    e.preventDefault();
    const newAnswers = [...answers];
    newAnswers.push('');
    setAnswers(newAnswers);
  }

  function getAnswerPlaceholder(index: number) {
    if (index < 2) {
      return t('pollEditor.answerPlaceholder', 'Answer #{{index}}', {
        index: index + 1,
      });
    } else {
      return t(
        'pollEditor.optionalAnswerPlaceholder',
        'Answer #{{index}} (optional)',
        { index: index + 1 },
      );
    }
  }

  return (
    <form className={styles.wrapper}>
      <div className={styles.formField}>
        <div>
          <label className={styles.label} htmlFor="question">
            <Trans i18nKey="pollEditor.step1">
              What would you like to ask?
            </Trans>
          </label>
        </div>
        <div className="margin-h-sm" />
        <Input
          ref={formValidator.refs.question}
          id="question"
          size="lg"
          fullWidth
          placeholder=""
          value={question}
          onValueChange={setQuestion}
          disabled={processing.state}
        />
        <div className="margin-h-xlg" />
      </div>
      <div className={styles.formField}>
        <div>
          <label className={styles.label}>
            <Trans i18nKey="pollEditor.step2">Set answers</Trans>
          </label>
        </div>
        <div className="margin-h-sm" />
        {answers.map((answer, index) => (
          <div
            key={index}
            className={cx(
              styles.answer,
              index < 3 && index === answers.length - 1 && styles.last,
            )}
          >
            <div className={styles.answerInput}>
              <Input
                ref={formValidator.refs[`answer${index}`]}
                size="lg"
                fullWidth
                placeholder={getAnswerPlaceholder(index)}
                value={answer}
                onValueChange={handleAnswerChange.bind(null, index)}
                disabled={processing.state}
              />
            </div>
            <a
              href="#/add-answer"
              className={styles.addAnswerButton}
              onClick={handleAddAnswer}
            >
              <Icon icon="fa fa-plus" />
            </a>
          </div>
        ))}
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

export default forwardRef(PollEditor);
