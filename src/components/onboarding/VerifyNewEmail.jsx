import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-phone-number-input/style.css';
import { withRouter, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import ReactCodeInput from 'react-code-input';
import { userController } from '../../controllers';
import '../../styles/VerifyEmail.scss';

function VerifyNewEmail({ uuid }) {
  const [user, setUser] = useState({});
  const [pinCode, setPinCode] = useState('');
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  let fetchedUser;

  useEffect(async () => {
    try {
      fetchedUser = await userController.getUser(uuid);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }

    setUser(fetchedUser);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await userController.confirmEmail(user.uuid, user.email, pinCode);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }

    history.push('/login');
  };

  const resendCode = async () => {
    try {
      await userController.resendCode(user.email);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }

    enqueueSnackbar('Verification code has been sent', {
      variant: 'success',
    });
  };

  return (
    <div className="verify-email">
      <div className="verify-email-inner container">
        <h2 className="title">{t('verifyEmail.verify')}</h2>
        <p className="subtitle">{t('verifyEmail.digitCode')}</p>
        <form className="verify-email-form" onSubmit={onSubmit}>
          <ReactCodeInput
            type="text"
            value={pinCode}
            fields={6}
            name="pinCode"
            onChange={(code) => setPinCode(code)}
          />
          <button type="button" className="resend" onClick={resendCode}>
            {t('verifyEmail.resendCode')}
          </button>
          <input
            type="submit"
            className="submit"
            value={t('verifyEmail.verifyButton')}
          />
        </form>
      </div>
    </div>
  );
}

export default withRouter(VerifyNewEmail);
